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
    <Sidebar className="border-r border-sidebar-border bg-sidebar backdrop-blur-none">
      <SidebarHeader className="border-b border-sidebar-border px-4 h-16 flex items-center">
        <Link 
          href="/" 
          className="flex items-center gap-3 group"
          aria-label="MoltBot Dashboard - Go to home"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 shadow-lg shadow-orange-500/25 transition-all group-hover:scale-105 group-hover:shadow-orange-500/40 group-hover:shadow-xl">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <LayoutDashboard className="relative h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-lg font-semibold bg-gradient-to-r from-orange-500 via-orange-400 to-sky-500 bg-clip-text text-transparent">
              MoltBot
            </h1>
            <p className="text-xs text-muted-foreground font-medium tracking-wide">KI für KMU</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel id="nav-label" className="px-2 text-xs font-medium text-muted-foreground/80 tracking-wider uppercase">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu aria-labelledby="nav-label" role="navigation" className="space-y-1">
              {navigationItems.map((item, index) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.href}
                    className={`min-h-11 rounded-lg transition-all duration-200 animate-staggered-fade ${
                      pathname === item.href
                        ? 'bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 text-orange-500 shadow-lg shadow-orange-500/10'
                        : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border border-transparent hover:border-sidebar-border/50'
                    }`}
                    style={{ animationDelay: `${index * 75}ms` }}
                  >
                    <Link href={item.href} aria-label={item.label} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" aria-hidden="true" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/50 p-4">
        <div className="text-xs text-muted-foreground/80 space-y-1">
          <p className="font-medium bg-gradient-to-r from-orange-500/80 to-sky-500/80 bg-clip-text text-transparent">
            MoltBot Dashboard v1.0
          </p>
          <p className="text-[11px] font-mono tracking-wide">Next.js 16 • shadcn/ui</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
