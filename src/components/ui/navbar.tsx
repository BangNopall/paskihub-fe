"use client"
import { MenuIcon, LogOutIcon, LoaderIcon } from "lucide-react"
import { Montserrat } from "@/lib/fonts"
import { useCallback, useEffect, useState } from "react"
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

const NAVBAR_OFFSET = 100

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
  const [activeSection, setActiveSection] = useState("")

  const handleScrollToSection = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith("#")) return

      e.preventDefault()
      const targetId = href.replace("#", "")
      const element = document.getElementById(targetId)

      if (element) {
        const offsetTop =
          element.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET
        window.scrollTo({ top: offsetTop, behavior: "smooth" })
      }
    },
    [],
  )

  useEffect(() => {
    const sectionIds = navigationData
      .map((item) => item.href.replace("#", ""))
      .filter(Boolean)

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }

      // Determine which section is currently in view
      let currentSection = ""
      for (const id of sectionIds) {
        const element = document.getElementById(id)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= NAVBAR_OFFSET + 50 && rect.bottom > NAVBAR_OFFSET) {
            currentSection = id
          }
        }
      }
      setActiveSection(currentSection)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [navigationData])

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
          <Button variant="secondary" className="px-7 py-4 leading-6 font-bold">
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
        <Button variant="secondary" className="px-7 py-4 leading-6 font-bold">
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
          {navigationData.map((item, index) => {
            const isActive =
              activeSection === item.href.replace("#", "") &&
              item.href.startsWith("#")
            return (
              <a
                href={item.href}
                key={index}
                onClick={(e) => handleScrollToSection(e, item.href)}
                className={`transition-colors duration-200 max-md:hidden ${
                  isActive
                    ? "font-semibold text-secondary-500"
                    : "hover:text-primary"
                }`}
              >
                {item.title}
              </a>
            )
          })}
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
                {navigationData.map((item, index) => {
                  const isActive =
                    activeSection === item.href.replace("#", "") &&
                    item.href.startsWith("#")
                  return (
                    <DropdownMenuItem key={index} asChild>
                      <a
                        href={item.href}
                        onClick={(e) => handleScrollToSection(e, item.href)}
                        className={
                          isActive
                            ? "font-semibold text-secondary-500"
                            : undefined
                        }
                      >
                        {item.title}
                      </a>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default Navbar

