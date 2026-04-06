import Footer from "@/components/ui/footer"
import Navbar from "@/components/ui/navbar"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
      <Navbar navigationData={navigationData} />
      {children}
      <Footer />
    </>
  )
}
