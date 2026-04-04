import { Icon } from "@iconify/react"

import { Montserrat } from "@/lib/fonts"
import Link from "next/link"

const Footer = () => {
  return (
    <footer className="flex w-full flex-col">
      {/* Main Content Section */}
      <div className="flex w-full flex-col items-center justify-center bg-primary-300 px-6 py-10 md:py-14 lg:px-12 xl:px-52">
        <div className="flex w-full max-w-7xl flex-col items-center justify-between gap-10 md:flex-row md:items-start lg:gap-24">
          {/* Column 1: Info & Operational Hours */}
          <div className="flex flex-col items-center gap-4 md:w-64 md:items-start">
            <div
              className={`text-center md:text-left ${Montserrat.className} text-3xl leading-9 font-bold text-dark-blue`}
            >
              PaskiHub
            </div>
            <div className="flex flex-col items-center gap-1 md:items-start">
              <div className="text-base leading-6 font-semibold text-dark-blue">
                Jam Operasional
              </div>
              <div className="text-xs leading-4 font-normal text-dark-blue">
                08.00 WIB - 17.00 WIB
              </div>
            </div>
          </div>

          {/* Desktop Divider */}
          <div className="hidden h-36 border-l-2 border-dark-blue md:block" />

          {/* Column 2: Contact & Address */}
          <div className="flex flex-col items-center gap-7 md:w-64 md:items-start">
            <div className="flex flex-col items-center gap-1 md:items-start">
              <div className="text-base leading-6 font-semibold text-dark-blue">
                Hubungi Kami
              </div>
              <Link
                href="#"
                className="text-xs leading-4 font-normal text-dark-blue transition-colors hover:text-dark-blue/80"
              >
                +62812312312
              </Link>
            </div>
            <div className="flex flex-col items-center gap-1 md:items-start">
              <div className="text-base leading-6 font-semibold text-dark-blue">
                Alamat
              </div>
              <Link
                href="#"
                className="text-center text-xs leading-4 font-normal text-dark-blue transition-colors hover:text-dark-blue/80 md:text-left"
              >
                Lorem ipsum dolor
              </Link>
            </div>
          </div>

          {/* Desktop Divider */}
          <div className="hidden h-36 border-l-2 border-dark-blue md:block" />

          {/* Column 3: Social Links */}
          <div className="flex flex-col my-auto items-center justify-center gap-4">
            <Link
              href="#"
              className="group flex items-center justify-center gap-2 text-xs leading-4 font-semibold text-dark-blue transition-colors hover:text-dark-blue/80 md:justify-start"
            >
              <div className="flex items-center justify-center rounded-full bg-white p-1 transition-transform group-hover:scale-105">
                <Icon icon="mdi:instagram" width="24" height="24" />
              </div>
              loremipsum
            </Link>

            <Link
              href="#"
              className="group flex items-center justify-center gap-2 text-xs leading-4 font-semibold text-dark-blue transition-colors hover:text-dark-blue/80 md:justify-start"
            >
              <div className="flex items-center justify-center rounded-full bg-white p-1 transition-transform group-hover:scale-105">
                <Icon icon="ic:baseline-tiktok" width="24" height="24" />
              </div>
              loremipsum
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="flex w-full items-center justify-center border-t border-white bg-primary-100 px-6 py-5 md:px-12 lg:px-24 xl:px-52">
        <div className="flex items-center justify-center gap-1 text-sm leading-5 font-normal text-neutral-700">
          <Icon
            icon="ic:baseline-copyright"
            width="24"
            height="24"
            className="shrink-0"
          />
          <span className="text-center">
            2026 PaskiHub. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
