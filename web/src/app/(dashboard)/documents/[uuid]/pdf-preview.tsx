"use client";

import Link from "next/link";
import { usePdfDocument } from "@/components/pdf-document";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  ClockIcon,
  DownloadIcon,
  FileTextIcon,
  FileWarningIcon,
  Loader2Icon,
} from "lucide-react";

interface PdfPreviewProps {
  templateSlug: string;
  slotData: Record<string, unknown>;
  title: string;
  status: string;
  createdAt: string;
}

const statusConfig: Record<
  string,
  {
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: typeof CheckCircle2Icon;
    label: string;
  }
> = {
  completed: {
    variant: "default",
    icon: CheckCircle2Icon,
    label: "Completed",
  },
  draft: { variant: "outline", icon: ClockIcon, label: "Draft" },
  generating: { variant: "secondary", icon: Loader2Icon, label: "Generating" },
  failed: {
    variant: "destructive",
    icon: FileWarningIcon,
    label: "Failed",
  },
};

export default function PdfPreview({
  templateSlug,
  slotData,
  title,
  status,
  createdAt,
}: PdfPreviewProps) {
  const { url, loading, error, handleDownload, hasTemplate } = usePdfDocument({
    templateSlug,
    slotData,
    title,
  });

  const statusInfo = statusConfig[status] ?? statusConfig["draft"]!;
  const StatusIcon = statusInfo.icon;
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col">
      {/* Toolbar — compact, inside the viewer */}
      <div className="flex shrink-0 items-center justify-between border-b bg-card px-4 py-2.5">
        {/* Left: back + doc info */}
        <div className="flex items-center gap-3 overflow-hidden">
          <Link
            href="/documents"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ArrowLeftIcon className="size-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold leading-tight">
              {title}
            </h1>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge
                variant={statusInfo.variant}
                className="h-[18px] gap-1 px-1.5 text-[10px]"
              >
                <StatusIcon className="size-2.5" />
                {statusInfo.label}
              </Badge>
              <span className="hidden sm:inline">{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Right: download */}
        <Button
          size="sm"
          onClick={handleDownload}
          disabled={!url || loading}
          className="shrink-0 gap-2"
        >
          {loading ? (
            <Loader2Icon className="size-3.5 animate-spin" />
          ) : (
            <DownloadIcon className="size-3.5" />
          )}
          <span className="hidden sm:inline">Download PDF</span>
          <span className="sm:hidden">PDF</span>
        </Button>
      </div>

      {/* Viewer area — fills remaining height, scrolls internally */}
      <div className="relative flex-1 overflow-auto bg-stone-100 dark:bg-neutral-950">
        {!hasTemplate ? (
          <CenteredMessage icon={FileTextIcon} message="PDF template not available for this document type." />
        ) : loading ? (
          <CenteredMessage icon={Loader2Icon} message="Generating your document..." iconClassName="animate-spin" />
        ) : error ? (
          <CenteredMessage icon={FileWarningIcon} message={`Generation failed: ${error}`} />
        ) : url ? (
          <div className="flex justify-center p-6 sm:p-8">
            <iframe
              src={`${url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
              title="PDF Preview"
              className="block w-full max-w-[680px] rounded-sm bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.05)] ring-1 ring-black/5"
              style={{ aspectRatio: "210 / 297" }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CenteredMessage({
  icon: Icon,
  message,
  iconClassName,
}: {
  icon: typeof FileWarningIcon;
  message: string;
  iconClassName?: string;
}) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-center">
        <Icon className={`size-8 text-muted-foreground/30 ${iconClassName ?? ""}`} />
        <p className="max-w-xs text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
