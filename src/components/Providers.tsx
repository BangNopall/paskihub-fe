"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "flowbite-react";
import { customTheme } from "@/styles/flowbite-theme";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider theme={customTheme}>
                {children}
            </ThemeProvider>
        </SessionProvider>
    );
}
