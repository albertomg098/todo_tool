"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Calendar, CalendarDays, HelpCircle } from "lucide-react";
import { UserButton, SignInButton, useUser, Show } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { LanguageSwitcher } from "./LanguageSwitcher";

const navItems = [
  { labelKey: "today" as const, href: "/", icon: Calendar },
  { labelKey: "week" as const, href: "/week", icon: CalendarDays },
  { labelKey: "help" as const, href: "/help", icon: HelpCircle },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const t = useTranslations("nav");

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Daily Stack</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href)
                  }
                  tooltip={t(item.labelKey)}
                  render={<Link href={item.href} />}
                >
                  <item.icon />
                  <span>{t(item.labelKey)}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="px-2 py-1.5 group-data-[collapsible=icon]:hidden">
              <LanguageSwitcher />
            </div>
          </SidebarMenuItem>
          <SidebarSeparator />
          <SidebarMenuItem>
            <Show when="signed-in">
              <div className="flex items-center gap-2 px-2 py-1.5">
                <UserButton />
                <span className="truncate text-sm group-data-[collapsible=icon]:hidden">
                  {user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? ""}
                </span>
              </div>
            </Show>
            <Show when="signed-out">
              <SignInButton>
                <SidebarMenuButton className="cursor-pointer">
                  <span>{t("signIn")}</span>
                </SidebarMenuButton>
              </SignInButton>
            </Show>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
