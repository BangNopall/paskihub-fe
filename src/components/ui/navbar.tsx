"use client"
import { MenuIcon } from "lucide-react"
import { Montserrat } from "@/lib/fonts"
import { useEffect, useState } from "react"

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

const Navbar = ({ navigationData }: { navigationData: NavigationItem }) => {
  const [isScrolled, setIsScrolled] = useState(false)

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
          <Link href={`/auth/login`}>
            <Button
              variant="secondary"
              className="px-7 py-4 leading-6 font-bold"
            >
              Masuk
            </Button>
          </Link>
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
