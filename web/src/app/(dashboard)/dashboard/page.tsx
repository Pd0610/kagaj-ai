"use client";

import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileTextIcon, LayoutTemplateIcon } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Your documents and usage at a glance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <LayoutTemplateIcon className="size-5" />
              </div>
              <div>
                <CardTitle>Browse Templates</CardTitle>
                <CardDescription>
                  Choose from available document templates
                </CardDescription>
              </div>
            </div>
            <Link
              href="/templates"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "mt-3 w-fit",
              )}
            >
              View Templates
            </Link>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileTextIcon className="size-5" />
              </div>
              <div>
                <CardTitle>My Documents</CardTitle>
                <CardDescription>
                  View and manage your generated documents
                </CardDescription>
              </div>
            </div>
            <Link
              href="/documents"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "mt-3 w-fit",
              )}
            >
              View Documents
            </Link>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
