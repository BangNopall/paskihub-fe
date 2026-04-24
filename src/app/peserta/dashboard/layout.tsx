import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { LayoutDashboardIcon, ListIcon, Wallet, FolderIcon, UsersIcon, FileChartColumnIcon, TrophyIcon, UsersRound, FileText } from "lucide-react"

const data = {
  user: {
    name: "nopal",
    email: "nopal@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Beranda",
      url: "/peserta/dashboard/",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Profil",
      url: "/peserta/dashboard/profile",
      icon: <ListIcon />,
    },
    {
      title: "My Team",
      url: "/peserta/dashboard/team",
      icon: <UsersIcon />,
    },
    {
      title: "Events",
      url: "/peserta/dashboard/event",
      icon: <TrophyIcon />,
    },
  ],
}

const navMain = [
    {
      title: "Profile",
      url: "/peserta/dashboard/profile",
    },
    {
      title: "My Team",
      url: "/peserta/dashboard/team",
    },
    {
      title: "Events",
      url: "/peserta/dashboard/event",
    },
    {
      title: "Data Juri",
      url: "/organizer/dashboard/jury",
    },
    {
      title: "Sistem Penilaian",
      url: "/organizer/dashboard/assessment-system",
    },
    {
      title: "Form Penilaian",
      url: "/organizer/dashboard/assessment-form",
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

export default function DashboardPesertaLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" items={data.navMain} user={data.user} />
      <SidebarInset className="overflow-hidden">
        <SiteHeader navMain={navMain} />
        <div className="h-full w-full bg-[url('/frame.png')] bg-cover bg-no-repeat">
          <div className="container mx-auto">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
