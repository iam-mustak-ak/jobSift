import "@/app/globals.css";
import UserDropDown from "@/components/common/userDropDown";
import AppSidebar from "@/components/sidebar/appSideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Providers } from "@/utils/providers";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased `}
            >
                <Providers>
                    <SidebarProvider>
                        <AppSidebar />
                        <main className="w-full p-5">
                            <div className="w-full flex items-center justify-between sticky top-0 bg-white  border-b border-border mb-5">
                                <SidebarTrigger />
                                <div>
                                    <UserDropDown />
                                </div>
                            </div>
                            {children}
                        </main>
                        <Toaster />
                    </SidebarProvider>
                </Providers>
            </body>
        </html>
    );
}
