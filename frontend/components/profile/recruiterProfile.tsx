"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { ArrowUpRight, BriefcaseBusiness, Building2, Check, Globe2, MapPin, Pencil, Plus, Users, X } from "lucide-react";
import { useAuthStore } from "@/state/store";

type CompanyProfile = {
    _id?: string;
    name?: string;
    website?: string;
    industry?: string;
    size?: string;
    foundedYear?: number | string;
    location?: string;
    description?: string;
    logo?: string;
    banner?: string;
    socialLinks?: { platform: string; url: string }[];
};

type RecruiterJob = {
    _id: string;
    title: string;
    location?: string;
    jobType?: string;
    isDraft?: boolean;
    isPublished?: boolean;
    applicants?: unknown[];
    createdAt?: string;
};

const inputClass = "mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100";
const labelClass = "text-sm font-medium text-slate-700";

export default function RecruiterProfile({
    user,
    initialCompany,
    jobs,
}: {
    user: Record<string, any>;
    initialCompany: CompanyProfile | null;
    jobs: RecruiterJob[];
}) {
    const [company, setCompany] = useState<CompanyProfile | null>(initialCompany);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const setAuth = useAuthStore((state) => state.setAuth);
    const [form, setForm] = useState<CompanyProfile>(() => ({
        name: initialCompany?.name ?? "",
        website: initialCompany?.website ?? "",
        industry: initialCompany?.industry ?? "",
        size: initialCompany?.size ?? "",
        foundedYear: initialCompany?.foundedYear ?? "",
        location: initialCompany?.location ?? "",
        description: initialCompany?.description ?? "",
        logo: initialCompany?.logo ?? "",
        banner: initialCompany?.banner ?? "",
        socialLinks: initialCompany?.socialLinks?.length ? initialCompany.socialLinks : [{ platform: "LinkedIn", url: "" }],
    }));

    const activeJobs = useMemo(() => jobs.filter((job) => job.isPublished && !job.isDraft), [jobs]);
    const drafts = useMemo(() => jobs.filter((job) => job.isDraft || !job.isPublished), [jobs]);
    const applicants = useMemo(() => jobs.reduce((total, job) => total + (job.applicants?.length ?? 0), 0), [jobs]);
    const completeness = useMemo(() => {
        if (!company) return 0;
        const fields = [company.name, company.website, company.industry, company.size, company.location, company.description, company.logo];
        return Math.round((fields.filter((value) => String(value ?? "").trim().length > 0).length / fields.length) * 100);
    }, [company]);

    const setField = (key: keyof CompanyProfile, value: string) => setForm((current) => ({ ...current, [key]: value }));
    const openEditor = () => {
        setForm({
            name: company?.name ?? "", website: company?.website ?? "", industry: company?.industry ?? "",
            size: company?.size ?? "", foundedYear: company?.foundedYear ?? "", location: company?.location ?? "",
            description: company?.description ?? "", logo: company?.logo ?? "", banner: company?.banner ?? "",
            socialLinks: company?.socialLinks?.length ? company.socialLinks : [{ platform: "LinkedIn", url: "" }],
        });
        setError(""); setNotice(""); setEditing(true);
    };

    const saveCompany = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); setSaving(true); setError("");
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/${company?._id ? "update-company" : "create-company"}`, {
                method: company?._id ? "PATCH" : "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, socialLinks: form.socialLinks?.filter((item) => item.url?.trim()) }),
            });
            const result = await response.json();
            if (!response.ok || !result.success) throw new Error(result.message || "Could not save company profile");
            setCompany(result.data);
            if (!user.company) setAuth({ ...user, company: result.data._id });
            setNotice("Company profile saved successfully.");
            setEditing(false);
        } catch (saveError) {
            setError(saveError instanceof Error ? saveError.message : "Could not save company profile");
        } finally { setSaving(false); }
    };

    return (
        <main className="mx-auto w-full max-w-6xl space-y-7 pb-10">
            <section className="relative overflow-hidden rounded-[28px] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-6 sm:p-9">
                <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-violet-200/40 blur-3xl" />
                <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white bg-white text-violet-700 shadow-sm">
                            {company?.logo ? <img src={company.logo} alt="Company logo" className="h-full w-full object-cover" /> : <Building2 className="h-7 w-7" />}
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">Recruiter workspace</p>
                            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{company?.name || "Set up your company profile"}</h1>
                            <p className="mt-1 text-sm text-slate-600">{user.name || "Recruiter"}{company?.industry ? ` · ${company.industry}` : " · Build your employer presence"}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button onClick={openEditor} className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:text-violet-700"><Pencil className="h-4 w-4" />{company ? "Edit company" : "Add company details"}</button>
                        <Link href="/post-job" className="inline-flex h-11 items-center gap-2 rounded-xl bg-violet-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-800"><Plus className="h-4 w-4" />Post a job</Link>
                    </div>
                </div>
                {notice && <p role="status" className="relative mt-5 flex items-center gap-2 text-sm font-medium text-emerald-700"><Check className="h-4 w-4" />{notice}</p>}
            </section>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Active openings", value: activeJobs.length, icon: BriefcaseBusiness, tint: "bg-violet-50 text-violet-700" },
                    { label: "Applicants received", value: applicants, icon: Users, tint: "bg-sky-50 text-sky-700" },
                    { label: "Roles in draft", value: drafts.length, icon: Pencil, tint: "bg-amber-50 text-amber-700" },
                    { label: "Company profile", value: company ? `${completeness}%` : "Setup", icon: Building2, tint: "bg-emerald-50 text-emerald-700" },
                ].map(({ label, value, icon: Icon, tint }) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/[0.025]"><div className="flex items-center justify-between"><span className="text-sm font-medium text-slate-500">{label}</span><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tint}`}><Icon className="h-5 w-5" /></span></div><p className="mt-4 text-3xl font-bold tracking-tight text-slate-950">{value}</p></div>)}
            </section>

            <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.025]">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6"><div><h2 className="font-semibold text-slate-950">Hiring activity</h2><p className="mt-1 text-sm text-slate-500">Manage your current openings and drafts.</p></div><Link href={`/profile/${user._id}/my-jobs?page=1`} className="inline-flex items-center gap-1 text-sm font-semibold text-violet-700 hover:text-violet-900">All jobs <ArrowUpRight className="h-4 w-4" /></Link></div>
                    {jobs.length ? <div className="divide-y divide-slate-100">{jobs.slice(0, 5).map((job) => <div key={job._id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div className="min-w-0"><Link href={`/job/${job._id}`} className="font-semibold text-slate-900 hover:text-violet-700">{job.title}</Link><p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500"><MapPin className="h-3.5 w-3.5" />{job.location || "Location not specified"}<span className="px-1">·</span>{job.jobType || "Role"}</p></div><div className="flex items-center gap-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${job.isDraft || !job.isPublished ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{job.isDraft || !job.isPublished ? "Draft" : "Published"}</span><span className="text-xs text-slate-500">{job.applicants?.length ?? 0} applicants</span><Link aria-label={`Edit ${job.title}`} href={`/edit-job/${job._id}`} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-violet-200 hover:text-violet-700"><Pencil className="h-4 w-4" /></Link></div></div>)}</div> : <div className="px-6 py-12 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700"><BriefcaseBusiness className="h-5 w-5" /></span><h3 className="mt-4 font-semibold text-slate-900">Your hiring starts here</h3><p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">Create your first opening to reach candidates and start building your pipeline.</p><Link href="/post-job" className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-violet-700 px-4 text-sm font-semibold text-white hover:bg-violet-800"><Plus className="h-4 w-4" />Create a job</Link></div>}
                </section>

                <aside className="space-y-5">
                    <section id="company-profile" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/[0.025] sm:p-6">
                        <div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-violet-700">Employer presence</p><h2 className="mt-1.5 text-lg font-semibold text-slate-950">Company profile</h2></div><button onClick={openEditor} aria-label="Edit company profile" className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-violet-200 hover:text-violet-700"><Pencil className="h-4 w-4" /></button></div>
                        {company ? <><p className="mt-3 text-sm leading-6 text-slate-600">{company.description || "Add a company overview so candidates can learn about your team and workplace."}</p><div className="mt-5 space-y-3 text-sm">{company.location && <p className="flex items-center gap-2 text-slate-600"><MapPin className="h-4 w-4 text-slate-400" />{company.location}</p>}{company.website && <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-violet-700 hover:underline"><Globe2 className="h-4 w-4" />{company.website.replace(/^https?:\/\//, "")}</a>}{company.size && <p className="flex items-center gap-2 text-slate-600"><Users className="h-4 w-4 text-slate-400" />{company.size} employees{company.foundedYear ? ` · Founded ${company.foundedYear}` : ""}</p>}{company.socialLinks?.filter((item) => item.url).map((item) => <a key={item.platform} href={item.url} target="_blank" rel="noreferrer" className="block text-sm text-violet-700 hover:underline">{item.platform}</a>)}</div></> : <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4"><p className="text-sm leading-6 text-slate-600">Add your industry, size, website and company story. A complete profile helps candidates trust the opportunities you share.</p><button onClick={openEditor} className="mt-4 text-sm font-semibold text-violet-700 hover:text-violet-900">Complete company profile <ArrowUpRight className="ml-1 inline h-4 w-4" /></button></div>}
                    </section>
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/[0.025] sm:p-6"><h2 className="font-semibold text-slate-950">Recruiter contact</h2><p className="mt-1 text-sm text-slate-500">The account candidates and your team can reach.</p><div className="mt-4 space-y-2 text-sm text-slate-700"><p className="font-medium">{user.name || "Add your name"}</p><p>{user.email || "Add a work email"}</p>{user.phone && <p>{user.phone}</p>}{user.location && <p>{user.location}</p>}</div><Link href={`/profile/${user._id}/edit-profile`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-violet-900"><Pencil className="h-4 w-4" />Edit contact details</Link></section>
                </aside>
            </div>

            {editing && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setEditing(false); }}><section role="dialog" aria-modal="true" aria-labelledby="company-editor-title" className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-700">Employer profile</p><h2 id="company-editor-title" className="mt-1 text-xl font-bold text-slate-950">{company ? "Edit company details" : "Create your company profile"}</h2><p className="mt-1 text-sm text-slate-500">Give job seekers a clear, trustworthy picture of your organization.</p></div><button disabled={saving} onClick={() => setEditing(false)} aria-label="Close" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button></div>
                    <form onSubmit={saveCompany} className="mt-6 space-y-5"><div className="grid gap-4 sm:grid-cols-2"><label className={labelClass}>Company name<input required maxLength={120} className={inputClass} value={form.name ?? ""} onChange={(event) => setField("name", event.target.value)} placeholder="Northstar Studio" /></label><label className={labelClass}>Company website<input type="url" className={inputClass} value={form.website ?? ""} onChange={(event) => setField("website", event.target.value)} placeholder="https://company.com" /></label><label className={labelClass}>Industry<input maxLength={100} className={inputClass} value={form.industry ?? ""} onChange={(event) => setField("industry", event.target.value)} placeholder="Technology, healthcare…" /></label><label className={labelClass}>Company size<select className={inputClass} value={form.size ?? ""} onChange={(event) => setField("size", event.target.value)}><option value="">Select team size</option>{["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5001+"].map((size) => <option key={size} value={size}>{size} employees</option>)}</select></label><label className={labelClass}>Headquarters<input maxLength={160} className={inputClass} value={form.location ?? ""} onChange={(event) => setField("location", event.target.value)} placeholder="City, country" /></label><label className={labelClass}>Year founded<input type="number" min="1800" max={new Date().getFullYear()} className={inputClass} value={form.foundedYear ?? ""} onChange={(event) => setField("foundedYear", event.target.value)} placeholder="2018" /></label><label className={labelClass}>Logo image URL<input type="url" className={inputClass} value={form.logo ?? ""} onChange={(event) => setField("logo", event.target.value)} placeholder="https://…" /></label><label className={labelClass}>Cover image URL<input type="url" className={inputClass} value={form.banner ?? ""} onChange={(event) => setField("banner", event.target.value)} placeholder="https://…" /></label></div><label className={`${labelClass} block`}>About the company<textarea maxLength={5000} rows={5} className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100" value={form.description ?? ""} onChange={(event) => setField("description", event.target.value)} placeholder="Share your mission, team culture, products, and what makes your company a great place to work." /><span className="mt-1 block text-right text-xs font-normal text-slate-400">{form.description?.length ?? 0}/5000</span></label><div><p className={labelClass}>Company social links</p>{form.socialLinks?.map((item, index) => <div key={index} className="mt-2 grid gap-2 sm:grid-cols-[0.7fr_1.3fr_auto]"><input aria-label="Social platform" className={inputClass.replace("mt-1.5", "mt-0")} value={item.platform} onChange={(event) => setForm((current) => ({ ...current, socialLinks: current.socialLinks?.map((link, linkIndex) => linkIndex === index ? { ...link, platform: event.target.value } : link) }))} placeholder="Platform" /><input type="url" aria-label="Social link URL" className={inputClass.replace("mt-1.5", "mt-0")} value={item.url} onChange={(event) => setForm((current) => ({ ...current, socialLinks: current.socialLinks?.map((link, linkIndex) => linkIndex === index ? { ...link, url: event.target.value } : link) }))} placeholder="https://linkedin.com/company/…" /><button type="button" aria-label="Remove social link" onClick={() => setForm((current) => ({ ...current, socialLinks: current.socialLinks?.filter((_, linkIndex) => linkIndex !== index) }))} className="flex h-11 items-center justify-center rounded-xl border border-slate-200 px-3 text-slate-500 hover:bg-slate-50"><X className="h-4 w-4" /></button></div>)}<button type="button" onClick={() => setForm((current) => ({ ...current, socialLinks: [...(current.socialLinks ?? []), { platform: "", url: "" }] }))} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-violet-700 hover:text-violet-900"><Plus className="h-4 w-4" />Add social link</button></div>{error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}<div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end"><button type="button" disabled={saving} onClick={() => setEditing(false)} className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button><button disabled={saving} type="submit" className="h-11 rounded-xl bg-violet-700 px-5 text-sm font-semibold text-white hover:bg-violet-800 disabled:opacity-60">{saving ? "Saving…" : "Save company profile"}</button></div></form>
                </section></div>}
        </main>
    );
}
