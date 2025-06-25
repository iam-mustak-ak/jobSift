"use client";

import Loader from "@/components/common/loader";
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
            <AuthProvider>{children}</AuthProvider>
            <Loader />
        </NextThemesProvider>
    );
}
