import type { Metadata } from "next"
import { Poppins, Montserrat } from "@/lib/fonts"
import "@/styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import Navbar from "@/components/ui/navbar"
import Footer from "@/components/ui/footer"

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL
      ? `${process.env.APP_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : `http://localhost:${process.env.PORT || 3000}`
  ),
  title: {
    template: `${process.env.APP_NAME} | %s`,
    default: process.env.APP_NAME as string,
  },
  description: process.env.APP_DESCRIPTION || "Description of the app",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "/",
    title: process.env.APP_NAME as string,
    description: process.env.APP_DESCRIPTION || "Description of the app",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: process.env.APP_NAME as string,
    description: process.env.APP_DESCRIPTION || "Description of the app",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "no-scrollbar scroll-smooth antialiased",
        Montserrat.variable,
        "font-poppins",
        Poppins.variable
      )}
    >
      <body className="bg-[url('/frame.png')] bg-cover bg-no-repeat">
        <TooltipProvider>
          <ThemeProvider
            attribute={"class"}
            defaultTheme="light"
            forcedTheme="light"
          >
            {children}
          </ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}
