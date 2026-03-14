"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api-client";
import type { Company, CompanyMember, MemberRole } from "@/types/models";
import {
  COMPANY_TYPE_LABELS,
  MEMBER_ROLE_LABELS,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EditIcon,
  Loader2Icon,
  PlusIcon,
  Trash2Icon,
  UserPlusIcon,
} from "lucide-react";
import { NepaliInput } from "@/components/nepali-input";

const MEMBER_ROLES = Object.entries(MEMBER_ROLE_LABELS) as [
  MemberRole,
  string,
][];

export default function CompanyDetailPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchCompany = useCallback(() => {
    api
      .get<Company>(`/companies/${uuid}`)
      .then((res) => setCompany(res.data))
      .finally(() => setLoading(false));
  }, [uuid]);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  async function handleDelete() {
    if (!confirm("Delete this company? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await api.delete(`/companies/${uuid}`);
      router.push("/companies");
    } catch {
      setDeleting(false);
    }
  }

  async function handleDeleteMember(memberUuid: string) {
    if (!confirm("Remove this member?")) return;
    try {
      await api.delete(`/companies/${uuid}/members/${memberUuid}`);
      fetchCompany();
    } catch {
      // silently fail
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2Icon className="mr-2 size-4 animate-spin" />
        Loading...
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Company not found.
      </div>
    );
  }

  const members = company.members ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {company.name_en}
          </h1>
          {company.name_ne && (
            <p className="text-lg text-muted-foreground">{company.name_ne}</p>
          )}
          <Badge variant="outline" className="mt-2">
            {COMPANY_TYPE_LABELS[company.company_type]}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/companies/${uuid}/edit`)}
          >
            <EditIcon className="size-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
            className="text-destructive hover:text-destructive"
          >
            <Trash2Icon className="size-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Company Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Company Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <Detail label="Registration No." value={company.registration_number} />
            <Detail label="PAN" value={company.pan_number} />
            <Detail label="VAT" value={company.vat_number} />
            <Detail label="Incorporation" value={company.incorporation_date} />
            <Detail
              label="Address"
              value={
                [company.tole_en, company.ward ? `Ward ${company.ward}` : null, company.municipality_en, company.district_en]
                  .filter(Boolean)
                  .join(", ") || null
              }
            />
            <Detail label="Sector" value={company.sector} />
            <Detail
              label="Authorized Capital"
              value={company.authorized_capital ? `NPR ${(company.authorized_capital / 100).toLocaleString()}` : null}
            />
            <Detail
              label="Paid-up Capital"
              value={company.paid_up_capital ? `NPR ${(company.paid_up_capital / 100).toLocaleString()}` : null}
            />
            <Detail label="Phone" value={company.phone} />
            <Detail label="Email" value={company.email} />
            <Detail label="Bank" value={company.bank_name} />
            <Detail label="Auditor" value={company.auditor_name} />
          </dl>
        </CardContent>
      </Card>

      {/* Members */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">
                Members ({members.length})
              </CardTitle>
              <CardDescription>
                Directors, shareholders, and other roles
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMemberForm(!showMemberForm)}
            >
              <UserPlusIcon className="size-4" />
              Add Member
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showMemberForm && (
            <MemberForm
              companyUuid={uuid}
              onSaved={() => {
                setShowMemberForm(false);
                fetchCompany();
              }}
              onCancel={() => setShowMemberForm(false)}
            />
          )}

          {members.length === 0 && !showMemberForm && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No members added yet. Add directors and shareholders for
              auto-filled documents.
            </p>
          )}

          {members.map((member) => (
            <div
              key={member.uuid}
              className="flex items-start justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{member.name_en}</span>
                  {member.name_ne && (
                    <span className="text-muted-foreground">
                      ({member.name_ne})
                    </span>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {MEMBER_ROLE_LABELS[member.role]}
                  </Badge>
                  {member.is_chairperson && (
                    <Badge className="text-xs">Chairperson</Badge>
                  )}
                  {member.is_managing_director && (
                    <Badge className="text-xs">MD</Badge>
                  )}
                </div>
                <div className="mt-1 flex gap-4 text-xs text-muted-foreground">
                  {member.citizenship_number && (
                    <span>Citizenship: {member.citizenship_number}</span>
                  )}
                  {member.share_count !== null && member.share_count > 0 && (
                    <span>
                      Shares: {member.share_count}
                      {member.share_percentage
                        ? ` (${member.share_percentage}%)`
                        : ""}
                    </span>
                  )}
                  {member.phone && <span>{member.phone}</span>}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-destructive hover:text-destructive"
                onClick={() => handleDeleteMember(member.uuid)}
              >
                <Trash2Icon className="size-3.5" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Action */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-center justify-between py-4">
          <div>
            <p className="font-medium">Generate a document</p>
            <p className="text-sm text-muted-foreground">
              Company data will be auto-filled into the template
            </p>
          </div>
          <Button onClick={() => router.push("/templates")}>
            Browse Templates
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

function MemberForm({
  companyUuid,
  onSaved,
  onCancel,
}: {
  companyUuid: string;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [form, setForm] = useState({
    role: "director" as MemberRole,
    name_en: "",
    name_ne: "",
    father_name_en: "",
    father_name_ne: "",
    grandfather_name_en: "",
    grandfather_name_ne: "",
    citizenship_number: "",
    citizenship_issued_district: "",
    citizenship_issued_date: "",
    district_en: "",
    district_ne: "",
    municipality_en: "",
    municipality_ne: "",
    ward: "",
    phone: "",
    email: "",
    share_count: "",
    share_percentage: "",
    appointment_date: "",
    is_chairperson: false,
    is_managing_director: false,
  });

  function set(key: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const payload: Record<string, unknown> = { role: form.role, name_en: form.name_en };
    for (const [key, value] of Object.entries(form)) {
      if (key === "role" || key === "name_en") continue;
      if (typeof value === "boolean") {
        payload[key] = value;
      } else if (value !== "") {
        if (key === "share_count") {
          payload[key] = parseInt(value, 10) || 0;
        } else if (key === "share_percentage") {
          payload[key] = parseFloat(value) || 0;
        } else {
          payload[key] = value;
        }
      }
    }

    try {
      await api.post<CompanyMember[]>(
        `/companies/${companyUuid}/members`,
        { members: [payload] },
      );
      onSaved();
    } catch (err) {
      if (err instanceof ApiError && err.body.errors) {
        setErrors(err.body.errors as Record<string, string[]>);
      }
    } finally {
      setSubmitting(false);
    }
  }

  const showShares = form.role === "shareholder" || form.role === "partner";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-muted/30 p-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">
          <PlusIcon className="mr-1 inline size-4" />
          Add Member
        </h4>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>
            Role <span className="text-destructive">*</span>
          </Label>
          <Select
            value={form.role}
            onValueChange={(val) => { if (val) set("role", val); }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MEMBER_ROLES.map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>
            Name (English) <span className="text-destructive">*</span>
          </Label>
          <Input
            value={form.name_en}
            onChange={(e) => set("name_en", e.target.value)}
            placeholder="Ram Bahadur Thapa"
            aria-invalid={!!errors["members.0.name_en"]}
          />
        </div>
        <div className="space-y-2">
          <Label>Name (Nepali)</Label>
          <NepaliInput
            value={form.name_ne}
            onChange={(val) => set("name_ne", val)}
            placeholder="राम बहादुर थापा"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Father&apos;s Name (English)</Label>
          <Input
            value={form.father_name_en}
            onChange={(e) => set("father_name_en", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Father&apos;s Name (Nepali)</Label>
          <NepaliInput
            value={form.father_name_ne}
            onChange={(val) => set("father_name_ne", val)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Grandfather&apos;s Name (English)</Label>
          <Input
            value={form.grandfather_name_en}
            onChange={(e) => set("grandfather_name_en", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Grandfather&apos;s Name (Nepali)</Label>
          <NepaliInput
            value={form.grandfather_name_ne}
            onChange={(val) => set("grandfather_name_ne", val)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Citizenship Number</Label>
          <Input
            value={form.citizenship_number}
            onChange={(e) => set("citizenship_number", e.target.value)}
            placeholder="12-34-56-78901"
          />
        </div>
        <div className="space-y-2">
          <Label>Issued District</Label>
          <Input
            value={form.citizenship_issued_district}
            onChange={(e) => set("citizenship_issued_district", e.target.value)}
            placeholder="Kathmandu"
          />
        </div>
        <div className="space-y-2">
          <Label>Issued Date</Label>
          <Input
            type="date"
            value={form.citizenship_issued_date}
            onChange={(e) => set("citizenship_issued_date", e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>District</Label>
          <Input
            value={form.district_en}
            onChange={(e) => set("district_en", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Municipality</Label>
          <Input
            value={form.municipality_en}
            onChange={(e) => set("municipality_en", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Ward</Label>
          <Input
            value={form.ward}
            onChange={(e) => set("ward", e.target.value)}
          />
        </div>
      </div>

      {showShares && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Share Count</Label>
            <Input
              type="number"
              value={form.share_count}
              onChange={(e) => set("share_count", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Share Percentage</Label>
            <Input
              type="number"
              step="0.01"
              value={form.share_percentage}
              onChange={(e) => set("share_percentage", e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Appointment Date</Label>
          <Input
            type="date"
            value={form.appointment_date}
            onChange={(e) => set("appointment_date", e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_chairperson}
            onChange={(e) => set("is_chairperson", e.target.checked)}
            className="rounded"
          />
          Chairperson
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_managing_director}
            onChange={(e) => set("is_managing_director", e.target.checked)}
            className="rounded"
          />
          Managing Director
        </label>
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting && <Loader2Icon className="mr-2 size-4 animate-spin" />}
        Add Member
      </Button>
    </form>
  );
}
