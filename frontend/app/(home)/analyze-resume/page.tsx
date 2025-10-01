"use client";

import AtsChart from "@/components/common/atsChart";
import ContainerWrapper from "@/components/common/containerWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const Page = () => {
    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

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

    const data = result?.data;
    console.log(Object.entries(data.sectionQuality));

    return (
        <ContainerWrapper>
            <div className="mt-6 pt-16 pb-12 min-h-screen">
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
                                    className="mt-4 w-full h-[80vh] border"
                                />
                            ) : (
                                <div className="max-w-1/2 w-full">
                                    <Label
                                        htmlFor="pdf-file"
                                        className="w-full h-[400px] bg-gray-100 rounded-2xl p-5 cursor-pointer flex flex-col items-center justify-center group border border-gray-200"
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
                                                    e.target.files?.[0] ?? null
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
                                    {file && (
                                        <Button
                                            className="text-center mt-5"
                                            disabled={loading}
                                            onClick={onSubmit}
                                        >
                                            Analyze
                                        </Button>
                                    )}
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
                                                {Object.entries(
                                                    data?.sectionQuality
                                                ).map(
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
                                            {data?.issues.map(
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
                                            {data?.suggestions.map(
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
