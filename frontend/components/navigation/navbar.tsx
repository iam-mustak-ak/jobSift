import { navbarItems } from "@/constants/navbar";
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import LoginInButton from "../common/loginInButton";
import PostJobButton from "../common/postJobButton";
import { Button } from "../ui/button";
import { Drawer, DrawerTrigger } from "../ui/drawer";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "../ui/navigation-menu";
import MobileNav from "./mobileNav";

const navLinkClass =
    "rounded-lg bg-transparent px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:!bg-violet-50 hover:!text-violet-800 focus:!bg-violet-50 focus:!text-violet-800 data-[state=open]:!bg-violet-100 data-[state=open]:!text-violet-900";

export const Navbar = () => {
    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/95 shadow-[0_4px_20px_rgba(31,28,61,0.05)] backdrop-blur-xl">
            <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
                <Link
                    href="/"
                    aria-label="JobSift home"
                    className="flex w-[125px] shrink-0 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
                >
                    <Image
                        src="/logo-main.svg"
                        alt="JobSift"
                        className="h-[50px] w-[125px] max-w-none"
                        height={50}
                        width={125}
                        priority
                    />
                </Link>

                <NavigationMenu
                    viewport={false}
                    className="hidden lg:!flex-none lg:flex"
                >
                    <NavigationMenuList className="!flex-none gap-0.5">
                        {navbarItems.map((item) => (
                            <NavigationMenuItem key={item.id}>
                                {!item.dropdownItems ? (
                                    <NavigationMenuLink className={navLinkClass} asChild>
                                        <Link href={item.href}>{item.name}</Link>
                                    </NavigationMenuLink>
                                ) : (
                                    <>
                                        <NavigationMenuTrigger className={navLinkClass}>
                                            {item.name}
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent className="w-[260px] min-w-[260px] rounded-2xl border-slate-200 bg-white p-2 text-slate-800 shadow-xl shadow-slate-900/10 group-data-[viewport=false]/navigation-menu:!bg-white group-data-[viewport=false]/navigation-menu:!text-slate-800 md:!w-[260px]">
                                            <ul className="space-y-1">
                                                {item.dropdownItems.map((dropdownItem) => (
                                                    <li key={dropdownItem.id}>
                                                        <NavigationMenuLink asChild>
                                                            <Link
                                                                href={dropdownItem.href}
                                                                className="block whitespace-nowrap rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-violet-50 hover:text-violet-800 focus:bg-violet-50 focus:text-violet-800 data-[active=true]:bg-violet-50 data-[active=true]:text-violet-800"
                                                            >
                                                                {dropdownItem.name}
                                                            </Link>
                                                        </NavigationMenuLink>
                                                    </li>
                                                ))}
                                            </ul>
                                        </NavigationMenuContent>
                                    </>
                                )}
                            </NavigationMenuItem>
                        ))}
                        <NavigationMenuItem>
                            <NavigationMenuLink className={navLinkClass} asChild>
                                <Link href="/build-resume">Build a Resume</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <PostJobButton />
                    <LoginInButton />
                    <div className="lg:hidden">
                        <Drawer direction="left">
                            <DrawerTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    aria-label="Open navigation menu"
                                    className="h-10 w-10 rounded-xl border-slate-200 bg-white text-slate-700 shadow-none hover:border-violet-200 hover:bg-violet-50 hover:text-violet-800"
                                >
                                    <MenuIcon className="h-5 w-5" />
                                </Button>
                            </DrawerTrigger>
                            <MobileNav />
                        </Drawer>
                    </div>
                </div>
            </div>
        </header>
    );
};
