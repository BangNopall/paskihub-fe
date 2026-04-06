"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, ListIcon, Wallet, FolderIcon, UsersIcon, FileChartColumnIcon } from "lucide-react"
import { Montserrat } from "@/lib/fonts"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Beranda",
      url: "#",
      icon: (
        <LayoutDashboardIcon
        />
      ),
    },
    {
      title: "My Event",
      url: "/organizer/dashboard/event",
      icon: (
        <ListIcon
        />
      ),
    },
    {
      title: "Wallet",
      url: "/organizer/dashboard/wallet",
      icon: (
        <Wallet />
      ),
    },
    {
      title: "Tim",
      url: "#",
      icon: (
        <UsersIcon
        />
      ),
    },
    {
      title: "Penilaian",
      url: "#",
      icon: (
        <FolderIcon
        />
      ),
    },
    {
      title: "Rekap Nilai",
      url: "#",
      icon: (
        <FileChartColumnIcon
        />
      ),
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <span className={`text-dark-blue text-2xl font-bold ${Montserrat.className}`}>PaskiHub</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
