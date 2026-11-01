import Image from "next/image";
import Link from "next/link";

const AuthShell = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="relative isolate min-h-screen overflow-hidden bg-[#f7f8fc] px-4 pb-10 pt-24 sm:px-6 sm:pb-14 sm:pt-28">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
            >
                <div className="absolute -left-40 top-10 h-[28rem] w-[28rem] rounded-full bg-violet-200/50 blur-3xl" />
                <div className="absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-indigo-100/80 blur-3xl" />
            </div>

            <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_28px_80px_rgba(31,28,61,0.12)] lg:min-h-[650px] lg:grid-cols-[0.9fr_1.1fr]">
                <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#17112f] p-10 text-white lg:flex xl:p-14">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full bg-violet-600/30 blur-3xl"
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-48 -left-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"
                    />

                    <Link
                        href="/"
                        aria-label="JobSift home"
                        className="relative inline-flex w-fit rounded-xl bg-white px-3 py-1.5 shadow-sm"
                    >
                        <Image
                            src="/logo-main.svg"
                            alt="JobSift"
                            width={125}
                            height={50}
                            className="h-10 w-auto"
                        />
                    </Link>

                    <div className="relative my-12 max-w-md">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">
                            Your career, in motion
                        </p>
                        <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
                            Make your next move count.
                        </h2>
                        <p className="mt-5 text-base leading-7 text-slate-300">
                            Find opportunities that fit your ambitions and take the next step with confidence.
                        </p>
                    </div>

                    <div className="relative border-t border-white/15 pt-6 text-sm text-slate-400">
                        A clearer path to work that moves you forward.
                    </div>
                </aside>

                <section className="flex items-center justify-center px-5 py-9 sm:px-10 sm:py-12 lg:px-12 xl:px-16">
                    {children}
                </section>
            </div>
        </main>
    );
};

export default AuthShell;
