import Link from "next/link";
import { ArrowUpRight, Building2, CalendarDays, CheckCircle2, CircleDot, MapPin } from "lucide-react";

const labels: Record<string, string> = {
    applied: "Application submitted", reviewing: "In review", shortlisted: "Shortlisted",
    interview: "Interview", offered: "Offer received", hired: "Hired", rejected: "Not selected",
};
const styles: Record<string, string> = {
    applied: "bg-slate-100 text-slate-700", reviewing: "bg-blue-50 text-blue-700",
    shortlisted: "bg-violet-50 text-violet-700", interview: "bg-amber-50 text-amber-800",
    offered: "bg-emerald-50 text-emerald-700", hired: "bg-emerald-100 text-emerald-800",
    rejected: "bg-rose-50 text-rose-700",
};

type ApplicationEvent = { status: string; note?: string; changedAt?: string };
type ApplicationJob = {
    _id: string;
    title: string;
    location?: string;
    company?: { name?: string; logo?: string };
    application?: {
        status?: string;
        statusNote?: string;
        dateApplied?: string;
        statusHistory?: ApplicationEvent[];
    };
};

const formatDate = (value?: string) => value
    ? new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : "Date unavailable";

export default function CandidateApplicationCard({ job }: { job: ApplicationJob }) {
    const application = job.application ?? {};
    const currentStatus = application.status ?? "applied";
    const history = [...(application.statusHistory ?? [])].sort((a, b) =>
        new Date(a.changedAt ?? 0).getTime() - new Date(b.changedAt ?? 0).getTime()
    );

    return (
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.025]">
            <div className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3.5">
                        <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-slate-100 bg-violet-50 text-violet-700">{job.company?.logo ? <img src={job.company.logo} alt="" className="h-full w-full object-cover" /> : <Building2 className="h-5 w-5" />}</div>
                        <div className="min-w-0"><Link href={`/job/${job._id}`} className="line-clamp-2 text-base font-semibold leading-snug text-slate-950 hover:text-violet-700">{job.title}</Link><p className="mt-1 truncate text-sm text-slate-500">{job.company?.name || "Company"}</p><div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">{job.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>}<span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />Applied {formatDate(application.dateApplied)}</span></div></div>
                    </div>
                    <span className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${styles[currentStatus] ?? styles.applied}`}><CircleDot className="h-3.5 w-3.5" />{labels[currentStatus] ?? currentStatus}</span>
                </div>

                <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                    <div className="flex items-center justify-between gap-3"><h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Application progress</h3><Link href={`/job/${job._id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-violet-700 hover:text-violet-900">Job details <ArrowUpRight className="h-3.5 w-3.5" /></Link></div>
                    <ol className="mt-4 space-y-0">
                        {history.map((event, index) => {
                            const isLatest = index === history.length - 1;
                            return <li key={`${event.status}-${event.changedAt ?? index}`} className="relative flex gap-3 pb-4 last:pb-0"><span aria-hidden="true" className={`relative z-10 mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${isLatest ? "bg-violet-100 text-violet-700" : "bg-emerald-100 text-emerald-700"}`}>{isLatest ? <CircleDot className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}</span>{index < history.length - 1 && <span aria-hidden="true" className="absolute left-[9px] top-5 h-full w-px bg-slate-200" />}<div className="min-w-0 flex-1"><div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1"><p className={`text-sm font-semibold ${isLatest ? "text-slate-900" : "text-slate-700"}`}>{labels[event.status] ?? event.status}</p><time className="text-xs text-slate-400">{formatDate(event.changedAt)}</time></div>{event.note && event.note !== "Application submitted" && <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-5 text-slate-600">{event.note}</p>}</div></li>;
                        })}
                    </ol>
                    {currentStatus === "rejected" && <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-xs leading-5 text-rose-700">This application is closed. You can continue exploring other opportunities.</p>}
                </div>
            </div>
        </article>
    );
}
