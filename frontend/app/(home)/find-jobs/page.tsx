/* eslint-disable @typescript-eslint/no-explicit-any */
import ContainerWrapper from "@/components/common/containerWrapper";
import CustomPagination from "@/components/common/customPagination";
import SectionBanner from "@/components/common/sectionBanner";
import FeaturedJobCard from "@/components/jobs/featuredJobCard";
import { fetcherSever } from "@/utils/fetcherSever";

type searchParamsPros = {
    page: string;
    title?: string;
    location?: string;
    jobCategory?: string;
    jobType?: string;
    experienceLevel?: string;
};

const Page = async ({
    searchParams,
}: {
    searchParams: Promise<searchParamsPros>;
}) => {
    const params = await searchParams;
    const {
        page: currentPage,
        title,
        location,
        jobCategory,
        jobType,
        experienceLevel,
    } = params;

    const queryParams = new URLSearchParams({
        limit: "8",
        page: currentPage || "1",
        ...(title ? { title } : {}),
        ...(location ? { location } : {}),
        ...(jobCategory ? { jobCategory } : {}),
        ...(jobType ? { jobType } : {}),
        ...(experienceLevel ? { experienceLevel } : {}),
    }).toString();

    const jobs = await fetcherSever(`/job/get-all-jobs/?${queryParams}`);

    const itemsPerPage = 8;
    const totalItems = jobs.pagination?.total || 0;
    const page = parseInt(currentPage) || 1;
    const startItem = totalItems === 0 ? 0 : (page - 1) * itemsPerPage + 1;
    const endItem = Math.min(page * itemsPerPage, totalItems);
    const showingText = `Showing ${startItem}-${endItem} of ${totalItems} jobs`;
    return (
        <>
            <SectionBanner />
            <ContainerWrapper>
                <div className="pt-12 pb-12">
                    <div className="flex items-center justify-between mb-12">
                        <p className="text-muted-foreground">
                            {" "}
                            <span className="font-semibold text-secondary-foreground">
                                {showingText}
                            </span>{" "}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        {jobs?.data.length > 0 ? (
                            jobs?.data?.map((item: Record<string, any>) => (
                                <FeaturedJobCard
                                    featuredJobs={item}
                                    key={item._id}
                                />
                            ))
                        ) : (
                            <p className="text-left text-2xl">No job Found !</p>
                        )}
                    </div>

                    {jobs?.data.length > 0 && (
                        <CustomPagination
                            currentPage={parseInt(currentPage)}
                            totalPages={jobs.pagination.totalPages}
                            uri="/find-jobs"
                        />
                    )}
                </div>
            </ContainerWrapper>
        </>
    );
};

export default Page;
