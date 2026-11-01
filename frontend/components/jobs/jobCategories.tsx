/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetcherSever } from "@/utils/fetcherSever";
import ContainerWrapper from "../common/containerWrapper";
import SectionHeading from "../common/sectionHeading";
import JobCategoryCard from "./jobCategoryCard";

const JobCategories = async () => {
    const categoryData = await fetcherSever(`/job-category/get-all-categories`);
    const categories = categoryData?.data || [];

    return (
        <section className="relative overflow-hidden bg-white">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-200 to-transparent"
            />
            <ContainerWrapper>
                <div className="py-20 md:py-24">
                    <SectionHeading
                        title="Explore by category"
                        subHeading="Find opportunities in the fields where you want to grow."
                        tone="light"
                    />

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        </section>
    );
};

export default JobCategories;
