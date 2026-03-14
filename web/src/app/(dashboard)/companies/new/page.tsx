"use client";

import { CompanyForm } from "../company-form";

export default function NewCompanyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      <div>
        <h1>Add Company</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your company details once. They&apos;ll be auto-filled in all
          future documents.
        </p>
      </div>
      <CompanyForm />
    </div>
  );
}
