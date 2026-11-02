import Link from "next/link";
import ContainerWrapper from "@/components/common/containerWrapper";
import ApplyJobForm from "@/components/jobs/applyJobForm";
import { fetcherSever } from "@/utils/fetcherSever";
import { ArrowLeft, ArrowUpRight, BriefcaseBusiness, Building2, CalendarDays, CheckCircle2, CircleDollarSign, MapPin, ShieldCheck } from "lucide-react";

const Page = async ({ params }: { params: Promise<{ jobId: string }> }) => {
    const { jobId } = await params;
    const jobResponse = await fetcherSever(`/job/get-job/${jobId}`);
    const job = jobResponse?.data;
    const populatedCompany = job?.company && typeof job.company === "object" ? job.company : null;
    const companyId = typeof job?.company === "string" ? job.company : job?.company?._id;
    const companyResponse = !populatedCompany && companyId
        ? await fetcherSever(`/company/get-company/${companyId}`)
        : null;
    const company = populatedCompany ?? companyResponse?.data;

    if (!job) {
        return (
            <main className="min-h-[75vh] bg-slate-50 pb-16 pt-28">
                <ContainerWrapper>
                    <section className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
                        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-violet-50 text-violet-700"><BriefcaseBusiness className="h-6 w-6" /></span>
                        <h1 className="mt-5 text-2xl font-bold text-slate-950">This job is unavailable</h1>
                        <p className="mt-2 text-sm leading-6 text-slate-500">The listing may have been removed or the link may be out of date.</p>
                        <Link href="/find-jobs/?page=1" className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-violet-700 px-5 text-sm font-semibold text-white hover:bg-violet-800"><ArrowLeft className="h-4 w-4" />Browse open jobs</Link>
                    </section>
                </ContainerWrapper>
            </main>
        );
    }

    const facts = [
        job.location ? { icon: MapPin, label: "Location", value: job.location } : null,
        job.jobType ? { icon: BriefcaseBusiness, label: "Employment", value: job.jobType } : null,
        job.experienceLevel ? { icon: CheckCircle2, label: "Experience", value: job.experienceLevel } : null,
        job.salaryRange?.min != null || job.salaryRange?.max != null
            ? { icon: CircleDollarSign, label: "Salary", value: [job.salaryRange?.min, job.salaryRange?.max].filter((value: unknown) => value != null).join(" – ") }
            : null,
    ].filter((fact): fact is NonNullable<typeof fact> => fact !== null);

    return (
        <main className="min-h-screen bg-[#f7f8fc] pb-16 pt-24 text-slate-900 sm:pt-28">
            <ContainerWrapper>
                <Link href={`/job/${jobId}`} className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-violet-800"><ArrowLeft className="h-4 w-4" />Back to job details</Link>

                <header className="relative mt-5 overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-6 sm:p-8">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 h-64 w-64 rounded-full bg-violet-200/40 blur-3xl" />
                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-4">
                            <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white bg-white text-violet-700 shadow-sm">
                                {company?.logo ? <img src={company.logo} alt={`${company.name || "Company"} logo`} className="h-full w-full object-cover" /> : <Building2 className="h-6 w-6" />}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-700">Application workspace</p>
                                <h1 className="mt-1 truncate text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Apply for this role</h1>
                                <p className="mt-1 truncate text-sm text-slate-600">{job.title}{company?.name ? ` · ${company.name}` : ""}</p>
                            </div>
                        </div>
                        <Link href={`/job/${jobId}`} className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:text-violet-700">View job details <ArrowUpRight className="h-4 w-4" /></Link>
                    </div>
                </header>

                <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/[0.03] sm:p-8">
                        <ApplyJobForm jobId={jobId} jobTitle={job.title} />
                    </section>

                    <aside className="space-y-5 lg:sticky lg:top-24">
                        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.03]">
                            <div className="h-1.5 bg-gradient-to-r from-violet-600 via-indigo-500 to-sky-400" />
                            <div className="p-5 sm:p-6">
                                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-violet-700">Role summary</p>
                                <h2 className="mt-2 text-lg font-bold leading-snug text-slate-950">{job.title}</h2>
                                <p className="mt-1 text-sm text-slate-500">{company?.name || "Hiring company"}</p>
                                {facts.length > 0 && <dl className="mt-5 space-y-3 border-t border-slate-100 pt-4">{facts.map(({ icon: Icon, label, value }) => <div key={label} className="flex items-start gap-3"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" /><div className="min-w-0"><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-0.5 break-words text-sm font-medium capitalize text-slate-800">{value}</dd></div></div>)}</dl>}
                                <Link href={`/job/${jobId}`} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-violet-700 hover:text-violet-900">Read full description <ArrowUpRight className="h-4 w-4" /></Link>
                            </div>
                        </section>

                        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/[0.03] sm:p-6">
                            <h2 className="font-semibold text-slate-950">Before you submit</h2>
                            <ul className="mt-4 space-y-3 text-sm leading-5 text-slate-600">
                                <li className="flex gap-2.5"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />Attach your latest resume as a PDF or Word document.</li>
                                <li className="flex gap-2.5"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />A cover letter is optional, but can help explain your fit.</li>
                                <li className="flex gap-2.5"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />Your application is sent directly to the hiring team.</li>
                            </ul>
                        </section>
                    </aside>
                </div>
            </ContainerWrapper>
        </main>
    );
};

export default Page;
