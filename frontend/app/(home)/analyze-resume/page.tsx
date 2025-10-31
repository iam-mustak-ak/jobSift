/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AtsChart from "@/components/common/atsChart";
import ContainerWrapper from "@/components/common/containerWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clipboard, FileUpIcon } from "lucide-react";
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
            <div className="mt-6 pt-16 pb-12 min-h-screen flex w-full flex-col items-stretch  justify-center">
                <div className="mb-10">
                    <h2 className="text-2xl font-semibold text-center capitalize">
                        {result?.success
                            ? "Analytical Result"
                            : "Analyze Resume"}
                    </h2>
                </div>
                <div className="flex items-start justify-center gap-12">
                    {loading ? (
                        <Image
                            src="/file-loader.gif"
                            alt="gif"
                            width={400}
                            height={400}
                        />
                    ) : (
                        <>
                            {result ? (
                                <iframe
                                    title="PDF preview"
                                    src={url as string}
                                    className="mt-4 w-full h-[80vh] border sticky top-20"
                                />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 items-stretch gap-4 w-full justify-center min-h-[500px]">
                                    <div className="h-full">
                                        <Label
                                            htmlFor="description"
                                            className="mb-3"
                                        >
                                            Job Description
                                        </Label>
                                        <div className="w-full h-full border rounded-md relative">
                                            <textarea
                                                placeholder="Enter description"
                                                className="w-full h-full p-3 max-h-[500px] overflow-y-auto"
                                                value={jd}
                                                onChange={(e) =>
                                                    setJd(e.target.value)
                                                }
                                            ></textarea>
                                            <Button
                                                className="rounded-full absolute right-2 bottom-2 cursor-pointer"
                                                variant={"outline"}
                                                onClick={handleClipboard}
                                                title="Paste Job Description"
                                            >
                                                <Clipboard />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className=" w-full h-full">
                                        <Label className="mb-3">
                                            Upload Resume
                                        </Label>
                                        <Label
                                            htmlFor="pdf-file"
                                            className="w-full h-full bg-gray-100 rounded-2xl p-5 cursor-pointer flex flex-col items-center justify-center group border border-gray-200"
                                        >
                                            <Input
                                                type="file"
                                                className="h-full w-full"
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
                                                width={150}
                                                height={150}
                                                className="opacity-15 group-hover:opacity-25"
                                            />
                                            <p>Click to upload resume</p>
                                        </Label>
                                        <p className="mt-3 text-2xl">
                                            {file?.name}
                                        </p>
                                        <Button
                                            className="text-center mt-5"
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
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="bg-amber-50 rounded-2xl border border-gray-200 p-5">
                                            <h2 className="text-2xl md:text-3xl font-semibold mb-2">
                                                Ats Score
                                            </h2>
                                            <AtsChart
                                                atsScore={data?.atsScore}
                                            />
                                        </div>
                                        <div className="bg-amber-50 rounded-2xl border border-gray-200 p-5">
                                            <h2 className="text-2xl md:text-3xl font-semibold mb-2">
                                                Missing Keywords
                                            </h2>
                                            <ul className="list-disc pl-5 columns-2 gap-5 max-h-[500px] overflow-x-hidden overflow-y-auto">
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
                                        <div className="bg-amber-50 rounded-2xl border border-gray-200 p-5">
                                            <h2 className="text-2xl md:text-3xl font-semibold mb-2">
                                                Missing Skills
                                            </h2>
                                            <ul className="list-disc pl-5 columns-2 gap-5 max-h-[500px] overflow-x-hidden overflow-y-auto">
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
                                        <div className="bg-amber-50 rounded-2xl border border-gray-200 p-5">
                                            <h2 className="text-2xl md:text-3xl font-semibold mb-2">
                                                Overall Quality
                                            </h2>
                                            <ul className="list-disc pl-5 columns-2 gap-5 max-h-[500px] overflow-x-hidden overflow-y-auto">
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
                                    <div className="bg-red-200 rounded-2xl border border-gray-200 p-5">
                                        <h2 className="text-2xl md:text-3xl font-semibold mb-2">
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
                                                        className="rounded-lg bg-red-50 border border-gray-200 p-3 w-full "
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
                                    <div className="bg-blue-200 rounded-2xl border border-gray-200 p-5">
                                        <h2 className="text-2xl md:text-3xl font-semibold mb-2">
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
                                                        className="rounded-lg bg-blue-50 border border-gray-200 p-3 w-full "
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
