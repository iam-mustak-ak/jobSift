/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CustomPagination from "@/components/common/customPagination";
import WorkspacePageHeading from "@/components/common/workspacePageHeading";
import FeaturedJobCard from "@/components/jobs/featuredJobCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BriefcaseBusiness, Clock3, FilePenLine, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { fetcherClient } from "@/utils/fetcherClient";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type SearchParamsProps = {
    page: string;
    title?: string;
    location?: string;
    jobCategory?: string;
    jobType?: string;
    experienceLevel?: string;
};

const Page = () => {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();

    const profileId = params?.profileId || "";
    const currentPage = searchParams.get("page") || "1";
    const title = searchParams.get("title") || "";
    const location = searchParams.get("location") || "";
    const jobCategory = searchParams.get("jobCategory") || "";
    const jobType = searchParams.get("jobType") || "";
    const experienceLevel = searchParams.get("experienceLevel") || "";

    const [jobList, setJobList] = useState<any[]>([]);
    const [pagination, setPagination] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                limit: "8",
                page: currentPage,
                ...(title ? { title } : {}),
                ...(location ? { location } : {}),
                ...(jobCategory ? { jobCategory } : {}),
                ...(jobType ? { jobType } : {}),
                ...(experienceLevel ? { experienceLevel } : {}),
            }).toString();

            const jobs = await fetcherClient(
                `/job/recruiter/${profileId}?${queryParams}`
            );

            setJobList(jobs?.data || []);
            setPagination(jobs?.pagination || null);
        } catch (err) {
            console.error("Failed to fetch jobs", err);
            toast.error("Failed to fetch jobs");
        } finally {
            setLoading(false);
        }
    }, [
        currentPage,
        experienceLevel,
        jobCategory,
        jobType,
        location,
        profileId,
        title,
    ]);

    useEffect(() => {
        if (profileId) fetchJobs();
    }, [
        profileId,
        currentPage,
        title,
        location,
        jobCategory,
        jobType,
        experienceLevel,
        fetchJobs,
    ]);

    const handleDeleteJob = async (id: string) => {
        setJobList((prev) => prev.filter((job) => job._id !== id));
        toast.success("Job deleted successfully");
    };

    // Categorize jobs
    const publishedJobs =
        jobList?.filter(
            (job: any) => job.isPublished === true && !job.isDraft
        ) || [];
    const pendingJobs =
        jobList?.filter(
            (job: any) => job.isPublished === false && !job.isDraft
        ) || [];
    const draftJobs = jobList?.filter((job: any) => job.isDraft === true) || [];

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-10">
            <WorkspacePageHeading
                title="My job posts"
                description="Manage published roles, drafts, and jobs awaiting review."
                icon={<BriefcaseBusiness className="h-5 w-5" />}
                action={(
                    <Button asChild className="h-10 shrink-0 rounded-xl bg-violet-700 px-4 font-semibold hover:bg-violet-800">
                        <Link href="/post-job"><Plus className="mr-2 h-4 w-4" />Post a job</Link>
                    </Button>
                )}
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4"><p className="text-xs font-medium text-emerald-700">Published</p><p className="mt-1 text-2xl font-bold text-slate-900">{publishedJobs.length}</p></div>
                <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4"><p className="text-xs font-medium text-amber-700">Drafts</p><p className="mt-1 text-2xl font-bold text-slate-900">{draftJobs.length}</p></div>
                <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4"><p className="text-xs font-medium text-blue-700">In review</p><p className="mt-1 text-2xl font-bold text-slate-900">{pendingJobs.length}</p></div>
            </div>
            <Tabs defaultValue="published" className="w-full">
                <TabsList className="h-auto w-full justify-start gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 sm:w-fit">
                    <TabsTrigger className="rounded-xl px-4 py-2" value="published">Published <span className="ml-2 text-xs text-slate-400">{publishedJobs.length}</span></TabsTrigger>
                    <TabsTrigger className="rounded-xl px-4 py-2" value="draft">Drafts <span className="ml-2 text-xs text-slate-400">{draftJobs.length}</span></TabsTrigger>
                    <TabsTrigger className="rounded-xl px-4 py-2" value="pending">In review <span className="ml-2 text-xs text-slate-400">{pendingJobs.length}</span></TabsTrigger>
                </TabsList>

                {/* PUBLISHED */}
                <TabsContent value="published">
                    <div className="grid grid-cols-1 gap-4 pt-4 xl:grid-cols-2">
                        {publishedJobs?.length > 0 ? (
                            publishedJobs?.map((item: any) => (
                                <FeaturedJobCard
                                    featuredJobs={item}
                                    key={item._id}
                                    isRecuiter={true}
                                    onDelete={handleDeleteJob}
                                />
                            ))
                        ) : (
                            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center"><BriefcaseBusiness className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 font-semibold text-slate-800">No published jobs yet</p><p className="mt-1 text-sm text-slate-500">Post a role when you’re ready to start meeting candidates.</p></div>
                        )}
                    </div>

                    {publishedJobs?.length > 0 && pagination && (
                        <CustomPagination
                            currentPage={parseInt(currentPage)}
                            totalPages={pagination.totalPages}
                            uri={`/profile/${profileId}/my-jobs`}
                        />
                    )}
                </TabsContent>

                {/* DRAFT */}
                <TabsContent value="draft">
                    <div className="grid grid-cols-1 gap-4 pt-4 xl:grid-cols-2">
                        {draftJobs?.length > 0 ? (
                            draftJobs?.map((item: any) => (
                                <FeaturedJobCard
                                    featuredJobs={item}
                                    key={item._id}
                                    onDelete={handleDeleteJob}
                                />
                            ))
                        ) : (
                            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center"><FilePenLine className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 font-semibold text-slate-800">No drafts to finish</p><p className="mt-1 text-sm text-slate-500">Unpublished roles you save will appear here.</p></div>
                        )}
                    </div>
                </TabsContent>

                {/* PENDING */}
                <TabsContent value="pending">
                    <div className="grid grid-cols-1 gap-4 pt-4 xl:grid-cols-2">
                        {pendingJobs?.length > 0 ? (
                            pendingJobs?.map((item: any) => (
                                <FeaturedJobCard
                                    featuredJobs={item}
                                    key={item._id}
                                    onDelete={handleDeleteJob}
                                />
                            ))
                        ) : (
                            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center"><Clock3 className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 font-semibold text-slate-800">Nothing under review</p><p className="mt-1 text-sm text-slate-500">Submitted jobs will show here while they’re being reviewed.</p></div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Page;
