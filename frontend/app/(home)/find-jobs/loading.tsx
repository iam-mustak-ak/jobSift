import ContainerWrapper from "@/components/common/containerWrapper";
import { Skeleton } from "@/components/ui/skeleton";

const JobCardSkeleton = () => (
    <div
        aria-hidden="true"
        className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6"
    >
        <div className="flex items-start gap-4">
            <Skeleton className="h-12 w-12 shrink-0 rounded-xl bg-slate-200" />
            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-4/5 bg-slate-200" />
                        <Skeleton className="h-4 w-2/5 bg-slate-200" />
                    </div>
                    <Skeleton className="h-9 w-9 shrink-0 rounded-lg bg-slate-200" />
                </div>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                    <Skeleton className="h-4 w-24 bg-slate-200" />
                    <Skeleton className="h-4 w-32 bg-slate-200" />
                    <Skeleton className="h-4 w-20 bg-slate-200" />
                </div>
                <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                    <Skeleton className="h-6 w-20 rounded-full bg-slate-200" />
                    <Skeleton className="h-6 w-16 rounded-full bg-slate-200" />
                </div>
            </div>
        </div>
    </div>
);

const Loading = () => {
    return (
        <main
            aria-busy="true"
            aria-label="Loading job search results"
            className="min-h-screen bg-[#f7f8fc] text-slate-900"
        >
            <section className="border-b border-violet-100 bg-[#f5f6ff] pt-28 sm:pt-32">
                <ContainerWrapper>
                    <div className="mx-auto max-w-5xl pb-12 pt-5 text-center sm:pb-16">
                        <Skeleton className="mx-auto mb-5 h-9 w-48 rounded-full bg-violet-100" />
                        <Skeleton className="mx-auto h-10 w-4/5 max-w-3xl bg-slate-200 sm:h-14" />
                        <Skeleton className="mx-auto mt-3 h-10 w-3/5 max-w-2xl bg-slate-200 sm:h-6" />

                        <div className="mx-auto mt-9 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-violet-950/5 sm:p-5">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center">
                                <Skeleton className="h-11 flex-1 rounded-lg bg-slate-200" />
                                <Skeleton className="h-11 flex-1 rounded-lg bg-slate-200" />
                                <Skeleton className="h-11 flex-1 rounded-lg bg-slate-200" />
                                <Skeleton className="h-11 w-full rounded-lg bg-violet-200 md:w-28" />
                            </div>
                            <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
                                <Skeleton className="h-9 w-full rounded-lg bg-slate-100 sm:w-40" />
                                <Skeleton className="h-9 w-full rounded-lg bg-slate-100 sm:w-44" />
                            </div>
                        </div>
                        <Skeleton className="mx-auto mt-7 h-4 w-44 bg-slate-200" />
                    </div>
                </ContainerWrapper>
            </section>

            <section className="py-12 sm:py-16">
                <ContainerWrapper>
                    <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div className="space-y-3">
                            <Skeleton className="h-3 w-24 bg-violet-100" />
                            <Skeleton className="h-8 w-64 bg-slate-200 sm:h-9" />
                            <Skeleton className="h-4 w-80 max-w-full bg-slate-200" />
                        </div>
                        <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                            <Skeleton className="h-10 w-10 rounded-xl bg-violet-100" />
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-12 bg-slate-200" />
                                <Skeleton className="h-3 w-16 bg-slate-200" />
                            </div>
                        </div>
                    </div>

                    <div className="mb-6 flex flex-col gap-3 border-y border-slate-200/80 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <Skeleton className="h-4 w-52 bg-slate-200" />
                        <div className="flex gap-2">
                            <Skeleton className="h-7 w-24 rounded-full bg-violet-100" />
                            <Skeleton className="h-7 w-28 rounded-full bg-violet-100" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        {Array.from({ length: 8 }, (_, index) => (
                            <JobCardSkeleton key={index} />
                        ))}
                    </div>

                    <div className="mt-12 flex justify-center gap-2" aria-hidden="true">
                        <Skeleton className="h-9 w-20 rounded-lg bg-slate-200" />
                        <Skeleton className="h-9 w-9 rounded-lg bg-violet-100" />
                        <Skeleton className="h-9 w-9 rounded-lg bg-slate-200" />
                        <Skeleton className="h-9 w-20 rounded-lg bg-slate-200" />
                    </div>
                </ContainerWrapper>
            </section>
            <p className="sr-only" role="status">Loading jobs, please wait.</p>
        </main>
    );
};

export default Loading;
