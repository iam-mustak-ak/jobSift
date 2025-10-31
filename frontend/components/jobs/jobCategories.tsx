/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetcherSever } from "@/utils/fetcherSever";
import ContainerWrapper from "../common/containerWrapper";
import SectionHeading from "../common/sectionHeading";
import JobCategoryCard from "./jobCategoryCard";

const JobCategories = async () => {
    const categoryData = await fetcherSever(`/job-category/get-all-categories`);
    const categories = categoryData?.data || [];

    return (
        <ContainerWrapper>
            <div className="pt-28 pb-12">
                <SectionHeading
                    title="Popular Job Categories"
                    subHeading="2020 jobs live - 293 added today."
                />

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories?.map((item: Record<string, any>) => (
                        <JobCategoryCard
                            key={item._id}
                            href={`/category/${item.name}/?page=1&id=${item._id}`}
                            title={item.name}
                        />
                    ))}
                </div>
            </div>
        </ContainerWrapper>
    );
};

export default JobCategories;
