"use client";
import ContainerWrapper from "@/components/common/containerWrapper";
import WorkspacePageHeading from "@/components/common/workspacePageHeading";
import CreateResumeBtn from "@/components/resume/createResumeBtn";
import { Button } from "@/components/ui/button";
import ResumeCardSkeleton from "@/lib/loaders/resumeLoader";
import { ResumeDataTypes } from "@/state/store";
import { fetcherClient } from "@/utils/fetcherClient";
import { FileText, Loader2, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
// export const dynamic = "force-static";

const Page = () => {
    const [data, setData] = useState<Record<string, any>>();
    const [loading, setLoading] = useState<boolean>(false);
    const [deleteLoader, setDeleteLoader] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        const fetchResume = async () => {
            const resume = await fetcherClient(`/resume/get-all-resume`);

            if (resume.success) {
                setData(resume);
                setLoading(false);
            }
        };

        fetchResume();
    }, []);

    const handleDeleteResume = async (resumeId: string) => {
        // setLoading(true);
        setDeleteLoader(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/resume/delete-resume/${resumeId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                }
            );

            if (!res.ok) {
                toast.error("error");
            }

            const newData = data?.data.filter(
                (dataItem: ResumeDataTypes & { _id: string }) =>
                    dataItem._id !== resumeId
            );
            setData({ data: newData });

            toast.success("Deleted");
        } catch (error) {
            toast.error("Error While Deleting");
        } finally {
            // setLoading(false);
            setDeleteLoader(false);
        }
    };

    return (
        <>
            <ContainerWrapper>
                <div className="mx-auto min-h-[calc(100vh-8rem)] max-w-6xl space-y-7 py-8 sm:py-12">
                    <WorkspacePageHeading
                        title="Resume builder"
                        description="Create a polished resume and tailor it to the roles you want."
                        icon={<FileText className="h-5 w-5" />}
                    />

                    <section className="space-y-4">
                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">Your resumes</h2>
                                <p className="mt-1 text-sm text-slate-500">Pick up where you left off or start a new one.</p>
                            </div>
                            {data?.data?.length > 0 && <span className="text-sm text-slate-400">{data.data.length} saved</span>}
                        </div>

                        {loading ? (
                            <ResumeCardSkeleton />
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                <CreateResumeBtn />
                                {data?.data?.map((item: Record<string, any>) => (
                                    <div key={item._id} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-5 top-5 z-10 h-9 w-9 rounded-xl bg-white/95 text-slate-400 shadow-sm hover:bg-red-50 hover:text-red-600"
                                            onClick={() => handleDeleteResume(item._id)}
                                            disabled={deleteLoader}
                                            aria-label="Delete resume"
                                        >
                                            {deleteLoader ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
                                        </Button>
                                        <Link href={`/build-resume/${item._id}/edit`} className="block">
                                            <div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-violet-50 to-slate-100 p-3">
                                                <Image
                                                    src="https://placehold.co/200x300/png?text=Resume&font=roboto"
                                                    width={200}
                                                    height={300}
                                                    alt="Resume preview"
                                                    className="h-full w-full rounded-md object-cover shadow-sm transition group-hover:scale-[1.02]"
                                                />
                                            </div>
                                            <p className="mt-3 truncate px-1 text-sm font-semibold text-slate-900">{item.resumeName || "Untitled resume"}</p>
                                            <p className="mt-1 px-1 text-xs text-slate-400">Open to continue editing</p>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </ContainerWrapper>
        </>
    );
};

export default Page;
