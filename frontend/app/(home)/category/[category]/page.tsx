import ContainerWrapper from "@/components/common/containerWrapper";
import CustomPagination from "@/components/common/customPagination";
import CustomSelect from "@/components/common/customSelect";
import SectionBanner from "@/components/common/sectionBanner";
import FeaturedJobCard from "@/components/jobs/featuredJobCard";
import { fetcherSever } from "@/utils/fetcherSever";

const Page = async ({
    params,
    searchParams,
}: {
    params: Promise<{ category: string }>;
    searchParams: Promise<{ id: string; page: string }>;
}) => {
    const { category } = await params;
    const { id, page: currentPage } = await searchParams;

    const queryParams = new URLSearchParams({
        jobCategory: id,
        page: currentPage || "1",
    }).toString();
    const jobsData = await fetcherSever(`/job/get-all-jobs/?${queryParams}`);
    const jobs = jobsData.data;

    const itemsPerPage = 8;
    const totalItems = jobsData.pagination?.total || 0;
    const page = parseInt(currentPage) || 1;
    const startItem = totalItems === 0 ? 0 : (page - 1) * itemsPerPage + 1;
    const endItem = Math.min(page * itemsPerPage, totalItems);
    const showingText = `Showing ${startItem}-${endItem} of ${totalItems} jobs`;

    return (
        <>
            <SectionBanner title={category} />
            <ContainerWrapper>
                <div className="pt-12 pb-12">
                    <div className="flex items-center justify-between mb-12">
                        <p className="text-muted-foreground">
                            {" "}
                            <span className="font-semibold text-secondary-foreground">
                                {showingText}
                            </span>{" "}
                        </p>

                        <form action="">
                            <CustomSelect
                                name="Sortby"
                                placeholder="Sort by (default)"
                            />
                        </form>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        {jobsData.data?.length > 0 ? (
                            jobsData.data?.map((item: Record<string, any>) => (
                                <FeaturedJobCard
                                    featuredJobs={item}
                                    key={item._id}
                                />
                            ))
                        ) : (
                            <p className="text-left text-2xl">
                                No jobs Found !
                            </p>
                        )}
                    </div>

                    {jobs?.length > 0 && (
                        <CustomPagination
                            currentPage={parseInt(currentPage)}
                            totalPages={jobsData.pagination.totalPages}
                            uri={`/category/${category}`}
                        />
                    )}
                </div>
            </ContainerWrapper>
        </>
    );
};

export default Page;
