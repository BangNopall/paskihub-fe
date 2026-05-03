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
} from "lucide-react"

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

import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { profileService } from "@/services/profile.service"

export default async function DashboardPesertaLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session: any = await getServerSession(authOptions)
  if (!session) redirect("/auth/login")

  const response = await profileService.getPesertaProfile(session.accessToken)
  const pesertaData = response

  if (
    !pesertaData ||
    (Array.isArray(pesertaData) && pesertaData.length === 0) ||
    !pesertaData.institution
  ) {
    redirect("/auth/register/peserta/data-form")
  }

  const inst = pesertaData.institution
  const isProfileIncomplete =
    !inst.name ||
    !inst.address ||
    !inst.institution_type ||
    !inst.name_pj ||
    !inst.no_wa_pj

  if (isProfileIncomplete) {
    redirect("/auth/register/peserta/data-form")
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
