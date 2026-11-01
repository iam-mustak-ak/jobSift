import { ArrowDown, BriefcaseBusiness } from "lucide-react";
import { formateCapitalized } from "@/utils/formateCapitalized";
import Link from "next/link";
import ContainerWrapper from "./containerWrapper";
import HeroSearch from "./heroSearch";

const SectionBanner = ({ title }: { title?: string }) => {
    if (!title) {
        return (
            <section className="relative isolate overflow-hidden border-b border-violet-100 bg-[#f5f6ff] pt-28 sm:pt-32">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
                >
                    <div className="absolute -right-24 -top-40 h-[30rem] w-[30rem] rounded-full bg-violet-200/50 blur-3xl" />
                    <div className="absolute -bottom-48 left-[12%] h-[26rem] w-[26rem] rounded-full bg-indigo-100/80 blur-3xl" />
                    <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(#8586aa_0.7px,transparent_0.7px)] [background-size:24px_24px]" />
                </div>
                <ContainerWrapper>
                    <div className="mx-auto max-w-5xl pb-12 pt-5 text-center sm:pb-16">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-violet-800 shadow-sm">
                            <BriefcaseBusiness className="h-4 w-4" /> Find your next role
                        </div>
                        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                            Find work that <span className="text-violet-700">moves you forward.</span>
                        </h1>
                        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                            Search opportunities by role, location, and field. Your next chapter could be one good match away.
                        </p>
                        <div className="mx-auto mt-9 max-w-5xl text-left">
                            <HeroSearch showCategory={true} />
                        </div>
                        <Link
                            href="#job-results"
                            className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-violet-800"
                        >
                            Browse current openings <ArrowDown className="h-4 w-4" />
                        </Link>
                    </div>
                </ContainerWrapper>
            </section>
        );
    }

    return (
        <section className="mt-16 border-b border-slate-200 bg-gradient-to-br from-[#f9f9ff] to-violet-100/70 px-5 pb-12 pt-16">
            <div className="mx-auto max-w-7xl">
                <h1 className="text-center text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    {formateCapitalized(title)}
                </h1>
            </div>
        </section>
    );
};

export default SectionBanner;
