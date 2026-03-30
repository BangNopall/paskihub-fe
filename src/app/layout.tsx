import type { Metadata } from "next";
import Providers from "@/components/Providers";
import { Poppins, Montserrat } from "@/libs/fonts";
import "@/styles/globals.css";
import { Header } from "@/components/header";
import { Fouter } from "@/components/footer";
import { ThemeModeScript } from "flowbite-react";

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
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className="no-scrollbar scroll-smooth"
        >
            <head>
                <ThemeModeScript />
            </head>
            <body
                className={`${Poppins.variable} ${Montserrat.variable} ${Poppins.className} antialiased`}
            >
                <Providers>
                    <Header />
                    {children}
                    <Fouter />
                </Providers>
            </body>
        </html>
    );
}
