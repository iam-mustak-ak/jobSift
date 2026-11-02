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
import { BriefcaseBusiness, CheckCircle2, Sparkles } from "lucide-react";

const Page = async () => {
    const allCategories = fetcherSever("/job-category/get-all-categories");
    const allSKills = fetcherSever("/skill/get-all-skills");
    const allCompnay = fetcherSever("/company/get-all-compnay");

    const [data1, data2, data3] = await Promise.all([
        allCategories,
        allSKills,
        allCompnay,
    ]);

    const categories = Array.isArray(data1?.data) ? data1.data : [];
    const skills = Array.isArray(data2?.data) ? data2.data : [];
    const company = Array.isArray(data3?.data) ? data3.data : [];

    return (
        <main className="min-h-screen bg-slate-50/70 pb-16">
            <section className="relative overflow-hidden border-b border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50 pb-10 pt-24 sm:pt-28">
                <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />
                <ContainerWrapper>
                    <div className="relative mx-auto max-w-6xl">
                        <Breadcrumb>
                            <BreadcrumbList className="text-slate-500">
                                <BreadcrumbItem><BreadcrumbLink href="/" className="hover:text-violet-700">Home</BreadcrumbLink></BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem><BreadcrumbPage>Post a job</BreadcrumbPage></BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <div className="mt-7 grid gap-7 md:grid-cols-[minmax(0,1fr)_320px] md:items-end">
                            <div>
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-3 py-1.5 text-xs font-semibold text-violet-700 shadow-sm">
                                    <Sparkles className="h-3.5 w-3.5" /> Recruiter workspace
                                </div>
                                <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">Find the right person<br className="hidden sm:block" /> for your next role.</h1>
                                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">Share a clear opportunity with candidates who have the skills you need. You can save a draft and finish it whenever you’re ready.</p>
                            </div>
                            <div className="rounded-2xl border border-white bg-white/85 p-4 shadow-sm backdrop-blur">
                                <p className="flex items-center gap-2 text-sm font-semibold text-slate-900"><BriefcaseBusiness className="h-4 w-4 text-violet-700" /> A strong post includes</p>
                                <ul className="mt-3 space-y-2 text-xs leading-5 text-slate-600">
                                    {["A clear title and work arrangement", "Specific responsibilities and expectations", "Skills, location, and application deadline"].map((item) => <li key={item} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />{item}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                </ContainerWrapper>
            </section>
            <ContainerWrapper>
                <JobPostForm categories={categories} skills={skills} company={company} />
            </ContainerWrapper>
        </main>
    );
};

export default Page;
