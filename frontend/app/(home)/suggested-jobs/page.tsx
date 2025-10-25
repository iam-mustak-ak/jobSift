import SectionBanner from "@/components/common/sectionBanner";
import { fetcherSever } from "@/utils/fetcherSever";

const Page = async () => {
    const jobs = await fetcherSever(`/match-job`);

    console.log(jobs);

    return (
        <>
            <SectionBanner title="Suggested Jobs" />
            {/* <ContainerWrapper>
                <div className="pt-12 pb-12">
                    {jobs && jobs?.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 gap-5">
                                {jobs?.data.length > 0 ? (
                                    jobs?.data.map(
                                        (item: Record<string, any>) => (
                                            <FeaturedJobCard
                                                featuredJobs={item}
                                                key={item._id}
                                            />
                                        )
                                    )
                                ) : (
                                    <p className="text-left text-2xl">
                                        No jobs found!
                                    </p>
                                )}
                            </div>
                        </>
                    ) : (
                        <p className="text-left text-2xl">
                            No Matched Job Found!
                        </p>
                    )}
                </div>
            </ContainerWrapper> */}
        </>
    );
};

export default Page;
