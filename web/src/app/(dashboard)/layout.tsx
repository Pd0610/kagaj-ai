"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Building2, FileText, Crown } from "lucide-react";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { Plan, PlanLabels } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/templates", label: "Templates", icon: FileText },
] as const;

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const isFree = user?.plan === Plan.Free;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link
              href="/companies"
              className="text-lg font-semibold tracking-tight text-primary"
            >
              KagajAI
            </Link>
            <nav className="flex items-center gap-1">
              {navItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {isFree && (
              <button
                onClick={() => {/* TODO: upgrade flow */}}
                className="flex items-center gap-1 rounded-full bg-gold/10 px-2.5 py-1 text-xs font-medium text-gold-foreground transition-colors hover:bg-gold/20"
              >
                <Crown className="h-3 w-3" />
                Upgrade
              </button>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {user?.name}
              </span>
              {user?.plan && (
                <Badge
                  variant="secondary"
                  className={
                    user.plan === Plan.Pro
                      ? "bg-gold/10 text-gold-foreground"
                      : undefined
                  }
                >
                  {PlanLabels[user.plan]}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await logout();
                router.push("/login");
              }}
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  );
}
