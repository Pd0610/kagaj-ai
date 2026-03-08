"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSyncExternalStore, useState } from "react";
import { api } from "@/lib/api-client";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  FileTextIcon,
  LayoutTemplateIcon,
  LogOutIcon,
  MenuIcon,
  UserIcon,
  XIcon,
} from "lucide-react";

const emptySubscribe = () => () => {};

const navItems = [
  { href: "/templates", label: "Templates", icon: LayoutTemplateIcon },
  { href: "/documents", label: "My Documents", icon: FileTextIcon },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check auth synchronously — redirect if no token
  const hasToken = useSyncExternalStore(
    emptySubscribe,
    () => !!localStorage.getItem("token"),
    () => false,
  );

  if (!hasToken) {
    router.replace("/login");
    return null;
  }

  async function handleLogout() {
    try {
      await api.post("/auth/logout");
    } catch {
      // Even if the API call fails, clear token locally
    }
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/templates" className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
                K
              </div>
              <span className="text-lg font-bold tracking-tight">KagajAI</span>
            </Link>

            <Separator orientation="vertical" className="hidden h-6 sm:block" />

            <nav className="hidden items-center gap-1 sm:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    buttonVariants({
                      variant: pathname.startsWith(item.href)
                        ? "secondary"
                        : "ghost",
                      size: "sm",
                    }),
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
              >
                <UserIcon className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="bottom" sideOffset={8}>
                <DropdownMenuItem onClick={handleLogout} variant="destructive">
                  <LogOutIcon className="size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XIcon className="size-4" />
              ) : (
                <MenuIcon className="size-4" />
              )}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t px-4 py-3 sm:hidden">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    buttonVariants({
                      variant: pathname.startsWith(item.href)
                        ? "secondary"
                        : "ghost",
                      size: "sm",
                    }),
                    "justify-start",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              ))}
              <Separator className="my-1" />
              <Button
                variant="ghost"
                size="sm"
                className="justify-start text-destructive"
                onClick={handleLogout}
              >
                <LogOutIcon className="size-4" />
                Logout
              </Button>
            </nav>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
