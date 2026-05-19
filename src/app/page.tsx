import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import Navbar from "@/components/ui/navbar"
import HomePage from "./(home)/page"
import Footer from "@/components/ui/footer"

export default async function Page() {
  const session: any = await getServerSession(authOptions)

  const navigationData = [
    {
      title: "Home",
      href: "#",
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
      <Navbar navigationData={navigationData} session={session} />
      <HomePage />
      <Footer />
    </>
  )
}
