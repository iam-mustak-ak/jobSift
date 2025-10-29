import { footerNavigation as navigation } from "@/constants/footerlinks";
import Image from "next/image";
import Link from "next/link";
import ContainerWrapper from "./containerWrapper";

export default function Footer() {
    return (
        <footer className="bg-white pt-24">
            <ContainerWrapper>
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8">
                        <Image
                            alt="Company name"
                            src="/logo-main.svg"
                            className="h-9"
                            width={200}
                            height={200}
                        />
                        <p className="text-sm/6 text-balance text-gray-600">
                            Making the world a better place through constructing
                            elegant hierarchies.
                        </p>
                        <div className="flex gap-x-6">
                            {navigation.social.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    <span className="sr-only">{item.name}</span>
                                    <item.icon
                                        aria-hidden="true"
                                        className="size-6"
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm/6 font-semibold text-gray-900">
                                    Solutions
                                </h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {navigation.solutions.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className="text-sm/6 text-gray-600 hover:text-gray-900"
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm/6 font-semibold text-gray-900">
                                    Support
                                </h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {navigation.support.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className="text-sm/6 text-gray-600 hover:text-gray-900"
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm/6 font-semibold text-gray-900">
                                    Company
                                </h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {navigation.company.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className="text-sm/6 text-gray-600 hover:text-gray-900"
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm/6 font-semibold text-gray-900">
                                    Legal
                                </h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {navigation.legal.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className="text-sm/6 text-gray-600 hover:text-gray-900"
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24 pb-5">
                    <p className="text-sm/6 text-muted-foreground text-center">
                        &copy; 2025, All rights reserved by jobSift.
                    </p>
                </div>
            </ContainerWrapper>
        </footer>
    );
}
