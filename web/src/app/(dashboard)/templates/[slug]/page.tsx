"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api-client";
import type {
  Template,
  TemplateSlot,
  SlotGroup,
  Document as DocType,
} from "@/types/models";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2Icon, MinusIcon, PlusIcon } from "lucide-react";

type SlotData = Record<string, unknown>;

export default function TemplateFormPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<SlotData>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Template>(`/templates/${slug}`)
      .then((res) => {
        setTemplate(res.data);
        if (res.data.schema) {
          setFormData(buildDefaults(res.data.schema.slots));
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!template) return;

      setSubmitting(true);
      setErrors({});

      try {
        const res = await api.post<DocType>("/documents", {
          template_slug: template.slug,
          slot_data: formData,
          language: "ne",
        });
        router.push(`/documents/${res.data.uuid}`);
      } catch (err) {
        if (err instanceof ApiError && err.body.errors) {
          setErrors(err.body.errors as Record<string, string[]>);
        } else {
          setErrors({ _general: ["Something went wrong. Please try again."] });
        }
      } finally {
        setSubmitting(false);
      }
    },
    [template, formData, router],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2Icon className="mr-2 size-4 animate-spin" />
        Loading template...
      </div>
    );
  }

  if (!template || !template.schema) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Template not found.
      </div>
    );
  }

  const { slots, groups } = template.schema;
  const sortedGroups = [...(groups ?? [])].sort((a, b) => a.order - b.order);
  const slotsByGroup = groupSlots(slots, sortedGroups);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{template.name}</h1>
        <p className="text-lg text-muted-foreground">{template.name_ne}</p>
        {template.description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {template.description}
          </p>
        )}
      </div>

      {errors._general && (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errors._general.join(", ")}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {sortedGroups.map((group) => (
          <Card key={group.key}>
            <CardHeader>
              <CardTitle>{group.label_en}</CardTitle>
              {group.label_ne && (
                <CardDescription>{group.label_ne}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {(slotsByGroup[group.key] ?? []).map((slot) => (
                <SlotField
                  key={slot.key}
                  slot={slot}
                  value={formData[slot.key]}
                  errors={errors}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, [slot.key]: val }))
                  }
                />
              ))}
            </CardContent>
          </Card>
        ))}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={submitting}
        >
          {submitting && <Loader2Icon className="mr-2 size-4 animate-spin" />}
          {submitting ? "Generating..." : "Generate Document"}
        </Button>
      </form>
    </div>
  );
}

// --- Field components ---

function SlotField({
  slot,
  value,
  errors,
  onChange,
}: {
  slot: TemplateSlot;
  value: unknown;
  errors: Record<string, string[]>;
  onChange: (val: unknown) => void;
}) {
  if (slot.type === "repeatable") {
    return (
      <RepeatableField
        slot={slot}
        value={value as Record<string, unknown>[] | undefined}
        errors={errors}
        onChange={onChange}
      />
    );
  }

  const fieldErrors = errors[slot.key];
  const inputType = getInputType(slot.type);

  return (
    <div className="space-y-2">
      <Label>
        {slot.label_en}
        {slot.label_ne && (
          <span className="ml-1 font-normal text-muted-foreground">
            ({slot.label_ne})
          </span>
        )}
        {slot.required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>

      {slot.type === "textarea" || slot.type === "textarea_ne" ? (
        <textarea
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="flex min-h-[80px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive"
          placeholder={slot.ai_hint}
          aria-invalid={!!fieldErrors}
        />
      ) : (
        <Input
          type={inputType}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={slot.ai_hint ?? getPlaceholder(slot.type)}
          aria-invalid={!!fieldErrors}
        />
      )}

      {fieldErrors && (
        <p className="text-xs text-destructive">{fieldErrors.join(", ")}</p>
      )}
    </div>
  );
}

function RepeatableField({
  slot,
  value,
  errors,
  onChange,
}: {
  slot: TemplateSlot;
  value: Record<string, unknown>[] | undefined;
  errors: Record<string, string[]>;
  onChange: (val: unknown) => void;
}) {
  const items = value ?? [];
  const fields = slot.fields ?? [];
  const minItems = slot.min_items ?? 0;
  const maxItems = slot.max_items ?? 20;

  const addItem = () => {
    const emptyItem: Record<string, string> = {};
    for (const f of fields) {
      emptyItem[f.key] = "";
    }
    onChange([...items, emptyItem]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, fieldKey: string, val: string) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [fieldKey]: val } : item,
    );
    onChange(updated);
  };

  const groupErrors = errors[slot.key];

  return (
    <Card className="bg-muted/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Label>
            {slot.label_en}
            {slot.label_ne && (
              <span className="ml-1 font-normal text-muted-foreground">
                ({slot.label_ne})
              </span>
            )}
            {slot.required && (
              <span className="ml-0.5 text-destructive">*</span>
            )}
          </Label>
          {items.length < maxItems && (
            <Button type="button" variant="outline" size="xs" onClick={addItem}>
              <PlusIcon className="size-3" />
              Add
            </Button>
          )}
        </div>
        {groupErrors && (
          <p className="text-xs text-destructive">{groupErrors.join(", ")}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No items yet. Click &quot;Add&quot; to add one.
          </p>
        )}

        {items.map((item, index) => (
          <Card key={index} size="sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline">#{index + 1}</Badge>
                {items.length > minItems && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => removeItem(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <MinusIcon className="size-3" />
                    Remove
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {fields.map((field) => {
                  const fieldErrorKey = `${slot.key}.${index}.${field.key}`;
                  const fieldErrors = errors[fieldErrorKey];

                  return (
                    <div key={field.key} className="space-y-1.5">
                      <Label className="text-xs">
                        {field.label_en}
                        {field.required && (
                          <span className="ml-0.5 text-destructive">*</span>
                        )}
                      </Label>
                      <Input
                        type="text"
                        value={(item[field.key] as string) ?? ""}
                        onChange={(e) =>
                          updateItem(index, field.key, e.target.value)
                        }
                        placeholder={field.ai_hint ?? field.label_ne}
                        aria-invalid={!!fieldErrors}
                      />
                      {fieldErrors && (
                        <p className="text-xs text-destructive">
                          {fieldErrors.join(", ")}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

// --- Helpers ---

function buildDefaults(slots: TemplateSlot[]): SlotData {
  const data: SlotData = {};
  for (const slot of slots) {
    if (slot.default !== undefined) {
      data[slot.key] = slot.default;
    } else if (slot.type === "repeatable") {
      data[slot.key] = [];
    } else {
      data[slot.key] = "";
    }
  }
  return data;
}

function groupSlots(
  slots: TemplateSlot[],
  groups: SlotGroup[],
): Record<string, TemplateSlot[]> {
  const result: Record<string, TemplateSlot[]> = {};
  for (const g of groups) {
    result[g.key] = [];
  }

  const sorted = [...slots].sort(
    (a, b) => (a.display_order ?? 999) - (b.display_order ?? 999),
  );

  for (const slot of sorted) {
    const group = slot.group ?? "default";
    if (!result[group]) result[group] = [];
    result[group].push(slot);
  }

  return result;
}

function getInputType(slotType: string): string {
  switch (slotType) {
    case "email":
      return "email";
    case "phone":
      return "tel";
    case "number":
    case "currency":
      return "number";
    default:
      return "text";
  }
}

function getPlaceholder(slotType: string): string | undefined {
  switch (slotType) {
    case "date_bs":
      return "e.g. २०८२/०८/०७";
    case "phone":
      return "e.g. 9841XXXXXX";
    default:
      return undefined;
  }
}
