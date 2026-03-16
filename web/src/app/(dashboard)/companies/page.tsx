"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  Building2,
  Landmark,
  Handshake,
  User,
  Heart,
  Users,
  Hash,
  CreditCard,
  MapPin,
  Pencil,
  Trash2,
  Crown,
} from "lucide-react";
import { api, ApiError } from "@/lib/api-client";
import type { Company } from "@/types/models";
import { CompanyType, CompanyTypeLabels, Plan } from "@/types/models";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LucideIcon } from "lucide-react";

// ── Company type visual config ───────────────────────────

interface TypeConfig {
  icon: LucideIcon;
  bg: string;
  fg: string;
}

const companyTypeConfig: Record<CompanyType, TypeConfig> = {
  [CompanyType.PvtLtd]: { icon: Building2, bg: "bg-primary-subtle", fg: "text-primary-subtle-fg" },
  [CompanyType.PublicLtd]: { icon: Landmark, bg: "bg-info-subtle", fg: "text-info" },
  [CompanyType.Partnership]: { icon: Handshake, bg: "bg-success-subtle", fg: "text-success" },
  [CompanyType.SoleProprietorship]: { icon: User, bg: "bg-warning-subtle", fg: "text-warning" },
  [CompanyType.Ngo]: { icon: Heart, bg: "bg-destructive-subtle", fg: "text-destructive" },
  [CompanyType.Cooperative]: { icon: Users, bg: "bg-gold/10", fg: "text-gold-foreground" },
};

// ── Form fields (shared between create & edit) ──────────

function CompanyFormFields({
  defaults,
  selectedType,
  onTypeChange,
}: {
  defaults?: Company;
  selectedType: string;
  onTypeChange: (v: string) => void;
}) {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Company Name *</Label>
        <Input
          id="name"
          name="name"
          required
          defaultValue={defaults?.name ?? ""}
          placeholder="e.g. Nepal Tech Pvt. Ltd."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name_ne">Company Name (Nepali)</Label>
        <Input
          id="name_ne"
          name="name_ne"
          defaultValue={defaults?.name_ne ?? ""}
          placeholder="e.g. नेपाल टेक प्रा. लि."
        />
      </div>

      <div className="space-y-2">
        <Label>Company Type *</Label>
        <Select
          name="type"
          value={selectedType}
          onValueChange={(v) => onTypeChange(v ?? "")}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(CompanyType).map((type) => (
              <SelectItem key={type} value={type}>
                {CompanyTypeLabels[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="registration_number">Registration No.</Label>
          <Input
            id="registration_number"
            name="registration_number"
            defaultValue={defaults?.registration_number ?? ""}
            placeholder="REG-123456"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pan_number">PAN Number</Label>
          <Input
            id="pan_number"
            name="pan_number"
            defaultValue={defaults?.pan_number ?? ""}
            placeholder="123456789"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          defaultValue={defaults?.address ?? ""}
          placeholder="Kathmandu, Nepal"
        />
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────

export default function CompaniesPage() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [selectedType, setSelectedType] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Delete confirmation
  const [deletingCompany, setDeletingCompany] = useState<Company | null>(null);
  const [deleting, setDeleting] = useState(false);

  const isFree = user?.plan === Plan.Free;
  const atLimit = isFree && companies.length >= 1;

  const fetchCompanies = useCallback(async () => {
    try {
      const data = await api.get<Company[]>("/companies");
      setCompanies(data);
    } catch {
      // silently fail — user will see empty state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCompanies();
  }, [fetchCompanies]);

  function openCreate() {
    setDialogMode("create");
    setEditingCompany(null);
    setSelectedType("");
    setError("");
    setDialogOpen(true);
  }

  function openEdit(company: Company) {
    setDialogMode("edit");
    setEditingCompany(company);
    setSelectedType(company.type);
    setError("");
    setDialogOpen(true);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name") as string,
      name_ne: (form.get("name_ne") as string) || null,
      type: selectedType,
      registration_number: (form.get("registration_number") as string) || null,
      pan_number: (form.get("pan_number") as string) || null,
      address: (form.get("address") as string) || null,
    };

    try {
      if (dialogMode === "edit" && editingCompany) {
        await api.put<Company>(`/companies/${editingCompany.id}`, payload);
      } else {
        await api.post<Company>("/companies", payload);
      }
      setDialogOpen(false);
      setSelectedType("");
      setEditingCompany(null);
      void fetchCompanies();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deletingCompany) return;
    setDeleting(true);
    try {
      await api.delete(`/companies/${deletingCompany.id}`);
      setDeletingCompany(null);
      void fetchCompanies();
    } catch {
      // silently fail
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Companies</h1>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 w-32 rounded bg-muted" />
                <div className="h-4 w-20 rounded bg-muted" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Companies</h1>
          <p className="text-sm text-muted-foreground">
            Manage your registered companies
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isFree && companies.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {companies.length} of 1 company
            </span>
          )}
          {atLimit ? (
            <button
              onClick={() => {/* TODO: upgrade flow */}}
              className="flex items-center gap-1.5 rounded-md bg-gold/10 px-4 py-2 text-sm font-medium text-gold-foreground transition-colors hover:bg-gold/20"
            >
              <Crown className="h-4 w-4" />
              Upgrade to add more
            </button>
          ) : (
            <Button onClick={openCreate}>Add Company</Button>
          )}
        </div>
      </div>

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={onSubmit} key={editingCompany?.id ?? "create"}>
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "edit" ? "Edit Company" : "Add Company"}
              </DialogTitle>
              <DialogDescription>
                {dialogMode === "edit"
                  ? "Update your company details."
                  : "Register a new company to generate documents for."}
              </DialogDescription>
            </DialogHeader>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <CompanyFormFields
              defaults={editingCompany ?? undefined}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting
                  ? dialogMode === "edit"
                    ? "Saving..."
                    : "Creating..."
                  : dialogMode === "edit"
                    ? "Save Changes"
                    : "Create Company"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deletingCompany !== null}
        onOpenChange={(open) => { if (!open) setDeletingCompany(null); }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Company</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{deletingCompany?.name}&rdquo;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDeletingCompany(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {companies.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-primary-subtle p-3">
              <Building2 className="h-6 w-6 text-primary-subtle-fg" />
            </div>
            <h3 className="text-lg font-medium">No companies yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Add your first company to start generating official documents.
            </p>
            <Button className="mt-4" onClick={openCreate}>
              Add Your First Company
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => {
            const config = companyTypeConfig[company.type];
            const Icon = config.icon;

            return (
              <Card
                key={company.id}
                className="group flex cursor-pointer flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                onClick={() => openEdit(company)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.bg}`}>
                        <Icon className={`h-5 w-5 ${config.fg}`} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-semibold leading-tight">
                          {company.name}
                        </h3>
                        {company.name_ne && (
                          <p className="mt-0.5 truncate text-sm leading-[1.7] text-muted-foreground">
                            {company.name_ne}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEdit(company);
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive-subtle hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingCompany(company);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col space-y-3 pt-0">
                  {/* Info rows */}
                  <div className="space-y-1.5">
                    {company.registration_number && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Hash className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{company.registration_number}</span>
                      </div>
                    )}
                    {company.pan_number && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CreditCard className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{company.pan_number}</span>
                      </div>
                    )}
                    {company.address && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{company.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer: type badge + date — always at bottom */}
                  <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
                    <Badge
                      variant="secondary"
                      className={`${config.bg} ${config.fg} border-transparent`}
                    >
                      {CompanyTypeLabels[company.type]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(company.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
