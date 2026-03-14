"use client";

import { useMemo, useCallback } from "react";
import { usePDF } from "@react-pdf/renderer";

// Import fonts — side-effect registration
import "@/lib/pdf/fonts";
import { getPdfDocument } from "@/lib/pdf/template-registry";

interface UsePdfDocumentProps {
  templateSlug: string;
  slotData: Record<string, unknown>;
  title: string;
}

export function usePdfDocument({
  templateSlug,
  slotData,
  title,
}: UsePdfDocumentProps) {
  const document = useMemo(
    () => getPdfDocument(templateSlug, slotData),
    [templateSlug, slotData],
  );

  const [instance] = usePDF({ document: document ?? undefined });

  const handleDownload = useCallback(() => {
    if (!instance.url) return;
    const a = window.document.createElement("a");
    a.href = instance.url;
    a.download = `${title}.pdf`;
    a.click();
  }, [instance.url, title]);

  return {
    url: instance.url,
    loading: instance.loading,
    error: instance.error,
    handleDownload,
    hasTemplate: !!document,
  };
}
