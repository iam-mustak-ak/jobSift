import { navbarItems } from "@/constants/navbar";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
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

export const Navbar = () => {
    return (
        <div className="flex items-center justify-between px-[5%] py-3 bg-white shadow-md fixed w-full top-0">
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink className={`mr-4`} asChild>
                            <Link href="/">
                                <img
                                    src="/logo-main.svg"
                                    alt="Logo"
                                    className="h-8 w-auto"
                                />
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    {navbarItems.map((item) => (
                        <NavigationMenuItem
                            className="max-lg:hidden"
                            key={item.id}
                        >
                            {!item.dropdownItems && (
                                <NavigationMenuLink asChild>
                                    <Link href={item.href}>{item.name}</Link>
                                </NavigationMenuLink>
                            )}
                            {item.dropdownItems && (
                                <>
                                    <NavigationMenuTrigger>
                                        {item.name}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className=" p-2 md:w-[200px] lg:w-[300px]">
                                            {item.dropdownItems.map(
                                                (dropdownItem) => (
                                                    <li key={dropdownItem.id}>
                                                        <NavigationMenuLink
                                                            asChild
                                                        >
                                                            <Link
                                                                href={
                                                                    dropdownItem.href
                                                                }
                                                            >
                                                                {
                                                                    dropdownItem.name
                                                                }
                                                            </Link>
                                                        </NavigationMenuLink>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </NavigationMenuContent>
                                </>
                            )}
                        </NavigationMenuItem>
                    ))}

                    <NavigationMenuItem className="max-lg:hidden">
                        <Button asChild variant="outline">
                            <Link href="/post-job">Build a Resume</Link>
                        </Button>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            <div className="flex gap-2">
                <Button className="max-lg:hidden" asChild variant="outline">
                    <Link href="/post-job">Post A Job</Link>
                </Button>
                <Button className="max-lg:hidden" asChild>
                    <Link href="/login">Login / Sign Up</Link>
                </Button>
                <div className="lg:hidden">
                    <Drawer direction="left">
                        <DrawerTrigger asChild>
                            <Button
                                variant="outline"
                                className="cursor-pointer "
                            >
                                <MenuIcon />
                            </Button>
                        </DrawerTrigger>

                        <MobileNav />
                    </Drawer>
                </div>
            </div>
        </div>
    );
};
