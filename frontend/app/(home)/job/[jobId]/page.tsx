import ApplyJobButton from "@/components/common/applyJobButton";
import ContainerWrapper from "@/components/common/containerWrapper";
import JobDescription from "@/components/common/jobDescription";
import BookMarkButton from "@/components/ui/bookMarkButton";
import Tag from "@/components/jobs/tag";
import { dateFormate } from "@/utils/dateFormate";
import { fetcherSever } from "@/utils/fetcherSever";
import { salaryFormat } from "@/utils/salaryFormat";
import {
    ArrowLeft,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    CircleDollarSign,
    MapPin,
} from "lucide-react";
import Link from "next/link";

const JobFact = ({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
}) => (
    <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-violet-700 shadow-sm ring-1 ring-slate-200/70">
            <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500">{label}</p>
            <p className="mt-1 break-words text-sm font-semibold text-slate-900">
                {value}
            </p>
        </div>
    </div>
);

const Page = async ({ params }: { params: Promise<{ jobId: string }> }) => {
    const { jobId } = await params;
    const jobResponse = await fetcherSever(`/job/get-job/${jobId}`);
    const job = jobResponse?.data;
    const populatedCompany =
        job?.company &&
        typeof job.company === "object" &&
        (job.company.name || job.company.description || job.company.industry)
            ? job.company
            : null;
    const companyId =
        typeof job?.company === "string" ? job.company : job?.company?._id;
    const companyResponse = !populatedCompany && companyId
        ? await fetcherSever(`/company/get-company/${companyId}`)
        : null;
    const company = populatedCompany ?? companyResponse?.data ?? {};

    const salary = salaryFormat(job?.salaryRange);
    const hasSalary =
        job?.salaryRange?.min != null && job?.salaryRange?.max != null;
    const isExpired =
        !job?.isActive ||
        Boolean(job?.deadline && new Date(job.deadline) <= new Date());

    const facts = [
        job?.experienceLevel
            ? {
                  icon: BriefcaseBusiness,
                  label: "Experience",
                  value: job.experienceLevel,
              }
            : null,
        job?.location
            ? { icon: MapPin, label: "Location", value: job.location }
            : null,
        job?.openings
            ? {
                  icon: CalendarDays,
                  label: "Posted",
                  value: dateFormate(job.openings),
              }
            : null,
        hasSalary
            ? {
                  icon: CircleDollarSign,
                  label: "Salary range",
                  value: `${salary.min} – ${salary.max}`,
              }
            : null,
    ].filter((fact): fact is NonNullable<typeof fact> => fact !== null);

    return (
        <main className="min-h-screen bg-[#f7f8fc] pb-16 text-slate-900">
            <section className="relative isolate overflow-hidden border-b border-violet-100 bg-[#f5f6ff] pt-28 sm:pt-32">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
                >
                    <div className="absolute -right-28 -top-36 h-[28rem] w-[28rem] rounded-full bg-violet-200/50 blur-3xl" />
                    <div className="absolute -bottom-48 left-[8%] h-[24rem] w-[24rem] rounded-full bg-indigo-100/80 blur-3xl" />
                </div>
                <ContainerWrapper>
                    <div className="pb-10 pt-3 sm:pb-14">
                        <Link
                            href="/find-jobs/?page=1"
                            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-violet-800"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back to jobs
                        </Link>

                        <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-violet-950/5">
                            <div className="h-1.5 bg-gradient-to-r from-violet-600 via-indigo-500 to-sky-400" />
                            <div className="p-5 sm:p-8 lg:p-9">
                                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex min-w-0 items-start gap-4">
                                        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-violet-50 text-violet-700 ring-1 ring-violet-100">
                                            <Building2 className="h-6 w-6" />
                                        </div>
                                        <div className="min-w-0 pt-0.5">
                                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                                {company?.name && (
                                                    <span className="text-sm font-semibold text-violet-800">
                                                        {company.name}
                                                    </span>
                                                )}
                                                {isExpired && (
                                                    <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-100">
                                                        No longer accepting applications
                                                    </span>
                                                )}
                                            </div>
                                            <h1 className="text-2xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
                                                {job?.title}
                                            </h1>
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {job?.jobType && <Tag type={job.jobType} />}
                                                {job?.employmentMode && (
                                                    <Tag type={job.employmentMode} />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2 sm:pt-1">
                                        <ApplyJobButton job={job} jobId={jobId} />
                                        <BookMarkButton
                                            jobId={jobId}
                                            className="h-10 w-10 rounded-xl border-slate-200 bg-white p-0 text-slate-600 shadow-sm hover:border-violet-200 hover:bg-violet-50 hover:text-violet-800"
                                        />
                                    </div>
                                </div>

                                {facts.length > 0 && (
                                    <div className="mt-7 grid gap-3 border-t border-slate-100 pt-6 sm:grid-cols-2 xl:grid-cols-4">
                                        {facts.map((fact) => (
                                            <JobFact key={fact.label} {...fact} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </ContainerWrapper>
            </section>

            <ContainerWrapper>
                <JobDescription
                    html={job?.description || ""}
                    company={company}
                />
            </ContainerWrapper>
        </main>
    );
};

export default Page;
