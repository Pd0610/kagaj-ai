"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Building2, CheckCircle2, Download, Loader2, Plus, Sparkles } from "lucide-react";
import { api, ApiError } from "@/lib/api-client";
import type { Company, Document, Template, TemplateSlot } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── Company field mapping (mirrors backend) ─────────────

const COMPANY_FIELD_MAP: Record<string, keyof Company> = {
  company_name: "name",
  company_name_ne: "name_ne",
  registration_number: "registration_number",
  pan_number: "pan_number",
  address: "address",
};

// ── Slot Field Component ────────────────────────────────

function SlotField({
  slot,
  value,
  onChange,
  autoFilled,
}: {
  slot: TemplateSlot;
  value: string;
  onChange: (value: string) => void;
  autoFilled: boolean;
}) {
  const baseClass = autoFilled ? "bg-primary-subtle/30" : "";

  if (slot.type === "textarea") {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className={`flex min-h-[80px] w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm ${baseClass}`}
      />
    );
  }

  if (slot.type === "select" && slot.options) {
    return (
      <Select value={value} onValueChange={(val) => onChange(val ?? "")}>
        <SelectTrigger className={`w-full ${baseClass}`}>
          <SelectValue placeholder={`Select ${slot.label}`} />
        </SelectTrigger>
        <SelectContent>
          {slot.options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Input
      type={slot.type === "number" ? "number" : slot.type === "date" ? "date" : "text"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={baseClass}
    />
  );
}

// ── Main Page ───────────────────────────────────────────

export default function NewDocumentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");

  const [template, setTemplate] = useState<Template | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [slotValues, setSlotValues] = useState<Record<string, string>>({});
  const [autoFilledSlots, setAutoFilledSlots] = useState<Set<string>>(new Set());

  const [generating, setGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<Document | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load template + companies
  useEffect(() => {
    if (!templateId) {
      setError("No template selected.");
      setIsLoading(false);
      return;
    }

    void (async () => {
      try {
        const [tmpl, comps] = await Promise.all([
          api.get<Template>(`/templates/${templateId}`),
          api.get<Company[]>("/companies"),
        ]);
        setTemplate(tmpl);
        setCompanies(comps);

        // Init empty slot values
        const initial: Record<string, string> = {};
        if (tmpl.latest_schema) {
          for (const slot of tmpl.latest_schema.slots) {
            initial[slot.name] = "";
          }
        }
        setSlotValues(initial);
      } catch {
        setError("Failed to load template.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [templateId]);

  // Auto-fill when company selected
  const handleCompanyChange = useCallback(
    (companyId: string | null) => {
      setSelectedCompanyId(companyId);

      if (!template?.latest_schema) return;

      const company = companies.find((c) => c.id === companyId);
      const newValues = { ...slotValues };
      const newAutoFilled = new Set<string>();

      for (const slot of template.latest_schema.slots) {
        if (slot.source !== "company") continue;

        const companyField = COMPANY_FIELD_MAP[slot.name];
        if (!companyField || !company) {
          // Clear auto-filled value if company deselected
          if (autoFilledSlots.has(slot.name)) {
            newValues[slot.name] = "";
          }
          continue;
        }

        const companyValue = company[companyField];
        if (companyValue != null) {
          newValues[slot.name] = String(companyValue);
          newAutoFilled.add(slot.name);
        }
      }

      setSlotValues(newValues);
      setAutoFilledSlots(newAutoFilled);
    },
    [template, companies, slotValues, autoFilledSlots],
  );

  const slots = useMemo(() => {
    if (!template?.latest_schema) return [];
    const schema = template.latest_schema.slots;
    // Company-source slots first, then doc-specific
    const companySlots = schema.filter((s) => s.source === "company");
    const otherSlots = schema.filter((s) => s.source !== "company");
    return [...companySlots, ...otherSlots];
  }, [template]);

  const handleSlotChange = useCallback((name: string, value: string) => {
    setSlotValues((prev) => ({ ...prev, [name]: value }));
    // If user manually edits an auto-filled slot, remove auto-fill marker
    setAutoFilledSlots((prev) => {
      const next = new Set(prev);
      next.delete(name);
      return next;
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!template) return;
    setGenerating(true);
    setSubmitError(null);

    try {
      const doc = await api.post<Document>("/documents", {
        template_id: template.id,
        company_id: selectedCompanyId,
        slot_data: slotValues,
      });
      setGeneratedDoc(doc);

      // Auto-download PDF
      const blob = await api.downloadBlob(`/documents/${doc.id}/download`);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${doc.reference_number}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      if (err instanceof ApiError) {
        setSubmitError(err.message);
      } else {
        setSubmitError("Something went wrong. Please try again.");
      }
    } finally {
      setGenerating(false);
    }
  }, [template, selectedCompanyId, slotValues]);

  const handleDownloadAgain = useCallback(async () => {
    if (!generatedDoc) return;
    try {
      const blob = await api.downloadBlob(`/documents/${generatedDoc.id}/download`);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${generatedDoc.reference_number}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setSubmitError("Download failed. Please try again.");
    }
  }, [generatedDoc]);

  const handleGenerateAnother = useCallback(() => {
    setGeneratedDoc(null);
    setSubmitError(null);
    // Reset form values
    const initial: Record<string, string> = {};
    if (template?.latest_schema) {
      for (const slot of template.latest_schema.slots) {
        initial[slot.name] = "";
      }
    }
    setSlotValues(initial);
    setSelectedCompanyId(null);
    setAutoFilledSlots(new Set());
  }, [template]);

  // ── Loading state ────────────────────────────────────

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="h-6 w-48 animate-pulse rounded bg-muted" />
        <Card className="animate-pulse">
          <CardContent className="space-y-4 p-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="h-8 w-full rounded bg-muted" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/templates")}>
          <ArrowLeft className="h-4 w-4" data-icon="inline-start" />
          Back to Templates
        </Button>
        <p className="text-destructive">{error ?? "Template not found."}</p>
      </div>
    );
  }

  // ── Success state ────────────────────────────────────

  if (generatedDoc) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Button variant="ghost" size="sm" onClick={() => router.push("/templates")}>
          <ArrowLeft className="h-4 w-4" data-icon="inline-start" />
          Back to Templates
        </Button>

        <Card>
          <CardContent className="space-y-6 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-subtle">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>

            <div>
              <h2 className="text-xl font-semibold tracking-tight">Document generated!</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ref: {generatedDoc.reference_number}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" onClick={() => void handleDownloadAgain()}>
                <Download className="h-4 w-4" data-icon="inline-start" />
                Download Again
              </Button>
              <Button variant="outline" size="lg" onClick={handleGenerateAnother}>
                <Plus className="h-4 w-4" data-icon="inline-start" />
                Generate Another
              </Button>
            </div>

            {!selectedCompanyId && companies.length === 0 && (
              <div className="rounded-lg border border-dashed border-primary/30 bg-primary-subtle/20 p-4">
                <div className="flex items-center justify-center gap-2 text-sm text-primary-subtle-fg">
                  <Sparkles className="h-4 w-4" />
                  Save these details as a company for faster documents next time
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => router.push("/companies")}
                >
                  <Building2 className="h-4 w-4" data-icon="inline-start" />
                  Create Company
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Form state ───────────────────────────────────────

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push("/templates")}>
          <ArrowLeft className="h-4 w-4" data-icon="inline-start" />
          Back to Templates
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{template.name}</h1>
        {template.name_ne && (
          <p className="mt-0.5 text-base leading-[1.7] text-muted-foreground">
            {template.name_ne}
          </p>
        )}
      </div>

      <Card>
        <CardHeader className="pb-4">
          {companies.length > 0 && (
            <div className="space-y-2">
              <Label>
                <Building2 className="h-4 w-4" />
                Select Company (optional)
              </Label>
              <Select
                value={selectedCompanyId ?? ""}
                onValueChange={(val) => handleCompanyChange(val || null)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Quick Generate (no company)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Quick Generate (no company)</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                      {company.name_ne ? ` / ${company.name_ne}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {slots.map((slot) => (
            <div key={slot.name} className="space-y-2">
              <Label htmlFor={`slot-${slot.name}`}>
                <span>{slot.label}</span>
                {slot.label_ne && (
                  <span className="text-muted-foreground leading-[1.7]"> / {slot.label_ne}</span>
                )}
                {slot.required && <span className="text-destructive">*</span>}
              </Label>
              <SlotField
                slot={slot}
                value={slotValues[slot.name] ?? ""}
                onChange={(val) => handleSlotChange(slot.name, val)}
                autoFilled={autoFilledSlots.has(slot.name)}
              />
            </div>
          ))}

          {submitError && (
            <div className="rounded-lg bg-destructive-subtle p-3 text-sm text-destructive">
              {submitError}
            </div>
          )}

          <Button
            size="lg"
            className="w-full"
            disabled={generating}
            onClick={() => void handleSubmit()}
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" data-icon="inline-start" />
                Generating...
              </>
            ) : (
              "Generate & Download"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
