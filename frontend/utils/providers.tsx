"use client";

import Loader from "@/components/common/loader";
import { SocketProvider } from "@/context/socketContext";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";
import AuthProvider from "./authProvider";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
        >
            <AuthProvider>
                <SocketProvider>{children}</SocketProvider>
            </AuthProvider>
            <Loader />
        </NextThemesProvider>
    );
}
