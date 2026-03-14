"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import {
  Building2Icon,
  ChevronsUpDownIcon,
  FileTextIcon,
  LayoutTemplateIcon,
  LogOutIcon,
  PanelLeftIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navItems = [
  { href: "/templates", label: "Templates", icon: LayoutTemplateIcon },
  { href: "/companies", label: "Companies", icon: Building2Icon },
  { href: "/documents", label: "My Documents", icon: FileTextIcon },
];

function getBreadcrumb(pathname: string): string {
  if (pathname.startsWith("/documents")) return "Documents";
  if (pathname.startsWith("/templates")) return "Templates";
  if (pathname.startsWith("/companies")) return "Companies";
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  return "Dashboard";
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [hasToken, setHasToken] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    } else {
      setHasToken(true);
      api
        .get<{ name: string; email: string }>("/auth/me")
        .then((res) => setUserName(res.data.name))
        .catch(() => {});
    }
    setAuthChecked(true);
  }, [router]);

  if (!authChecked || !hasToken) {
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

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex items-center justify-between">
                <SidebarMenuButton
                  size="lg"
                  render={<Link href="/templates" />}
                  className="flex-1"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                    K
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                    <span className="font-semibold tracking-tight text-foreground">
                      KagajAI
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Document Platform
                    </span>
                  </div>
                </SidebarMenuButton>
                <SidebarTrigger className="size-8 shrink-0 text-muted-foreground hover:text-foreground" />
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={pathname.startsWith(item.href)}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton
                      size="lg"
                      className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
                    />
                  }
                >
                  <Avatar className="size-8 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 leading-none text-left group-data-[collapsible=icon]:hidden">
                    <span className="truncate text-sm font-medium">
                      {userName || "Account"}
                    </span>
                  </div>
                  <ChevronsUpDownIcon className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="min-w-56"
                  align="start"
                >
                  <DropdownMenuItem onClick={handleLogout} variant="destructive">
                    <LogOutIcon className="size-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>{getBreadcrumb(pathname)}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="flex-1 px-6 py-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
