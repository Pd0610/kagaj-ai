"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api-client";
import type { Document as DocType } from "@/types/models";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowLeftIcon,
  DownloadIcon,
  Loader2Icon,
} from "lucide-react";

const statusVariants: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  completed: "default",
  draft: "outline",
  generating: "secondary",
  failed: "destructive",
};

export default function DocumentDetailPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const [document, setDocument] = useState<DocType | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<DocType>(`/documents/${uuid}`),
      api.get<{ html: string }>(`/documents/${uuid}/preview`),
    ])
      .then(([docRes, previewRes]) => {
        setDocument(docRes.data);
        setPreviewHtml(previewRes.data.html);
      })
      .finally(() => setLoading(false));
  }, [uuid]);

  const handleDownload = useCallback(async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

    const res = await fetch(`${baseUrl}/api/v1/documents/${uuid}/download`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return;

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `${document?.title ?? "document"}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [uuid, document]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2Icon className="mr-2 size-4 animate-spin" />
        Loading document...
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Document not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {document.title}
          </h1>
          <div className="flex items-center gap-2">
            <Badge variant={statusVariants[document.status] ?? "secondary"}>
              {document.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Created {new Date(document.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/documents"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <ArrowLeftIcon className="size-4" />
            Back
          </Link>
          {document.status === "completed" && (
            <Button onClick={handleDownload}>
              <DownloadIcon className="size-4" />
              Download PDF
            </Button>
          )}
        </div>
      </div>

      {previewHtml && (
        <Card>
          <CardContent className="p-0">
            <iframe
              srcDoc={previewHtml}
              title="Document Preview"
              className="h-[800px] w-full rounded-lg"
              sandbox="allow-same-origin"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
