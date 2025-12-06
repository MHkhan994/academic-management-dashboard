"use client";
import {
  GraduationCap,
  Home,
  School,
  Settings,
  UserCog,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ThemeSwitcher from "./ThemeSwitcher";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Students",
    url: "/students",
    icon: Users,
  },
  {
    title: "Courses",
    url: "/courses",
    icon: GraduationCap,
  },
  {
    title: "Faculty Members",
    url: "/faculty-members",
    icon: UserCog,
  },
  {
    title: "Faculty Panel",
    url: "/faculty-panel",
    icon: School,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: Settings,
  },
];

function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-none" collapsible="icon">
      <SidebarContent className="flex justify-between">
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className={cn(
                        isActive ? "bg-primary text-primary-foreground" : "",
                        "h-10 text-base font-medium"
                      )}
                      asChild
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem className="mt-auto">
              <SidebarMenuButton asChild className="flex w-full justify-center">
                <ThemeSwitcher />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail className="hover:after:bg-transparent" />
    </Sidebar>
  );
}

export default AppSidebar;
