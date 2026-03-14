"use client";

import { useEffect, useState, useReducer } from "react";
import Link from "next/link";
import { api, type PaginatedEnvelope } from "@/lib/api-client";
import type { Document as DocType } from "@/types/models";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileTextIcon, Loader2Icon, PlusIcon, Trash2Icon } from "lucide-react";

const statusVariants: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  completed: "default",
  draft: "outline",
  generating: "secondary",
  failed: "destructive",
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocType[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [refreshKey, refresh] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    let cancelled = false;

    void api.get<DocType[]>("/documents").then((res) => {
      if (cancelled) return;
      const envelope = res as unknown as PaginatedEnvelope<DocType>;
      setDocuments(envelope.data);
      setLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const handleDelete = async (uuid: string) => {
    if (!confirm("Delete this document?")) return;
    await api.delete(`/documents/${uuid}`);
    refresh();
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2Icon className="mr-2 size-4 animate-spin" />
        Loading documents...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>My Documents</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Documents you&apos;ve generated
          </p>
        </div>
        <Link href="/templates" className={cn(buttonVariants())}>
          <PlusIcon className="size-4" />
          New Document
        </Link>
      </div>

      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/20 bg-primary/[0.02] py-16">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 mb-4">
            <FileTextIcon className="size-7 text-primary" />
          </div>
          <p className="font-medium">No documents yet</p>
          <Link
            href="/templates"
            className={cn(buttonVariants({ variant: "link" }), "mt-1")}
          >
            Browse templates to create your first
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.uuid}>
                  <TableCell>
                    <Link
                      href={`/documents/${doc.uuid}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {doc.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {doc.template_name ?? doc.template_slug}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[doc.status] ?? "secondary"}>
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleDelete(doc.uuid)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2Icon className="size-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
