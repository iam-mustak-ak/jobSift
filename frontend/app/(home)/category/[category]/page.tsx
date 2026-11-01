/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    BriefcaseBusiness,
    Compass,
} from "lucide-react";
import ContainerWrapper from "@/components/common/containerWrapper";
import CustomPagination from "@/components/common/customPagination";
import FeaturedJobCard from "@/components/jobs/featuredJobCard";
import { fetcherSever } from "@/utils/fetcherSever";

const formatCategoryName = (value: string) =>
    value
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
        .replace(/\bAi\b/g, "AI");

const Page = async ({
    params,
    searchParams,
}: {
    params: Promise<{ category: string }>;
    searchParams: Promise<{ id?: string; page?: string }>;
}) => {
    const [{ category }, search] = await Promise.all([params, searchParams]);
    const id = search.id;
    const page = Math.max(1, parseInt(search.page ?? "1", 10) || 1);

    const queryParams = new URLSearchParams({
        ...(id ? { jobCategory: id } : {}),
        page: page.toString(),
        limit: "8",
    }).toString();

    const [jobsData, categoryData] = await Promise.all([
        id
            ? fetcherSever(`/job/get-all-jobs/?${queryParams}`)
            : Promise.resolve({
                  data: [],
                  pagination: { total: 0, totalPages: 0, limit: 8 },
              }),
        id ? fetcherSever(`/job-category/get-category/${id}`) : null,
    ]);

    const jobs = Array.isArray(jobsData?.data) ? jobsData.data : [];
    const totalItems = jobsData?.pagination?.total ?? 0;
    const totalPages = jobsData?.pagination?.totalPages ?? 0;
    const itemsPerPage = jobsData?.pagination?.limit ?? 8;
    const startItem = totalItems === 0 ? 0 : (page - 1) * itemsPerPage + 1;
    const endItem = Math.min(page * itemsPerPage, totalItems);
    const categoryName =
        categoryData?.data?.name || formatCategoryName(category);
    const categoryDescription =
        categoryData?.data?.description ||
        `Explore open roles and new opportunities across ${categoryName}.`;

    return (
        <main className="min-h-screen bg-[#f7f8fc] pb-12 text-slate-900">
            <section className="relative isolate overflow-hidden border-b border-violet-100 bg-[#f4f5ff] pt-28 sm:pt-32">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
                >
                    <div className="absolute -right-32 -top-40 h-[32rem] w-[32rem] rounded-full bg-violet-200/55 blur-3xl" />
                    <div className="absolute -bottom-48 left-[10%] h-[26rem] w-[26rem] rounded-full bg-indigo-100/80 blur-3xl" />
                    <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(#8586aa_0.7px,transparent_0.7px)] [background-size:24px_24px]" />
                </div>
                <ContainerWrapper>
                    <div className="pb-10 pt-3 sm:pb-14">
                        <Link
                            href="/find-jobs/?page=1"
                            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-violet-800"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back to all jobs
                        </Link>

                        <div className="mt-7 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-3xl">
                                <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-violet-800 shadow-sm">
                                    <Compass className="h-4 w-4" /> Browse by category
                                </div>
                                <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                                    {categoryName} <span className="text-violet-700">jobs</span>
                                </h1>
                                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                                    {categoryDescription}
                                </p>
                            </div>

                            <div className="flex w-fit items-center gap-3 rounded-2xl border border-white bg-white/90 px-4 py-3 shadow-lg shadow-violet-950/5 ring-1 ring-slate-200/70">
                                <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-50 text-violet-700">
                                    <BriefcaseBusiness className="h-5 w-5" />
                                </span>
                                <div>
                                    <p className="text-xl font-semibold leading-5 text-slate-950">
                                        {new Intl.NumberFormat("en-US").format(totalItems)}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        open opportunities
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ContainerWrapper>
            </section>

            <section className="py-10 sm:py-14">
                <ContainerWrapper>
                    <div className="mb-6 flex flex-col gap-3 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-violet-700">
                                Curated for you
                            </p>
                            <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
                                Latest {categoryName} opportunities
                            </h2>
                        </div>
                        <p className="text-sm text-slate-600">
                            Showing <span className="font-semibold text-slate-900">{startItem}–{endItem}</span> of{" "}
                            <span className="font-semibold text-slate-900">{totalItems}</span> jobs
                        </p>
                    </div>

                    {jobs.length > 0 ? (
                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                            {jobs.map((job: Record<string, any>) => (
                                <FeaturedJobCard
                                    featuredJobs={job}
                                    key={job._id}
                                    cardClassName="border-slate-200 bg-white text-slate-900 shadow-sm hover:border-violet-200 hover:shadow-lg hover:shadow-slate-900/5"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm sm:py-16">
                            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-violet-50 text-violet-700">
                                <BriefcaseBusiness className="h-6 w-6" />
                            </span>
                            <h3 className="mt-5 text-xl font-semibold text-slate-950">
                                No {categoryName} jobs available right now
                            </h3>
                            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                                New opportunities are added regularly. Explore all current openings or check back soon.
                            </p>
                            <Link
                                href="/find-jobs/?page=1"
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-800"
                            >
                                Browse all jobs <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    )}

                    {jobs.length > 0 && totalPages > 1 && (
                        <div className="mt-10">
                            <CustomPagination
                                currentPage={page}
                                totalPages={totalPages}
                                uri={`/category/${category}`}
                            />
                        </div>
                    )}
                </ContainerWrapper>
            </section>
        </main>
    );
};

export default Page;
