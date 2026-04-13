"use client"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

export function SiteHeader() {
  const pathname = usePathname()
  const navMain = [
    {
      title: "My Event",
      url: "/organizer/dashboard/event",
    },
    {
      title: "Wallet",
      url: "/organizer/dashboard/wallet",
    },
    {
      title: "Tim",
      url: "/organizer/dashboard/team",
    },
    {
      title: "Data Juri",
      url: "/organizer/dashboard/jury",
    },
    {
      title: "Sistem Penilaian",
      url: "/organizer/dashboard/assessment",
    },
    {
      title: "Sistem Juara",
      url: "/organizer/dashboard/ranking-system",
    },
    {
      title: "Rekap Nilai",
      url: "/organizer/dashboard/score-recap",
    },
  ]

  let title
  if (pathname === "/organizer/dashboard") {
    title = "Beranda"
  }else{
    title = navMain.find((item) => pathname.startsWith(item.url))?.title
  }

    return (
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-8"
        />
        <h1 className="text-base font-medium">{title}</h1>
      </div>
    </header>
  )
}
