import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  ListIcon,
  Wallet,
  FolderIcon,
  UsersIcon,
  FileChartColumnIcon,
  TrophyIcon,
  UsersRound,
  FileText,
  User,
} from "lucide-react"

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
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "My Event",
      url: "/organizer/dashboard/event",
      icon: <ListIcon />,
    },
    {
      title: "Profil",
      url: "/organizer/dashboard/profile",
      icon: <User />,
    },
    {
      title: "Wallet",
      url: "/organizer/dashboard/wallet",
      icon: <Wallet />,
    },
    {
      title: "Tim",
      url: "/organizer/dashboard/team",
      icon: <UsersIcon />,
    },
    {
      title: "Data Juri",
      url: "/organizer/dashboard/jury",
      icon: <UsersRound />,
    },
    {
      title: "Sistem Penilaian",
      url: "/organizer/dashboard/assessment-system",
      icon: <FolderIcon />,
    },
    {
      title: "Sistem Juara",
      url: "/organizer/dashboard/ranking-system",
      icon: <TrophyIcon />,
    },
    {
      title: "Form Penilaian",
      url: "/organizer/dashboard/assessment-form",
      icon: <FileText />,
    },
    {
      title: "Rekap Nilai",
      url: "/organizer/dashboard/score-recap",
      icon: <FileChartColumnIcon />,
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

import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { profileService } from "@/services/profile.service"

export default async function DashboardOrganizerLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session: any = await getServerSession(authOptions)
  if (!session) redirect("/auth/login")

  const response = await profileService.getEventsByUserId(
    session.accessToken,
    session.user.id
  )
  const events = response || []

  if (events.length === 0) {
    redirect("/auth/register/eo/data-form")
  }

  const event = events[0]
  const isProfileIncomplete =
    !event.bank_name ||
    !event.bank_number ||
    !event.close_date ||
    !event.location ||
    (!event.name_pj && !event.nama_pj) ||
    !event.name ||
    !event.no_wa_pj ||
    !event.open_date ||
    !event.organizer

  if (isProfileIncomplete) {
    redirect("/auth/register/eo/data-form")
  }

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
          <div className="container mx-auto">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
