import { navbarItems } from "@/constants/navbar";

import { X } from "lucide-react";
import Link from "next/link";
import LoginInButton from "../common/loginInButton";
import { Button } from "../ui/button";
import {
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "../ui/drawer";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "../ui/navigation-menu";

const MobileNav = () => {
    return (
        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle>JobSift</DrawerTitle>
            </DrawerHeader>
            <div className=" p-4 w-full ">
                <NavigationMenu orientation="vertical" className="w-full">
                    <NavigationMenuList className="flex-col items-start ">
                        {navbarItems?.map((item) => (
                            <NavigationMenuItem key={item.id}>
                                <NavigationMenuLink asChild>
                                    <Link href={item.href}>{item.name}</Link>
                                </NavigationMenuLink>

                                {item.dropdownItems && (
                                    <ul className=" p-2 pl-4">
                                        {item.dropdownItems?.map(
                                            (dropdownItem) => (
                                                <NavigationMenuLink
                                                    key={dropdownItem.id}
                                                    asChild
                                                >
                                                    <Link
                                                        href={dropdownItem.href}
                                                    >
                                                        {dropdownItem.name}
                                                    </Link>
                                                </NavigationMenuLink>
                                            )
                                        )}
                                    </ul>
                                )}
                            </NavigationMenuItem>
                        ))}

                        <NavigationMenuItem>
                            <Button asChild variant="outline">
                                <Link href="/build-resume">Build a Resume</Link>
                            </Button>
                        </NavigationMenuItem>
                        <NavigationMenuItem className="mt-2">
                            <LoginInButton />
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
                <DrawerFooter>
                    <DrawerClose asChild className="absolute top-4 right-4">
                        <Button variant="outline">
                            <X />
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </div>
        </DrawerContent>
    );
};

export default MobileNav;
