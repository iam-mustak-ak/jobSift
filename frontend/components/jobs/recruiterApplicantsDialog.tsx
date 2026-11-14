"use client";

import { API_BASE_URL } from "@/lib/api";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/state/store";
import { CalendarDays, Check, ChevronDown, ExternalLink, FileText, LoaderCircle, Mail, MapPin, MessageCircle, Search, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const stages = ["reviewing", "shortlisted", "interview", "offered", "hired", "rejected"] as const;
type Stage = (typeof stages)[number];
type Applicant = {
    _id: string;
    user?: string;
    candidateId?: string | { _id?: string; name?: string; email?: string; phone?: string; location?: string; profilePicture?: string; skills?: string[] };
    resume?: string;
    coverLetter?: string;
    dateApplied?: string;
    status?: string;
    statusNote?: string;
};

const statusLabel: Record<string, string> = {
    applied: "Applied", reviewing: "In review", shortlisted: "Shortlisted",
    interview: "Interview", offered: "Offer", hired: "Hired", rejected: "Not selected",
};

const statusStyle: Record<string, string> = {
    applied: "bg-slate-100 text-slate-700", reviewing: "bg-blue-50 text-blue-700",
    shortlisted: "bg-violet-50 text-violet-700", interview: "bg-amber-50 text-amber-800",
    offered: "bg-emerald-50 text-emerald-700", hired: "bg-emerald-100 text-emerald-800",
    rejected: "bg-rose-50 text-rose-700",
};

const getCandidate = (applicant: Applicant) => typeof applicant.candidateId === "object" ? applicant.candidateId : undefined;

export default function RecruiterApplicantsDialog({
    job,
}: {
    job: { _id: string; title: string; applicants?: Applicant[] };
}) {
    const [open, setOpen] = useState(false);
    const [applicants, setApplicants] = useState(job.applicants ?? []);
    const [filter, setFilter] = useState("all");
    const [query, setQuery] = useState("");
    const [drafts, setDrafts] = useState<Record<string, { status: string; note: string }>>(() => Object.fromEntries(
        (job.applicants ?? []).map((applicant) => [applicant._id, { status: applicant.status ?? "applied", note: applicant.statusNote ?? "" }])
    ));
    const [savingId, setSavingId] = useState("");
    const [startingChatId, setStartingChatId] = useState("");
    const user = useAuthStore((state) => state.user);
    const router = useRouter();

    const filteredApplicants = useMemo(() => applicants.filter((applicant) => {
        const candidate = getCandidate(applicant);
        const name = candidate?.name || applicant.user || "Candidate";
        const email = candidate?.email || "";
        const matchesQuery = `${name} ${email}`.toLowerCase().includes(query.trim().toLowerCase());
        return matchesQuery && (filter === "all" || (applicant.status ?? "applied") === filter);
    }), [applicants, filter, query]);

    const updateStatus = async (applicant: Applicant) => {
        const draft = drafts[applicant._id];
        if (!draft || draft.status === applicant.status || !stages.includes(draft.status as Stage)) return;
        setSavingId(applicant._id);
        try {
            const response = await fetch(`${API_BASE_URL}/job/${job._id}/applicants/${applicant._id}/status`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: draft.status, note: draft.note }),
            });
            const result = await response.json();
            if (!response.ok || !result.success) throw new Error(result.message || "Could not update application stage");
            const updated = result.data as Applicant;
            setApplicants((current) => current.map((item) => item._id === updated._id ? { ...item, ...updated } : item));
            setDrafts((current) => ({ ...current, [updated._id]: { status: updated.status ?? draft.status, note: updated.statusNote ?? draft.note } }));
            toast.success(`Candidate moved to ${statusLabel[updated.status ?? draft.status] ?? draft.status}`);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Could not update application stage");
        } finally {
            setSavingId("");
        }
    };

    const startConversation = async (applicant: Applicant) => {
        setStartingChatId(applicant._id);
        try {
            const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobId: job._id, applicationId: applicant._id }),
            });
            const result = await response.json();
            if (!response.ok || !result.success) throw new Error(result.message || "Could not start conversation");
            setOpen(false);
            router.push(`/profile/${user?._id}/messages?conversation=${result.data._id}`);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Could not start conversation");
        } finally {
            setStartingChatId("");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="h-9 rounded-xl bg-violet-700 px-3.5 text-sm font-semibold hover:bg-violet-800">
                    <UserRound className="mr-2 h-4 w-4" />Review {applicants.length} {applicants.length === 1 ? "applicant" : "applicants"}
                </Button>
            </DialogTrigger>
            <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-3xl">
                <DialogHeader className="border-b border-slate-100 px-5 py-5 pr-12 sm:px-7">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-violet-700">Hiring pipeline</p>
                    <DialogTitle className="mt-1 text-xl">Applicants for {job.title}</DialogTitle>
                    <DialogDescription>Review candidate materials and share their next step. Candidates can follow status updates from their profile.</DialogDescription>
                    <div className="mt-3 grid grid-cols-3 gap-2 sm:max-w-md">
                        {["applied", "interview", "offered"].map((stage) => <div key={stage} className="rounded-xl bg-slate-50 px-3 py-2"><p className="text-[11px] font-medium text-slate-500">{statusLabel[stage]}</p><p className="mt-0.5 text-lg font-bold text-slate-900">{applicants.filter((applicant) => (applicant.status ?? "applied") === stage).length}</p></div>)}
                    </div>
                </DialogHeader>

                <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-3 sm:flex-row sm:px-7">
                    <label className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by candidate or email" className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100" /></label>
                    <label className="relative"><span className="sr-only">Filter applicants by stage</span><select value={filter} onChange={(event) => setFilter(event.target.value)} className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-9 text-sm text-slate-700 outline-none focus:border-violet-400 sm:w-44"><option value="all">All stages</option>{["applied", ...stages].map((stage) => <option key={stage} value={stage}>{statusLabel[stage]}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /></label>
                </div>

                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50/60 p-4 sm:p-6">
                    {filteredApplicants.length ? filteredApplicants.map((applicant) => {
                        const candidate = getCandidate(applicant);
                        const currentStatus = applicant.status ?? "applied";
                        const draft = drafts[applicant._id] ?? { status: currentStatus, note: applicant.statusNote ?? "" };
                        const hasChanged = draft.status !== currentStatus || draft.note !== (applicant.statusNote ?? "");
                        return (
                            <article key={applicant._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                                    <div className="flex min-w-0 flex-1 items-start gap-3">
                                        <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-violet-50 font-semibold text-violet-700">{candidate?.profilePicture ? <img src={candidate.profilePicture} alt="" className="h-full w-full object-cover" /> : (candidate?.name || applicant.user || "C").slice(0, 1).toUpperCase()}</div>
                                        <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate font-semibold text-slate-950">{candidate?.name || applicant.user || "Candidate"}</h3><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[currentStatus] ?? statusStyle.applied}`}>{statusLabel[currentStatus] ?? currentStatus}</span></div>
                                            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">{candidate?.email && <a href={`mailto:${candidate.email}`} className="inline-flex items-center gap-1 hover:text-violet-700"><Mail className="h-3.5 w-3.5" />{candidate.email}</a>}{candidate?.phone && <a href={`tel:${candidate.phone}`} className="hover:text-violet-700">{candidate.phone}</a>}{candidate?.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{candidate.location}</span>}{applicant.dateApplied && <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />Applied {new Date(applicant.dateApplied).toLocaleDateString()}</span>}</div>
                                        </div>
                                    </div>
                                </div>

                                {candidate?.skills?.length ? <div className="mt-3 flex flex-wrap gap-1.5 pl-14">{candidate.skills.slice(0, 8).map((skill) => <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">{skill}</span>)}</div> : null}

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {applicant.resume && <a href={applicant.resume} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:border-violet-200 hover:text-violet-700"><FileText className="h-4 w-4" />View resume <ExternalLink className="h-3 w-3" /></a>}
                                    <Button type="button" disabled={startingChatId === applicant._id} onClick={() => void startConversation(applicant)} className="h-9 rounded-lg bg-violet-700 px-3 text-xs font-semibold hover:bg-violet-800">{startingChatId === applicant._id ? <LoaderCircle className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <MessageCircle className="mr-1.5 h-3.5 w-3.5" />}Start conversation</Button>
                                    {applicant.coverLetter && <details className="group min-w-0 flex-1 basis-full rounded-xl border border-slate-100 bg-slate-50"><summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 text-xs font-semibold text-slate-700"><span>Cover letter</span><ChevronDown className="h-4 w-4 transition group-open:rotate-180" /></summary><p className="whitespace-pre-wrap break-words border-t border-slate-100 px-3 py-3 text-sm leading-6 text-slate-600">{applicant.coverLetter}</p></details>}
                                </div>

                                <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-[minmax(150px,0.7fr)_minmax(0,1.3fr)_auto] sm:items-end">
                                    <label className="text-xs font-semibold text-slate-600">Move to stage<select value={draft.status} onChange={(event) => setDrafts((current) => ({ ...current, [applicant._id]: { ...draft, status: event.target.value } }))} className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"><option value="applied" disabled>Applied</option>{stages.map((stage) => <option key={stage} value={stage}>{statusLabel[stage]}</option>)}</select></label>
                                    <label className="text-xs font-semibold text-slate-600">Update for candidate <span className="font-normal text-slate-400">(optional)</span><input maxLength={500} value={draft.note} onChange={(event) => setDrafts((current) => ({ ...current, [applicant._id]: { ...draft, note: event.target.value } }))} placeholder="Add interview details or next steps" className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-normal text-slate-800 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100" /></label>
                                    <Button type="button" disabled={!hasChanged || savingId === applicant._id} onClick={() => void updateStatus(applicant)} className="h-10 rounded-lg bg-violet-700 px-4 text-sm font-semibold hover:bg-violet-800 disabled:bg-slate-200 disabled:text-slate-500">{savingId === applicant._id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <><Check className="mr-1.5 h-4 w-4" />Save stage</>}</Button>
                                </div>
                            </article>
                        );
                    }) : <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-12 text-center"><UserRound className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 font-semibold text-slate-800">{applicants.length ? "No candidates match these filters" : "No applicants yet"}</p><p className="mt-1 text-sm text-slate-500">{applicants.length ? "Try another name or pipeline stage." : "New applications will appear here."}</p></div>}
                </div>
            </DialogContent>
        </Dialog>
    );
}
