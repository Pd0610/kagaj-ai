"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import {
  ArrowRightIcon,
  Building2Icon,
  FileTextIcon,
  LayoutTemplateIcon,
  PlusIcon,
} from "lucide-react";

export default function DashboardPage() {
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState({ documents: 0, companies: 0, templates: 0 });

  useEffect(() => {
    api
      .get<{ name: string }>("/auth/me")
      .then((res) => setUserName(res.data.name.split(" ")[0] ?? ""))
      .catch(() => {});

    api
      .get<{ documents_count: number; companies_count: number; templates_count: number }>("/dashboard/stats")
      .then((res) => {
        setStats({
          documents: res.data.documents_count ?? 0,
          companies: res.data.companies_count ?? 0,
          templates: res.data.templates_count ?? 0,
        });
      })
      .catch(() => {});
  }, []);

  const greeting = getGreeting();

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {greeting}{userName ? `, ${userName}` : ""}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s an overview of your document workspace.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <FileTextIcon className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums">{stats.documents}</p>
              <p className="text-xs text-muted-foreground">Documents</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-accent">
              <Building2Icon className="size-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums">{stats.companies}</p>
              <p className="text-xs text-muted-foreground">Companies</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <LayoutTemplateIcon className="size-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums">{stats.templates}</p>
              <p className="text-xs text-muted-foreground">Templates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/templates" className="group">
            <div className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-md hover:border-primary/20">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <LayoutTemplateIcon className="size-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">Browse Templates</p>
                <p className="text-xs text-muted-foreground">
                  Choose a template to generate
                </p>
              </div>
              <ArrowRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          <Link href="/companies/new" className="group">
            <div className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-md hover:border-primary/20">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-accent">
                <PlusIcon className="size-5 text-accent-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">Add Company</p>
                <p className="text-xs text-muted-foreground">
                  Register a new company
                </p>
              </div>
              <ArrowRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          <Link href="/documents" className="group">
            <div className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-md hover:border-primary/20">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <FileTextIcon className="size-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">My Documents</p>
                <p className="text-xs text-muted-foreground">
                  View generated documents
                </p>
              </div>
              <ArrowRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>
      </div>

      {/* Get started CTA — shown when no documents yet */}
      {stats.documents === 0 && (
        <div className="rounded-xl border-2 border-dashed border-primary/20 bg-primary/[0.02] p-8 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 mb-4">
            <FileTextIcon className="size-7 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Ready to generate your first document?</h3>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-md mx-auto">
            Browse templates, fill in your company details, and generate
            government-compliant documents in minutes.
          </p>
          <Button size="lg" className="mt-5" render={<Link href="/templates" />}>
            Get Started
            <ArrowRightIcon className="ml-2 size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
