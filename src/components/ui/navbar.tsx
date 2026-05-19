"use client"
import { MenuIcon, LogOutIcon, LoaderIcon } from "lucide-react"
import { Montserrat } from "@/lib/fonts"
import { useEffect, useState } from "react"
import type { Session } from "next-auth"
import { signOut } from "next-auth/react"
import { logoutAction } from "@/actions/auth.actions"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

type NavigationItem = {
  title: string
  href: string
}[]

const Navbar = ({
  navigationData,
  session,
  authAction = "dashboard",
}: {
  navigationData: NavigationItem
  session: Session | null
  authAction?: "dashboard" | "logout"
}) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const getDashboardUrl = () => {
    const role = (session as any)?.user?.role
    if (role === "ADMIN") return "/admin/dashboard"
    if (role === "ORGANIZER") return "/organizer/dashboard"
    return "/peserta/dashboard"
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logoutAction()
      await signOut({ callbackUrl: "/auth/login" })
    } catch {
      setIsLoggingOut(false)
    }
  }

  const renderAuthButton = () => {
    if (!session) {
      return (
        <Link href="/auth/login">
          <Button
            variant="secondary"
            className="px-7 py-4 leading-6 font-bold"
          >
            Masuk
          </Button>
        </Link>
      )
    }

    if (authAction === "logout") {
      return (
        <Button
          variant="secondary"
          className="px-7 py-4 leading-6 font-bold"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOutIcon className="mr-2 h-4 w-4" />
          )}
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      )
    }

    return (
      <Link href={getDashboardUrl()}>
        <Button
          variant="secondary"
          className="px-7 py-4 leading-6 font-bold"
        >
          Dashboard
        </Button>
      </Link>
    )
  }

  return (
    <header
      className={`sticky top-0 z-50 bg-background transition-all duration-300 ${isScrolled ? "bg-background drop-shadow-lg" : "bg-transparent"}`}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-7 sm:gap-8 sm:px-6">
        <Link
          href={`#`}
          className={`${Montserrat.className} justify-start text-3xl leading-9 font-bold text-dark-blue`}
        >
          PaskiHub
        </Link>
        <div className="flex flex-1 items-center gap-8 font-medium text-neutral-700 md:justify-center lg:gap-16">
          {navigationData.map((item, index) => (
            <a
              href={item.href}
              key={index}
              className="hover:text-primary max-md:hidden"
            >
              {item.title}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-6">
          {renderAuthButton()}
          <DropdownMenu>
            <DropdownMenuTrigger className="md:hidden" asChild>
              <Button variant="outline" size="icon">
                <MenuIcon />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                {navigationData.map((item, index) => (
                  <DropdownMenuItem key={index}>
                    <a href={item.href}>{item.title}</a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default Navbar


