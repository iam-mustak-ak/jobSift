import ContainerWrapper from "../common/containerWrapper";
import SectionHeading from "../common/sectionHeading";
import JobCategoryCard from "./jobCategoryCard";

const JobCategories = () => {
    return (
        <ContainerWrapper>
            <div className="pt-28 pb-12">
                <SectionHeading
                    title="Popular Job Categories"
                    subHeading="2020 jobs live - 293 added today."
                />

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(9)].map((item, i) => (
                        <JobCategoryCard
                            key={i}
                            href="/category/accounting"
                            title="Accounting / Finance"
                            subTitle="2"
                        />
                    ))}
                </div>
            </div>
        </ContainerWrapper>
    );
};

export default JobCategories;
