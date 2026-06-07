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
      href: "/#home",
    },
    {
      title: "About Us",
      href: "/#about",
    },
    {
      title: "Service",
      href: "/#service",
    },
    {
      title: "Contacts",
      href: "/#contact",
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
