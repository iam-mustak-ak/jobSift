import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import ContainerWrapper from "./containerWrapper";
import HeroSearch from "./heroSearch";

const Hero = () => {
    return (
        <section className="relative isolate overflow-hidden bg-[#f6f7ff] pt-28 md:pt-32">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -right-32 -top-36 h-[34rem] w-[34rem] rounded-full bg-violet-200/45 blur-3xl" />
                <div className="absolute -bottom-56 left-[28%] h-[30rem] w-[30rem] rounded-full bg-indigo-100/70 blur-3xl" />
                <div className="absolute inset-0 opacity-[0.22] [background-image:radial-gradient(#8586aa_0.7px,transparent_0.7px)] [background-size:24px_24px]" />
            </div>
            <ContainerWrapper>
                <div className="grid items-center gap-8 pb-16 pt-8 md:grid-cols-[1.08fr_0.92fr] md:gap-5 md:pb-24 md:pt-10">
                    <div className="relative z-10 max-w-2xl">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/75 px-3.5 py-2 text-sm font-medium text-violet-800 shadow-sm backdrop-blur">
                            <Sparkles className="h-4 w-4" /> A smarter way to find your next role
                        </div>
                        <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight text-slate-950 sm:text-6xl lg:text-[4.25rem]">
                            Your next chapter <span className="text-primary">starts here.</span>
                        </h1>
                        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                            Find work that fits your ambitions. Explore fresh opportunities from companies ready to meet their next great hire.
                        </p>

                        <div className="mt-8">
                            <HeroSearch showCategory={true} />
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
                            <span className="font-semibold text-slate-700">Trending:</span>
                            {["Product Designer", "Frontend Developer", "Marketing"].map((query) => (
                                <Link key={query} href={`/find-jobs/?page=1&title=${encodeURIComponent(query)}`} className="transition-colors hover:text-primary">
                                    {query}
                                </Link>
                            ))}
                        </div>

                        <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-slate-200/80 pt-6 text-sm text-slate-600">
                            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 rounded-full bg-violet-100 p-0.5 text-violet-700" /> Curated opportunities</span>
                            <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 rounded-full bg-violet-100 p-0.5 text-violet-700" /> Tools to move forward</span>
                            <Link href="/analyze-resume" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">Explore JobSift <ArrowRight className="h-4 w-4" /></Link>
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-[610px] md:translate-x-5">
                        <div className="absolute inset-10 rounded-full bg-violet-300/30 blur-3xl" />
                        <Image
                            src="/job-svg.svg"
                            width={1000}
                            height={700}
                            alt="People finding opportunities and growing their careers"
                            priority
                            className="relative h-auto w-full drop-shadow-[0_25px_45px_rgba(61,47,130,0.12)]"
                        />
                        <div className="absolute bottom-[8%] left-0 hidden items-center gap-3 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-xl shadow-violet-950/10 backdrop-blur sm:flex">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl">✦</div>
                            <div><p className="text-sm font-semibold text-slate-900">Find your next opportunity</p><p className="mt-0.5 text-xs text-slate-500">A better fit is out there</p></div>
                        </div>
                        <div className="absolute right-1 top-[17%] hidden rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-xl shadow-violet-950/10 backdrop-blur sm:block">
                            <p className="text-xs font-medium text-slate-500">Your career, in motion</p>
                            <p className="mt-1 text-sm font-semibold text-violet-800">Make your next move</p>
                        </div>
                    </div>
                </div>
            </ContainerWrapper>
        </section>
    );
};

export default Hero;
