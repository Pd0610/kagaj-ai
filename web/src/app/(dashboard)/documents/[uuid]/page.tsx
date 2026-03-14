"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { api } from "@/lib/api-client";
import type { Document as DocType } from "@/types/models";
import { Loader2Icon } from "lucide-react";

const PdfPreview = dynamic(() => import("./pdf-preview"), {
  ssr: false,
  loading: () => <DocumentSkeleton />,
});

function DocumentSkeleton() {
  return (
    <div className="flex flex-col items-center gap-6 pt-8">
      {/* Toolbar skeleton */}
      <div className="w-full max-w-[720px] px-4">
        <div className="h-12 animate-pulse rounded-xl bg-muted" />
      </div>
      {/* Page skeleton */}
      <div
        className="w-full max-w-[620px] animate-pulse rounded-sm bg-muted"
        style={{ aspectRatio: "210 / 297" }}
      />
    </div>
  );
}

export default function DocumentDetailPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const [document, setDocument] = useState<DocType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<DocType>(`/documents/${uuid}`)
      .then((res) => setDocument(res.data))
      .finally(() => setLoading(false));
  }, [uuid]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2Icon className="size-4 animate-spin" />
          <span>Loading document...</span>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <p className="text-sm text-muted-foreground">Document not found.</p>
        <Link
          href="/documents"
          className="text-sm font-medium underline underline-offset-4 hover:text-foreground"
        >
          Back to documents
        </Link>
      </div>
    );
  }

  return (
    <div className="-mx-4 -mt-6 -mb-6 sm:-mx-6">
      {document.slot_data && document.template_slug ? (
        <PdfPreview
          templateSlug={document.template_slug}
          slotData={document.slot_data as Record<string, unknown>}
          title={document.title}
          status={document.status}
          createdAt={document.created_at}
        />
      ) : (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
          <p className="text-sm text-muted-foreground">
            No document data available.
          </p>
          <Link
            href="/documents"
            className="text-sm font-medium underline underline-offset-4 hover:text-foreground"
          >
            Back to documents
          </Link>
        </div>
      )}
    </div>
  );
}
