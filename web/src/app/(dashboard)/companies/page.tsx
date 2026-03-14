"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import type { Company } from "@/types/models";
import { COMPANY_TYPE_LABELS } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2Icon,
  FileTextIcon,
  Loader2Icon,
  PlusIcon,
  UsersIcon,
} from "lucide-react";

export default function CompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Company[]>("/companies")
      .then((res) => setCompanies(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2Icon className="mr-2 size-4 animate-spin" />
        Loading companies...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>My Companies</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your companies for quick document generation
          </p>
        </div>
        <Button onClick={() => router.push("/companies/new")}>
          <PlusIcon className="size-4" />
          Add Company
        </Button>
      </div>

      {/* Content */}
      {companies.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-primary/20 bg-primary/[0.02]">
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 mb-4">
              <Building2Icon className="size-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">No companies yet</h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              Add your company details once and auto-fill them across all
              document templates.
            </p>
            <Button
              className="mt-6"
              onClick={() => router.push("/companies/new")}
            >
              <PlusIcon className="size-4" />
              Add Your First Company
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <Link key={company.uuid} href={`/companies/${company.uuid}`}>
              <div className="card-hover rounded-xl p-5 h-full">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Building2Icon className="size-5 text-primary" />
                  </div>
                  <Badge variant="outline" className="shrink-0 text-xs">
                    {COMPANY_TYPE_LABELS[company.company_type]}
                  </Badge>
                </div>

                <div className="min-w-0 mb-3">
                  <p className="font-semibold text-sm truncate">
                    {company.name_en}
                  </p>
                  {company.name_ne && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {company.name_ne}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {company.pan_number && (
                    <span className="font-mono">PAN: {company.pan_number}</span>
                  )}
                  {company.members && company.members.length > 0 && (
                    <span className="flex items-center gap-1">
                      <UsersIcon className="size-3" />
                      {company.members.length}
                    </span>
                  )}
                  {company.documents_count !== undefined &&
                    company.documents_count > 0 && (
                      <span className="flex items-center gap-1">
                        <FileTextIcon className="size-3" />
                        {company.documents_count}
                      </span>
                    )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
