/* eslint-disable @typescript-eslint/no-explicit-any */
import CustomPagination from "@/components/common/customPagination";
import FeaturedJobCard from "@/components/jobs/featuredJobCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetcherSever } from "@/utils/fetcherSever";

type SearchParamsProps = {
    page: string;
    title?: string;
    location?: string;
    jobCategory?: string;
    jobType?: string;
    experienceLevel?: string;
};

const Page = async ({
    searchParams,
    params,
}: {
    searchParams: Promise<SearchParamsProps>;
    params: Promise<{ profileId: string }>;
}) => {
    const sParams = await searchParams;
    const { profileId } = await params;
    const {
        page: currentPage,
        title,
        location,
        jobCategory,
        jobType,
        experienceLevel,
    } = sParams;

    const queryParams = new URLSearchParams({
        limit: "8",
        page: currentPage || "1",
        ...(title ? { title } : {}),
        ...(location ? { location } : {}),
        ...(jobCategory ? { jobCategory } : {}),
        ...(jobType ? { jobType } : {}),
        ...(experienceLevel ? { experienceLevel } : {}),
    }).toString();

    const [jobs] = await Promise.all([
        fetcherSever(`/job/recruiter/${profileId}?${queryParams}`),
    ]);

    // Further categorize them
    const publishedJobs = jobs?.data.filter(
        (job: any) => job.isPublished === true && !job.isDraft
    );
    const pendingJobs = jobs?.data.filter(
        (job: any) => job.isPublished === false && !job.isDraft
    );
    const draftJobs = jobs?.data.filter((job: any) => job.isDraft === true);

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
                            publishedJobs.map((item: any) => (
                                <FeaturedJobCard
                                    featuredJobs={item}
                                    key={item._id}
                                />
                            ))
                        ) : (
                            <p className="text-left text-xl">
                                No published jobs found!
                            </p>
                        )}
                    </div>

                    {publishedJobs?.length > 0 && (
                        <CustomPagination
                            currentPage={parseInt(currentPage)}
                            totalPages={jobs.pagination.totalPages}
                            uri={`/profile/${profileId}/my-jobs`}
                        />
                    )}
                </TabsContent>

                {/* DRAFT */}
                <TabsContent value="draft">
                    <div className="grid grid-cols-2 gap-5">
                        {draftJobs?.length > 0 ? (
                            draftJobs.map((item: any) => (
                                <FeaturedJobCard
                                    featuredJobs={item}
                                    key={item._id}
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
                            pendingJobs.map((item: any) => (
                                <FeaturedJobCard
                                    featuredJobs={item}
                                    key={item._id}
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
