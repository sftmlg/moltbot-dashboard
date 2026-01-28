"use client";

import {
  Home,
  LayoutDashboard,
  MessageSquare,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", href: "/", icon: Home, label: "Go to dashboard" },
  { title: "Chat", href: "/chat", icon: MessageSquare, label: "Open chat" },
  { title: "Settings", href: "/settings", icon: Settings, label: "Open settings" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4 md:px-6">
        <Link 
          href="/" 
          className="flex items-center gap-3 group min-h-11"
          aria-label="MoltBot Dashboard - Go to home"
        >
          <div className="flex h-10 w-10 md:h-9 md:w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25 transition-all group-hover:scale-105 group-hover:shadow-orange-500/40">
            <LayoutDashboard className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-lg font-semibold bg-gradient-to-r from-orange-500 to-sky-500 bg-clip-text text-transparent">MoltBot</h1>
            <p className="text-xs text-muted-foreground">KI für KMU</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel id="nav-label">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu aria-labelledby="nav-label" role="navigation">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.href}
                    className="min-h-11 md:min-h-9"
                  >
                    <Link href={item.href} aria-label={item.label}>
                      <item.icon className="h-5 w-5 md:h-4 md:w-4" aria-hidden="true" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-4">
        <div className="text-xs text-muted-foreground">
          <p>MoltBot Dashboard v1.0</p>
          <p className="mt-1">Next.js 16 • shadcn/ui</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
