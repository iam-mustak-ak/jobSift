/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { BriefcaseBusiness, MapPin, Search } from "lucide-react";
import ContainerWrapper from "@/components/common/containerWrapper";
import CustomPagination from "@/components/common/customPagination";
import SectionBanner from "@/components/common/sectionBanner";
import FeaturedJobCard from "@/components/jobs/featuredJobCard";
import { formateCapitalized } from "@/utils/formateCapitalized";
import { fetcherSever } from "@/utils/fetcherSever";

type SearchParams = {
    page?: string;
    title?: string;
    location?: string;
    jobCategory?: string;
    jobType?: string;
    experienceLevel?: string;
};

const Page = async ({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) => {
    const params = await searchParams;
    const {
        page: currentPage = "1",
        title,
        location,
        jobCategory,
        jobType,
        experienceLevel,
    } = params;

    const page = Math.max(1, parseInt(currentPage, 10) || 1);
    const queryParams = new URLSearchParams({
        limit: "8",
        page: page.toString(),
        ...(title ? { title } : {}),
        ...(location ? { location } : {}),
        ...(jobCategory ? { jobCategory } : {}),
        ...(jobType ? { jobType } : {}),
        ...(experienceLevel ? { experienceLevel } : {}),
    }).toString();

    const jobs = await fetcherSever(`/job/get-all-jobs/?${queryParams}`);
    const jobList = Array.isArray(jobs?.data) ? jobs.data : [];
    const totalItems = jobs?.pagination?.total ?? 0;
    const totalPages = jobs?.pagination?.totalPages ?? 0;
    const itemsPerPage = jobs?.pagination?.limit ?? 8;
    const startItem = totalItems === 0 ? 0 : (page - 1) * itemsPerPage + 1;
    const endItem = Math.min(page * itemsPerPage, totalItems);

    const activeFilters = [
        title ? { label: title, icon: Search } : null,
        location ? { label: location, icon: MapPin } : null,
        jobCategory ? { label: "Selected category", icon: BriefcaseBusiness } : null,
        jobType ? { label: formateCapitalized(jobType), icon: null } : null,
        experienceLevel
            ? { label: `${formateCapitalized(experienceLevel)} level`, icon: null }
            : null,
    ].filter((filter): filter is NonNullable<typeof filter> => filter !== null);

    return (
        <main className="min-h-screen bg-[#f7f8fc] text-slate-900">
            <SectionBanner />

            <section id="job-results" className="scroll-mt-24 py-12 sm:py-16">
                <ContainerWrapper>
                    <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-700">
                                Job board
                            </p>
                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                                Explore opportunities
                            </h2>
                            <p className="mt-2 text-sm text-slate-500 sm:text-base">
                                Find a role that fits your skills and where you want to go.
                            </p>
                        </div>

                        <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                            <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-700">
                                <BriefcaseBusiness className="h-5 w-5" />
                            </span>
                            <div>
                                <p className="text-lg font-semibold leading-5 text-slate-900">
                                    {new Intl.NumberFormat("en-US").format(totalItems)}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">jobs found</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6 flex flex-col gap-3 border-y border-slate-200/80 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-slate-600">
                            Showing <span className="font-semibold text-slate-900">{startItem}–{endItem}</span> of{" "}
                            <span className="font-semibold text-slate-900">{totalItems}</span> jobs
                        </p>
                        {activeFilters.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="mr-1 text-xs font-medium text-slate-500">Filters</span>
                                {activeFilters.map(({ label, icon: Icon }, index) => (
                                    <span
                                        key={`${label}-${index}`}
                                        className="inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-800"
                                    >
                                        {Icon && <Icon className="h-3.5 w-3.5" />}
                                        {label}
                                    </span>
                                ))}
                                <Link
                                    href="/find-jobs/?page=1"
                                    className="ml-1 text-xs font-semibold text-slate-600 underline-offset-4 hover:text-violet-800 hover:underline"
                                >
                                    Clear all
                                </Link>
                            </div>
                        )}
                    </div>

                    {jobList.length > 0 ? (
                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                            {jobList.map((job: Record<string, any>) => (
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
                                <Search className="h-6 w-6" />
                            </span>
                            <h3 className="mt-5 text-xl font-semibold text-slate-900">
                                No matching jobs yet
                            </h3>
                            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                                Try a broader title or location, or clear your filters to explore all available opportunities.
                            </p>
                            <Link
                                href="/find-jobs/?page=1"
                                className="mt-6 inline-flex items-center justify-center rounded-xl bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-800"
                            >
                                Clear filters
                            </Link>
                        </div>
                    )}

                    {jobList.length > 0 && totalPages > 1 && (
                        <div className="mt-10 rounded-2xl border border-slate-200 bg-white px-4 py-1 shadow-sm">
                            <CustomPagination
                                currentPage={page}
                                totalPages={totalPages}
                                uri="/find-jobs"
                            />
                        </div>
                    )}
                </ContainerWrapper>
            </section>
        </main>
    );
};

export default Page;
