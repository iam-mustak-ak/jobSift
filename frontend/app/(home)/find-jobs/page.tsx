import ContainerWrapper from "@/components/common/containerWrapper";
import CustomPagination from "@/components/common/customPagination";
import CustomSelect from "@/components/common/customSelect";
import SectionBanner from "@/components/common/sectionBanner";
import FeaturedJobCard from "@/components/jobs/featuredJobCard";
import { fetcherSever } from "@/utils/fetcherSever";

const Page = async ({
    searchParams,
}: {
    searchParams: Promise<{ page: string }>;
}) => {
    const { page: currentPage } = await searchParams;
    const jobs = await fetcherSever(
        `/job/get-all-jobs/?limit=8&page=${currentPage}`
    );

    console.log(jobs.pagination.totalPages);

    return (
        <>
            <SectionBanner />
            <ContainerWrapper>
                <div className="pt-12 pb-12">
                    <div className="flex items-center justify-between mb-12">
                        <p className="text-muted-foreground">
                            {" "}
                            <span className="font-semibold text-secondary-foreground">
                                {jobs.pagination?.total}
                            </span>{" "}
                            jobs available
                        </p>

                        <form action="">
                            <CustomSelect
                                name="Sortby"
                                placeholder="Sort by (default)"
                            />
                        </form>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        {jobs?.data.map((item: Record<string, any>) => (
                            <FeaturedJobCard
                                featuredJobs={item}
                                key={item._id}
                            />
                        ))}
                    </div>
                    <CustomPagination
                        currentPage={parseInt(currentPage)}
                        totalPages={jobs.pagination.totalPages}
                    />
                </div>
            </ContainerWrapper>
        </>
    );
};

export default Page;
