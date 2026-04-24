import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { LayoutDashboardIcon, ListIcon, Wallet, FolderIcon, UsersIcon, FileChartColumnIcon, TrophyIcon, UsersRound, FileText } from "lucide-react"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Beranda",
      url: "/organizer/dashboard/",
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
      url: "/organizer/dashboard/team",
      icon: (
        <UsersIcon
        />
      ),
    },
    {
      title: "Data Juri",
      url: "/organizer/dashboard/jury",
      icon: (
        <UsersRound />
      ),
    },
    {
      title: "Sistem Penilaian",
      url: "/organizer/dashboard/assessment-system",
      icon: (
        <FolderIcon
        />
      ),
    },
    {
      title: "Sistem Juara",
      url: "/organizer/dashboard/ranking-system",
      icon: (
        <TrophyIcon
        />
      ),
    },
    {
      title: "Form Penilaian",
      url: "/organizer/dashboard/assessment-form",
      icon: (
        <FileText
        />
      ),
    },
    {
      title: "Rekap Nilai",
      url: "/organizer/dashboard/score-recap",
      icon: (
        <FileChartColumnIcon
        />
      ),
    },
  ],
}

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

export default function DashboardOrganizerLayout({
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
