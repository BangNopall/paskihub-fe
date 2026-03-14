import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

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
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
