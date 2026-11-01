/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AtsChart from "@/components/common/atsChart";
import ContainerWrapper from "@/components/common/containerWrapper";
import WorkspacePageHeading from "@/components/common/workspacePageHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChartNoAxesCombined, Clipboard, FileUpIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = () => {
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
        setLoading(true);
        try {
            e.preventDefault();
            if (!file) return;
            const fd = new FormData();
            fd.append("file", file);
            fd.append("jobDescription", jd);
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/analyze`,
                { method: "POST", body: fd }
            );
            const json = await res.json();
            setResult(json);
        } catch (err) {
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
    console.log(data?.sectionQuality);

    return (
        <ContainerWrapper>
            <div className="mx-auto min-h-[calc(100vh-8rem)] max-w-6xl space-y-7 pb-12 pt-16 sm:pt-20">
                <WorkspacePageHeading
                    title={result?.success ? "Resume insights" : "Analyze your resume"}
                    description="Compare your resume with a job description and find practical ways to improve your match."
                    icon={<ChartNoAxesCombined className="h-5 w-5" />}
                />
                <div className="flex w-full flex-col items-start justify-center gap-8">
                    {loading ? (
                        <div className="flex min-h-72 w-full flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white text-center shadow-sm">
                            <Image src="/file-loader.gif" alt="Analyzing resume" width={180} height={180} />
                            <p className="mt-2 text-sm font-semibold text-slate-800">Reviewing your resume</p>
                            <p className="mt-1 text-xs text-slate-500">Comparing skills, keywords, and overall structure…</p>
                        </div>
                    ) : (
                        <>
                            {result ? (
                                <iframe
                                    title="PDF preview"
                                    src={url as string}
                                    className="sticky top-20 mt-4 h-[70vh] w-full rounded-2xl border border-slate-200 bg-white shadow-sm"
                                />
                            ) : (
                                <div className="grid min-h-[500px] w-full grid-cols-1 items-stretch justify-center gap-5 lg:grid-cols-2">
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
                                            disabled={loading || !file || !jd}
                                            onClick={onSubmit}
                                        >
                                            Analyze
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {result && (
                                <div className="flex flex-col gap-4 w-full">
                                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                            <h2 className="mb-3 text-lg font-semibold text-slate-900">
                                                Ats Score
                                            </h2>
                                            <AtsChart
                                                atsScore={data?.atsScore}
                                            />
                                        </div>
                                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                            <h2 className="mb-3 text-lg font-semibold text-slate-900">
                                                Missing Keywords
                                            </h2>
                                            <ul className="max-h-[360px] space-y-2 overflow-y-auto text-sm text-slate-600">
                                                {data?.keywordCoverage?.missingKeywords.map(
                                                    (
                                                        item: string,
                                                        i: number
                                                    ) => (
                                                        <li key={i}>{item}</li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                            <h2 className="mb-3 text-lg font-semibold text-slate-900">
                                                Missing Skills
                                            </h2>
                                            <ul className="max-h-[360px] space-y-2 overflow-y-auto text-sm text-slate-600">
                                                {data?.missingSkills.map(
                                                    (
                                                        item: string,
                                                        i: number
                                                    ) => (
                                                        <li key={i}>{item}</li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
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
