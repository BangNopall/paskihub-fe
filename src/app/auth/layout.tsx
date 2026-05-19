import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import Footer from "@/components/ui/footer"
import Navbar from "@/components/ui/navbar"

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session: any = await getServerSession(authOptions)

  const navigationData = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "About Us",
      href: "#",
    },
    {
      title: "Service",
      href: "#",
    },
    {
      title: "Contacts",
      href: "#",
    },
  ]

  return (
    <>
      <Navbar
        navigationData={navigationData}
        session={session}
        authAction="logout"
      />
      {children}
      <Footer />
    </>
  )
}

