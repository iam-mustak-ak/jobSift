import ContainerWrapper from "@/components/common/containerWrapper";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => (
    <main
        aria-busy="true"
        aria-label="Loading job details"
        className="min-h-screen bg-[#f7f8fc] pb-16"
    >
        <section className="border-b border-violet-100 bg-[#f5f6ff] pt-28 sm:pt-32">
            <ContainerWrapper>
                <div className="pb-10 pt-3 sm:pb-14">
                    <Skeleton className="h-4 w-28 bg-slate-200" />
                    <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                        <Skeleton className="mb-7 h-1.5 w-full rounded-full bg-violet-100" />
                        <div className="flex items-start gap-4">
                            <Skeleton className="h-14 w-14 shrink-0 rounded-2xl bg-violet-100" />
                            <div className="flex-1 space-y-3">
                                <Skeleton className="h-4 w-40 bg-slate-200" />
                                <Skeleton className="h-8 w-4/5 max-w-2xl bg-slate-200 sm:h-10" />
                                <div className="flex gap-2 pt-1">
                                    <Skeleton className="h-6 w-20 rounded-full bg-blue-100" />
                                    <Skeleton className="h-6 w-20 rounded-full bg-violet-100" />
                                </div>
                            </div>
                        </div>
                        <div className="mt-7 grid gap-3 border-t border-slate-100 pt-6 sm:grid-cols-2 xl:grid-cols-4">
                            {Array.from({ length: 4 }, (_, index) => (
                                <div
                                    key={index}
                                    className="flex gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4"
                                >
                                    <Skeleton className="h-9 w-9 shrink-0 rounded-xl bg-slate-200" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-3 w-16 bg-slate-200" />
                                        <Skeleton className="h-4 w-24 bg-slate-200" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </ContainerWrapper>
        </section>

        <ContainerWrapper>
            <div className="grid grid-cols-1 items-start gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                    <Skeleton className="h-3 w-24 bg-violet-100" />
                    <Skeleton className="mt-3 h-7 w-52 bg-slate-200" />
                    <div className="mt-6 space-y-3">
                        <Skeleton className="h-4 w-full bg-slate-200" />
                        <Skeleton className="h-4 w-full bg-slate-200" />
                        <Skeleton className="h-4 w-11/12 bg-slate-200" />
                        <Skeleton className="mt-5 h-4 w-full bg-slate-200" />
                        <Skeleton className="h-4 w-10/12 bg-slate-200" />
                        <Skeleton className="h-4 w-9/12 bg-slate-200" />
                    </div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-11 w-11 rounded-xl bg-violet-100" />
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-28 bg-slate-200" />
                            <Skeleton className="h-5 w-36 bg-slate-200" />
                        </div>
                    </div>
                    <div className="mt-6 space-y-3">
                        <Skeleton className="h-4 w-full bg-slate-200" />
                        <Skeleton className="h-4 w-10/12 bg-slate-200" />
                        <Skeleton className="mt-5 h-4 w-20 bg-slate-200" />
                        <Skeleton className="h-4 w-28 bg-slate-200" />
                    </div>
                </div>
            </div>
        </ContainerWrapper>
        <p className="sr-only" role="status">Loading job details, please wait.</p>
    </main>
);

export default Loading;
