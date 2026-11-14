"use client";

import { API_BASE_URL } from "@/lib/api";
import { useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Check, FileText, LoaderCircle, ShieldCheck, UploadCloud, X } from "lucide-react";
import { useAuthStore } from "@/state/store";

const MAX_RESUME_SIZE = 5 * 1024 * 1024;
const ACCEPTED_RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"];

const ApplyJobForm = ({ jobId, jobTitle }: { jobId: string; jobTitle?: string }) => {
    const [coverLetter, setCoverLetter] = useState("");
    const [resume, setResume] = useState<File | null>(null);
    const [stage, setStage] = useState<"idle" | "uploading" | "submitting">("idle");
    const [error, setError] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const isLoading = stage !== "idle";

    const chooseResume = (file?: File) => {
        if (!file) return;
        const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
        if (!ACCEPTED_RESUME_EXTENSIONS.includes(extension)) {
            setError("Please choose a PDF, DOC, or DOCX resume.");
            setResume(null);
            return;
        }
        if (file.size > MAX_RESUME_SIZE) {
            setError("Your resume must be 5 MB or smaller.");
            setResume(null);
            return;
        }
        setError("");
        setResume(file);
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        chooseResume(event.currentTarget.files?.[0]);
        event.currentTarget.value = "";
    };

    const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setIsDragging(false);
        chooseResume(event.dataTransfer.files?.[0]);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        if (!jobId) return setError("This job link is missing an ID. Return to the job listing and try again.");
        if (!resume) return setError("Attach your resume before submitting your application.");
        if (user && user.role !== "candidate") return setError("A candidate account is required to apply for this job.");
        if (user?.appliedJobs?.some((application: { jobId: string }) => String(application.jobId) === jobId)) {
            return setError("You have already applied for this job. You can review it in your applied jobs.");
        }

        try {
            setStage("uploading");
            const resumeForm = new FormData();
            resumeForm.append("resume", resume);
            const uploadResponse = await fetch(`${API_BASE_URL}/upload-resume`, {
                method: "POST",
                body: resumeForm,
                credentials: "include",
            });
            const uploadResult = await uploadResponse.json();
            if (!uploadResponse.ok || !uploadResult.success) {
                throw new Error(uploadResult.message || "We couldn't upload your resume. Please try again.");
            }
            const resumeUrl = uploadResult?.data?.resumeUrl;
            if (typeof resumeUrl !== "string" || !resumeUrl) throw new Error("Resume upload completed without a file link. Please try again.");

            setStage("submitting");
            const response = await fetch(`${API_BASE_URL}/job/apply/${jobId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ coverLetter: coverLetter.trim(), resume: resumeUrl }),
                credentials: "include",
            });
            const result = await response.json();
            if (!response.ok || !result.success) throw new Error(result.message || "We couldn't submit your application. Please try again.");

            toast.success("Your application has been submitted.");
            router.push(user?._id ? `/profile/${user._id}/applied-jobs` : "/find-jobs/?page=1");
        } catch (submitError) {
            const message = submitError instanceof Error ? submitError.message : "Something went wrong. Please try again.";
            setError(message);
            toast.error(message);
        } finally {
            setStage("idle");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-7">
            <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-violet-50 text-violet-700 ring-1 ring-violet-100"><FileText className="h-5 w-5" /></span>
                <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-700">Application</p>
                    <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">{jobTitle ? `Apply for ${jobTitle}` : "Tell us about yourself"}</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-500">Add your resume and a short note to introduce yourself to the hiring team.</p>
                </div>
            </div>

            <section aria-labelledby="resume-label">
                <div className="mb-2 flex items-center justify-between gap-3">
                    <div><h3 id="resume-label" className="text-sm font-semibold text-slate-900">Resume <span className="text-rose-600">*</span></h3><p className="mt-0.5 text-xs text-slate-500">PDF, DOC or DOCX · 5 MB max</p></div>
                    {resume && <button type="button" onClick={() => setResume(null)} disabled={isLoading} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-rose-600"><X className="h-3.5 w-3.5" />Remove</button>}
                </div>
                {resume ? (
                    <div className="flex items-center gap-3 rounded-2xl border border-violet-200 bg-violet-50/60 p-4">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-violet-700 shadow-sm"><FileText className="h-5 w-5" /></span>
                        <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-900">{resume.name}</p><p className="mt-0.5 text-xs text-slate-500">{(resume.size / (1024 * 1024)).toFixed(resume.size > 1024 * 1024 ? 1 : 2)} MB · Ready to upload</p></div>
                        <Check className="h-5 w-5 shrink-0 text-emerald-600" />
                    </div>
                ) : (
                    <button type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop} className={`group flex min-h-44 w-full flex-col items-center justify-center rounded-2xl border border-dashed px-5 py-7 text-center transition ${isDragging ? "border-violet-500 bg-violet-50" : "border-slate-300 bg-slate-50/70 hover:border-violet-300 hover:bg-violet-50/50"}`}>
                        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-violet-700 shadow-sm ring-1 ring-slate-200 transition group-hover:ring-violet-200"><UploadCloud className="h-5 w-5" /></span>
                        <span className="mt-3 text-sm font-semibold text-slate-900">Choose a resume or drag it here</span>
                        <span className="mt-1 text-xs text-slate-500">Your resume is uploaded securely and shared with this employer.</span>
                        <span className="mt-4 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">Browse files</span>
                    </button>
                )}
                <input ref={inputRef} className="sr-only" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileChange} />
            </section>

            <section>
                <div className="mb-2 flex items-end justify-between gap-3"><div><label htmlFor="cover-letter" className="text-sm font-semibold text-slate-900">Cover letter <span className="font-normal text-slate-400">(optional)</span></label><p className="mt-0.5 text-xs text-slate-500">Briefly explain why this role is a good fit for you.</p></div><span className="shrink-0 text-xs text-slate-400">{coverLetter.length}/5000</span></div>
                <textarea id="cover-letter" value={coverLetter} onChange={(event) => setCoverLetter(event.target.value.slice(0, 5000))} rows={7} maxLength={5000} placeholder="Hello hiring team,\n\nI’m interested in this role because…" disabled={isLoading} className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:bg-slate-50" />
            </section>

            {error && <p role="alert" className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm leading-5 text-rose-700">{error}</p>}

            <div className="flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2 text-xs leading-5 text-slate-500"><ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />Your contact details and resume are shared with the hiring team.</p>
                <button type="submit" disabled={isLoading || !resume} className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-700 px-6 text-sm font-semibold text-white shadow-sm shadow-violet-700/20 transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-55">
                    {isLoading ? <><LoaderCircle className="h-4 w-4 animate-spin" />{stage === "uploading" ? "Uploading resume…" : "Submitting application…"}</> : <>Submit application <ArrowRight className="h-4 w-4" /></>}
                </button>
            </div>
        </form>
    );
};

export default ApplyJobForm;
