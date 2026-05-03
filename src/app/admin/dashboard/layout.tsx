import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  Users,
  CreditCard,
  Settings,
  Megaphone,
  History,
  ShieldCheck,
  User,
} from "lucide-react"

const data = {
  user: {
    name: "Super Admin",
    email: "admin@paskihub.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Overview",
      url: "/admin/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Manajemen User",
      url: "/admin/dashboard/users",
      icon: <Users />,
    },
    {
      title: "Kelola Admin",
      url: "/admin/dashboard/admins",
      icon: <ShieldCheck />,
    },
    {
      title: "Transaksi Koin",
      url: "/admin/dashboard/transactions",
      icon: <CreditCard />,
    },
    {
      title: "Konfigurasi",
      url: "/admin/dashboard/settings",
      icon: <Settings />,
    },
  ],
}

// Breadcrumb/Quick Nav for SiteHeader
const navHeader = [
  {
    title: "Manajemen User",
    url: "/admin/dashboard/users",
  },
  {
    title: "Kelola Admin",
    url: "/admin/dashboard/admins",
  },
  {
    title: "Transaksi Koin",
    url: "/admin/dashboard/transactions",
  },
  {
    title: "Pengaturan Admin",
    url: "/admin/dashboard/settings",
  },
]

export default function SuperAdminLayout({
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
        <SiteHeader navMain={navHeader} />
        <div className="h-full w-full bg-[url('/frame.png')] bg-cover bg-no-repeat">
          <div className="container mx-auto">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
