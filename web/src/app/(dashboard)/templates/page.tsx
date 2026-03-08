"use client";

import { Suspense } from "react";
import { TemplatesContent } from "./templates-content";

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
        <p className="text-muted-foreground">
          Choose a document template to get started.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            Loading templates...
          </div>
        }
      >
        <TemplatesContent />
      </Suspense>
    </div>
  );
}
