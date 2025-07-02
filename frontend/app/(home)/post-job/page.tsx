import ContainerWrapper from "@/components/common/containerWrapper";
import JobPostForm from "@/components/common/jobPostForm";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { fetcherSever } from "@/utils/fetcherSever";

const Page = async () => {
    const allCategories = fetcherSever("/job-category/get-all-categories");
    const allSKills = fetcherSever("/skill/get-all-skills");
    const allCompnay = fetcherSever("/company/get-all-compnay");

    const [data1, data2, data3] = await Promise.all([
        allCategories,
        allSKills,
        allCompnay,
    ]);

    const categories = data1.data;
    const skills = data2.data;
    const company = data3.data;

    return (
        <>
            <div className="mt-16 pt-16 pb-12 bg-gradient-to-br from-transparent to-primary/20">
                <ContainerWrapper>
                    <div className="flex items-center justify-center flex-col max-w-4xl mx-auto">
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="text-6xl font-semibold capitalize">
                                Post a job
                            </h2>

                            <Breadcrumb className="mt-4">
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="/">
                                            Home
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>
                                            Post-job
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </div>
                </ContainerWrapper>
            </div>
            <ContainerWrapper>
                <JobPostForm
                    categories={categories}
                    skills={skills}
                    company={company}
                />
            </ContainerWrapper>
        </>
    );
};

export default Page;
