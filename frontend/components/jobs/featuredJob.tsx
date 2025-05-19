import ContainerWrapper from "../common/containerWrapper";
import SectionHeading from "../common/sectionHeading";
import { Button } from "../ui/button";
import FeaturedJobCard from "./featuredJobCard";

const FeaturedJob = () => {
    return (
        <div className="bg-primary/5">
            <ContainerWrapper>
                <div className="py-24">
                    <SectionHeading
                        title="Featured Jobs"
                        subHeading="Know your worth and find the job that qualify your life"
                    />

                    <div className="grid grid-cols-2 gap-5">
                        {[...Array(4)].map((item, i) => (
                            <FeaturedJobCard key={i} />
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <Button>Load More Jobs</Button>
                    </div>
                </div>
            </ContainerWrapper>
        </div>
    );
};

export default FeaturedJob;
