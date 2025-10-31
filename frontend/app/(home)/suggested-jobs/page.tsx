/* eslint-disable @typescript-eslint/no-explicit-any */
import ContainerWrapper from "@/components/common/containerWrapper";
import SectionBanner from "@/components/common/sectionBanner";
import FeaturedJobCard from "@/components/jobs/featuredJobCard";
import { fetcherSever } from "@/utils/fetcherSever";

const Page = async () => {
    const jobs = await fetcherSever(`/match-job`);

    return (
        <>
            <SectionBanner title="Suggested Jobs" />
            <ContainerWrapper>
                <div className="pt-12 pb-12">
                    {jobs && jobs?.data?.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 gap-5">
                                {jobs?.data.length > 0 ? (
                                    jobs?.data?.map(
                                        (item: Record<string, any>) =>
                                            item.isActive && (
                                                <FeaturedJobCard
                                                    featuredJobs={item}
                                                    key={item._id}
                                                    isSuggested={true}
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
            </ContainerWrapper>
        </>
    );
};

export default Page;
