/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CustomPagination from "@/components/common/customPagination";
import FeaturedJobCard from "@/components/jobs/featuredJobCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        <div className="flex w-full flex-col gap-6">
            <Tabs defaultValue="published">
                <TabsList>
                    <TabsTrigger value="published">Published</TabsTrigger>
                    <TabsTrigger value="draft">Draft</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                </TabsList>

                {/* PUBLISHED */}
                <TabsContent value="published">
                    <div className="grid grid-cols-2 gap-5">
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
                            <p className="text-left text-xl">
                                No published jobs found!
                            </p>
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
                    <div className="grid grid-cols-2 gap-5">
                        {draftJobs?.length > 0 ? (
                            draftJobs?.map((item: any) => (
                                <FeaturedJobCard
                                    featuredJobs={item}
                                    key={item._id}
                                    onDelete={handleDeleteJob}
                                />
                            ))
                        ) : (
                            <p className="text-left text-xl">
                                No draft jobs found!
                            </p>
                        )}
                    </div>
                </TabsContent>

                {/* PENDING */}
                <TabsContent value="pending">
                    <div className="grid grid-cols-2 gap-5">
                        {pendingJobs?.length > 0 ? (
                            pendingJobs?.map((item: any) => (
                                <FeaturedJobCard
                                    featuredJobs={item}
                                    key={item._id}
                                    onDelete={handleDeleteJob}
                                />
                            ))
                        ) : (
                            <p className="text-left text-xl">
                                No pending jobs found!
                            </p>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Page;
