/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { API_BASE_URL } from "@/lib/api";
import AtsChart from "@/components/common/atsChart";
import ContainerWrapper from "@/components/common/containerWrapper";
import WorkspacePageHeading from "@/components/common/workspacePageHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    BadgeCheck,
    BriefcaseBusiness,
    ChartNoAxesCombined,
    CheckCircle2,
    Clipboard,
    FileUpIcon,
    FileSearch,
    RefreshCw,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = () => {
    const [analysisMode, setAnalysisMode] = useState<"job-description" | "resume-only">("job-description");
    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [jd, setJd] = useState<string>("");

    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!file) return;
        const blobUrl = URL.createObjectURL(file);
        setUrl(blobUrl);
        return () => URL.revokeObjectURL(blobUrl);
    }, [file]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!file) return;
            if (analysisMode === "job-description" && !jd.trim()) {
                toast.error("Add the job description you want to compare against.");
                return;
            }
            setLoading(true);
            const fd = new FormData();
            fd.append("file", file);
            fd.append("mode", analysisMode);
            if (analysisMode === "job-description") fd.append("jobDescription", jd.trim());
            const res = await fetch(
                `${API_BASE_URL}/analyze`,
                { method: "POST", body: fd }
            );
            const json = await res.json();
            if (!res.ok || !json?.success) {
                toast.error(json?.message || json?.error || "Resume analysis failed. Please try again.");
                return;
            }
            setResult(json);
        } catch (err) {
            toast.error("Could not reach the resume analysis service.");
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setJd(text);

            toast.success("Pasted");
        } catch (err) {
            toast.error("Error Pasting");
        }
    };

    const data = result?.data;
    const resetAnalysis = () => {
        setResult(null);
        setFile(null);
        setUrl(null);
    };

    return (
        <ContainerWrapper>
            <div className="mx-auto min-h-[calc(100vh-8rem)] max-w-6xl space-y-7 pb-12 pt-16 sm:pt-20">
                <WorkspacePageHeading
                    title={result?.success
                        ? result.mode === "resume-only" ? "ATS resume review" : "Resume insights"
                        : "Analyze your resume"}
                    description={result?.mode === "resume-only"
                        ? "Review ATS readiness, structure, and clarity without a job description."
                        : "Compare your resume with a job description or review its ATS readiness on its own."}
                    icon={<ChartNoAxesCombined className="h-5 w-5" />}
                />
                <div className="flex w-full flex-col items-start justify-center gap-8">
                    {loading ? (
                        <div className="flex min-h-72 w-full flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white text-center shadow-sm">
                            <Image src="/file-loader.gif" alt="Analyzing resume" width={180} height={180} />
                            <p className="mt-2 text-sm font-semibold text-slate-800">Reviewing your resume</p>
                            <p className="mt-1 text-xs text-slate-500">{analysisMode === "resume-only" ? "Reviewing structure, readability, and section quality…" : "Comparing skills, keywords, and overall structure…"}</p>
                        </div>
                    ) : (
                        <>
                            {!result && (
                                <div className="w-full space-y-5">
                                    <div>
                                        <h2 className="text-sm font-semibold text-slate-800">Choose how to analyze</h2>
                                        <p className="mt-1 text-sm text-slate-500">Use a target job for a tailored match, or review the resume by itself.</p>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <button
                                            type="button"
                                            aria-pressed={analysisMode === "job-description"}
                                            onClick={() => setAnalysisMode("job-description")}
                                            className={`flex h-full items-start gap-4 rounded-2xl border p-5 text-left transition ${analysisMode === "job-description" ? "border-violet-300 bg-violet-50/70 ring-2 ring-violet-100" : "border-slate-200 bg-white hover:border-violet-200"}`}
                                        >
                                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-violet-700 shadow-sm"><BriefcaseBusiness className="h-5 w-5" /></span>
                                            <span><span className="block text-sm font-semibold text-slate-900">Match a job description</span><span className="mt-1 block text-xs leading-5 text-slate-500">Check role fit, matching and missing keywords, and skills.</span></span>
                                        </button>
                                        <button
                                            type="button"
                                            aria-pressed={analysisMode === "resume-only"}
                                            onClick={() => setAnalysisMode("resume-only")}
                                            className={`flex h-full items-start gap-4 rounded-2xl border p-5 text-left transition ${analysisMode === "resume-only" ? "border-violet-300 bg-violet-50/70 ring-2 ring-violet-100" : "border-slate-200 bg-white hover:border-violet-200"}`}
                                        >
                                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-violet-700 shadow-sm"><FileSearch className="h-5 w-5" /></span>
                                            <span><span className="block text-sm font-semibold text-slate-900">Resume-only ATS review</span><span className="mt-1 block text-xs leading-5 text-slate-500">Review structure, readability, sections, and achievement clarity.</span></span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {result ? (
                                <div className="w-full space-y-4">
                                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
                                        <p className="flex items-center gap-2 text-sm font-medium text-emerald-800"><BadgeCheck className="h-4 w-4" />{result.mode === "resume-only" ? "Resume-only ATS review complete" : "Job description comparison complete"}</p>
                                        <Button type="button" variant="outline" className="h-9 rounded-xl border-emerald-200 bg-white" onClick={resetAnalysis}><RefreshCw className="mr-2 h-4 w-4" />Analyze another</Button>
                                    </div>
                                    <iframe
                                        title="PDF preview"
                                        src={url as string}
                                        className="sticky top-20 h-[70vh] w-full rounded-2xl border border-slate-200 bg-white shadow-sm"
                                    />
                                </div>
                            ) : (
                                <div className="grid min-h-[500px] w-full grid-cols-1 items-stretch justify-center gap-5 lg:grid-cols-2">
                                    {analysisMode === "job-description" ? (
                                    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                                        <Label
                                            htmlFor="description"
                                            className="mb-3 text-sm font-semibold text-slate-800"
                                        >
                                            Paste the job description
                                        </Label>
                                        <div className="relative min-h-72 flex-1 overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60 focus-within:border-violet-300 focus-within:ring-4 focus-within:ring-violet-100/70">
                                            <textarea
                                                id="description"
                                                placeholder="Paste the responsibilities and qualifications from the job posting…"
                                                className="h-full min-h-72 w-full resize-none bg-transparent p-4 pr-14 text-sm leading-6 text-slate-700 outline-none placeholder:text-slate-400"
                                                value={jd}
                                                onChange={(e) =>
                                                    setJd(e.target.value)
                                                }
                                            ></textarea>
                                            <Button
                                                className="absolute bottom-3 right-3 h-9 rounded-xl border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-violet-50 hover:text-violet-700"
                                                variant={"outline"}
                                                onClick={handleClipboard}
                                                title="Paste Job Description"
                                            >
                                                <Clipboard className="mr-2 h-4 w-4" /> Paste
                                            </Button>
                                        </div>
                                    </div>
                                    ) : (
                                        <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                                            <h2 className="text-sm font-semibold text-slate-800">What this review checks</h2>
                                            <p className="mt-1 text-sm leading-5 text-slate-500">No job description needed. The review focuses on general ATS readability and resume quality.</p>
                                            <ul className="mt-5 grid gap-3">
                                                {["Clear sections and headings", "Readable dates, titles, and employers", "Action verbs and measurable impact", "Concise, consistent formatting"].map((item) => (
                                                    <li key={item} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-700"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />{item}</li>
                                                ))}
                                            </ul>
                                            <p className="mt-auto pt-5 text-xs leading-5 text-slate-400">This mode reviews the resume on its own; it won’t estimate fit for a particular job.</p>
                                        </div>
                                    )}
                                    <div className="flex w-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                                        <Label className="mb-3 text-sm font-semibold text-slate-800">
                                            Upload your resume
                                        </Label>
                                        <Label
                                            htmlFor="pdf-file"
                                            className="group flex min-h-72 w-full flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-gradient-to-b from-slate-50 to-white p-6 text-center transition hover:border-violet-400 hover:bg-violet-50/40"
                                        >
                                            <Input
                                                type="file"
                                                className="hidden"
                                                hidden
                                                name="file"
                                                accept="application/pdf"
                                                id="pdf-file"
                                                onChange={(e) =>
                                                    setFile(
                                                        e.target.files?.[0] ??
                                                            null
                                                    )
                                                }
                                            />
                                            <FileUpIcon
                                                className="mb-4 h-14 w-14 rounded-2xl bg-violet-50 p-3 text-violet-600 opacity-90"
                                            />
                                            <p className="text-sm font-semibold text-slate-800">Choose a PDF resume</p>
                                            <p className="mt-1 text-xs text-slate-500">Click to browse your files</p>
                                        </Label>
                                        <p className="mt-3 truncate text-sm font-medium text-slate-600">
                                            {file?.name || "No file selected"}
                                        </p>
                                        <Button
                                            className="mt-4 h-11 rounded-xl bg-violet-700 font-semibold shadow-sm shadow-violet-700/15 hover:bg-violet-800"
                                            disabled={loading || !file || (analysisMode === "job-description" && !jd.trim())}
                                            onClick={onSubmit}
                                        >
                                            {analysisMode === "resume-only" ? "Review resume" : "Compare with job"}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {result && (
                                <div className="flex flex-col gap-4 w-full">
                                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                            <h2 className="mb-3 text-lg font-semibold text-slate-900">
                                                {result.mode === "resume-only" ? "ATS readiness" : "ATS match score"}
                                            </h2>
                                            <p className="mb-3 text-xs leading-5 text-slate-500">
                                                {result.mode === "resume-only" ? "General resume quality and parsing readiness." : "How closely your resume aligns with this job description."}
                                            </p>
                                            <AtsChart
                                                atsScore={data?.atsScore}
                                            />
                                        </div>
                                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                            <h2 className="mb-3 text-lg font-semibold text-slate-900">
                                                {result.mode === "resume-only" ? "Review summary" : "Missing Keywords"}
                                            </h2>
                                            {result.mode === "resume-only" ? (
                                                <p className="text-sm leading-6 text-slate-600">{data?.summary || "The resume was reviewed for general ATS readability and structure."}</p>
                                            ) : (
                                                <ul className="max-h-[360px] space-y-2 overflow-y-auto text-sm text-slate-600">
                                                    {(data?.keywordCoverage?.missingKeywords ?? []).length ? data.keywordCoverage.missingKeywords.map((item: string, i: number) => <li key={i}>{item}</li>) : <li>No important missing keywords were identified.</li>}
                                                </ul>
                                            )}
                                        </div>
                                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                            <h2 className="mb-3 text-lg font-semibold text-slate-900">
                                                {result.mode === "resume-only" ? "Resume strengths" : "Missing Skills"}
                                            </h2>
                                            <ul className="max-h-[360px] space-y-2 overflow-y-auto text-sm text-slate-600">
                                                {(result.mode === "resume-only" ? data?.strengths ?? [] : data?.missingSkills ?? []).length ? (result.mode === "resume-only" ? data.strengths : data.missingSkills).map((item: string, i: number) => <li key={i}>{item}</li>) : <li>{result.mode === "resume-only" ? "No clear strengths were detected." : "No missing skills were identified."}</li>}
                                            </ul>
                                        </div>
                                        {result.mode === "resume-only" && (
                                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                                <h2 className="mb-3 text-lg font-semibold text-slate-900">Skills identified</h2>
                                                <div className="flex flex-wrap gap-2">
                                                    {(data?.skillsIdentified ?? []).length ? data.skillsIdentified.map((skill: string, i: number) => <span key={`${skill}-${i}`} className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-800">{skill}</span>) : <p className="text-sm text-slate-500">No explicit skills section was detected.</p>}
                                                </div>
                                            </div>
                                        )}
                                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                            <h2 className="mb-3 text-lg font-semibold text-slate-900">
                                                Overall Quality
                                            </h2>
                                            <ul className="max-h-[360px] space-y-2 overflow-y-auto text-sm text-slate-600">
                                                {Object?.entries(
                                                    data?.sectionQuality || {}
                                                )?.map(
                                                    ([section, quality], i) => (
                                                        <li key={i}>
                                                            <span className="font-semibold">
                                                                {section}:
                                                            </span>{" "}
                                                            {
                                                                String(
                                                                    quality
                                                                )?.split("-")[0]
                                                            }
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                            <h2 className="mb-3 text-lg font-semibold text-slate-900">ATS parseability</h2>
                                            <p className="text-sm font-semibold capitalize text-violet-700">{data?.parseability?.status || "Not assessed"}</p>
                                            <ul className="mt-3 space-y-2 text-sm text-slate-600">
                                                {(data?.parseability?.reasons ?? []).map((reason: string, i: number) => <li key={i}>{reason}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5">
                                        <h2 className="mb-3 text-lg font-semibold text-slate-900">
                                            Issues
                                        </h2>

                                        <div className="flex flex-col gap-1 max-h-[500px] overflow-x-hidden overflow-y-auto">
                                            {data?.issues?.map(
                                                (
                                                    item: Record<
                                                        string,
                                                        string
                                                    >,
                                                    i: string
                                                ) => (
                                                    <div
                                                        key={i}
                                                        className="w-full rounded-xl border border-rose-100 bg-white p-4"
                                                    >
                                                        <p className="text-base text-black">
                                                            {" "}
                                                            <span className="font-bold">
                                                                Severity:
                                                            </span>{" "}
                                                            {item.severity}
                                                        </p>
                                                        <p className="text-base text-black">
                                                            <span className="font-bold">
                                                                Issue:{" "}
                                                            </span>

                                                            {item.message}
                                                        </p>
                                                        <p className="text-base text-black">
                                                            <span className="font-bold">
                                                                Section:
                                                            </span>{" "}
                                                            {item.section}
                                                        </p>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                    <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5">
                                        <h2 className="mb-3 text-lg font-semibold text-slate-900">
                                            Suggestions
                                        </h2>

                                        <div className="flex flex-col gap-1 max-h-[500px] overflow-x-hidden overflow-y-auto">
                                            {data?.suggestions?.map(
                                                (
                                                    item: Record<
                                                        string,
                                                        string
                                                    >,
                                                    i: string
                                                ) => (
                                                    <div
                                                        key={i}
                                                        className="w-full rounded-xl border border-blue-100 bg-white p-4"
                                                    >
                                                        <p className="text-base text-black">
                                                            {" "}
                                                            <span className="font-bold">
                                                                Section:
                                                            </span>{" "}
                                                            {item.section}
                                                        </p>
                                                        <p className="text-base text-black">
                                                            <span className="font-bold">
                                                                Rewrite Example:{" "}
                                                            </span>

                                                            {
                                                                item.rewriteExample
                                                            }
                                                        </p>
                                                        <p className="text-base text-black">
                                                            <span className="font-bold">
                                                                Rationale:
                                                            </span>{" "}
                                                            {item.rationale}
                                                        </p>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </ContainerWrapper>
    );
};

export default Page;
