/* eslint-disable @typescript-eslint/no-explicit-any */
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

type PageProps = {
    params: Promise<{ editJobId: string }>;
};

const Page = async ({ params }: PageProps) => {
    const editJobId = await params;

    const allCategories = fetcherSever("/job-category/get-all-categories");
    const allSkills = fetcherSever("/skill/get-all-skills");
    const allCompany = fetcherSever("/company/get-all-compnay");

    let jobData = null;
    if (editJobId.editJobId) {
        const res = await fetcherSever(`/job/get-job/${editJobId.editJobId}`);
        jobData = res.data;
    }

    const [data1, data2, data3] = await Promise.all([
        allCategories,
        allSkills,
        allCompany,
    ]);

    const categories = data1.data;
    const skills = data2.data;
    const company = data3.data;

    // Map jobData IDs to objects for the form
    if (jobData) {
        jobData.company =
            company.find((c: any) => c._id === jobData.company) || null;
        jobData.jobCategory = jobData.jobCategory?.map((catId: string) =>
            categories.find((c: any) => c._id === catId)
        );
        jobData.skillsRequired = jobData.skillsRequired?.map(
            (skillId: string) => skills.find((s: any) => s._id === skillId)
        );
    }

    return (
        <>
            <div className="mt-16 pt-16 pb-12 bg-gradient-to-br from-transparent to-primary/20">
                <ContainerWrapper>
                    <div className="flex items-center justify-center flex-col max-w-4xl mx-auto">
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="text-6xl font-semibold capitalize">
                                Edit Job
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
                                            Edit Job
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
                    jobData={jobData}
                />
            </ContainerWrapper>
        </>
    );
};

export default Page;
