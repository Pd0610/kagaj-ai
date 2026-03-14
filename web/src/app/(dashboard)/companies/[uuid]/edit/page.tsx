"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api-client";
import type { Company } from "@/types/models";
import { CompanyForm } from "../../company-form";
import { Loader2Icon } from "lucide-react";

export default function EditCompanyPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Company>(`/companies/${uuid}`)
      .then((res) => setCompany(res.data))
      .finally(() => setLoading(false));
  }, [uuid]);

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

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Edit {company.name_en}
        </h1>
        <p className="text-muted-foreground">
          Update company details
        </p>
      </div>
      <CompanyForm company={company} />
    </div>
  );
}
