import { ArrowRight } from "lucide-react";
import { footerNavigation as navigation } from "@/constants/footerlinks";
import Image from "next/image";
import Link from "next/link";
import ContainerWrapper from "./containerWrapper";

const linkGroups = [
    { title: "Solutions", links: navigation.solutions },
    { title: "Support", links: navigation.support },
    { title: "Company", links: navigation.company },
    { title: "Legal", links: navigation.legal },
];

export default function Footer() {
    return (
        <footer className="relative isolate overflow-hidden border-t border-slate-800 bg-[#101525] text-slate-300">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-40 -top-48 z-0 h-[32rem] w-[32rem] rounded-full bg-violet-600/20 blur-3xl"
            />
            <ContainerWrapper>
                <div className="relative z-10 py-12 sm:py-16">
                    <section className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-violet-700 via-violet-700 to-indigo-700 px-6 py-8 shadow-2xl shadow-violet-950/25 sm:px-9 sm:py-9 lg:flex lg:items-center lg:justify-between lg:gap-8">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -right-8 -top-24 h-64 w-64 rounded-full border border-white/10"
                        />
                        <div className="relative max-w-2xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-100">
                                Your next move starts here
                            </p>
                            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                                Find work that moves you forward.
                            </h2>
                            <p className="mt-2 max-w-xl text-sm leading-6 text-violet-100 sm:text-base">
                                Explore opportunities, discover new paths, and take the next step in your career.
                            </p>
                        </div>
                        <Link
                            href="/find-jobs/?page=1"
                            className="relative mt-6 inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-violet-800 shadow-sm transition hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-violet-700 lg:mt-0"
                        >
                            Explore jobs <ArrowRight className="h-4 w-4" />
                        </Link>
                    </section>

                    <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.15fr_2fr] lg:gap-16 lg:py-16">
                        <div>
                            <Link
                                href="/"
                                aria-label="JobSift home"
                                className="inline-flex rounded-xl bg-white px-3 py-1.5 shadow-sm ring-1 ring-white/20"
                            >
                                <Image
                                    alt="JobSift"
                                    src="/logo-main.svg"
                                    className="h-10 w-auto"
                                    width={125}
                                    height={50}
                                />
                            </Link>
                            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
                                Find meaningful work, explore new possibilities, and make your next career move with confidence.
                            </p>
                            <div className="mt-6 flex items-center gap-2.5">
                                {navigation.social.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        aria-label={item.name}
                                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-violet-400/50 hover:bg-violet-400/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                                    >
                                        <item.icon
                                            aria-hidden="true"
                                            className="h-[18px] w-[18px]"
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <nav
                            aria-label="Footer navigation"
                            className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4"
                        >
                            {linkGroups.map((group) => (
                                <div key={group.title}>
                                    <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
                                        {group.title}
                                    </h3>
                                    <ul className="mt-5 space-y-3.5">
                                        {group.links.map((item) => (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    className="text-sm text-slate-400 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"
                                                >
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </nav>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                        <p>
                            &copy; {new Date().getFullYear()} JobSift. All rights reserved.
                        </p>
                        <p>Built to help your next career move feel closer.</p>
                    </div>
                </div>
            </ContainerWrapper>
        </footer>
    );
}
