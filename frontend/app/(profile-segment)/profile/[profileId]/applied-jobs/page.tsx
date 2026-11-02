import CandidateApplicationCard from "@/components/jobs/candidateApplicationCard";
import WorkspacePageHeading from "@/components/common/workspacePageHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetcherSever } from "@/utils/fetcherSever";
import { BriefcaseBusiness, Clock3, Search, Sparkles } from "lucide-react";
import Link from "next/link";

type TrackedApplication = {
    _id: string;
    title: string;
    application?: { status?: string };
};

const Page = async () => {
    const response = await fetcherSever("/job/my-applications");
    const applications: TrackedApplication[] = Array.isArray(response?.data) ? response.data : [];
    const inProgress = applications.filter((job) => !["hired", "rejected"].includes(job.application?.status ?? "applied")).length;
    const interviews = applications.filter((job) => job.application?.status === "interview").length;
    const offers = applications.filter((job) => ["offered", "hired"].includes(job.application?.status ?? "")).length;

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6 pb-10">
            <WorkspacePageHeading
                title="Application tracker"
                description="See where each application stands and follow updates from hiring teams."
                icon={<BriefcaseBusiness className="h-5 w-5" />}
            />

            {applications.length > 0 ? <>
                <section className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs font-medium text-slate-500">Applications</p><p className="mt-1 text-2xl font-bold text-slate-950">{applications.length}</p></div>
                    <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4"><p className="flex items-center gap-1.5 text-xs font-medium text-blue-700"><Clock3 className="h-3.5 w-3.5" />In progress</p><p className="mt-1 text-2xl font-bold text-slate-950">{inProgress}</p></div>
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4"><p className="flex items-center gap-1.5 text-xs font-medium text-emerald-700"><Sparkles className="h-3.5 w-3.5" />Interviews and offers</p><p className="mt-1 text-2xl font-bold text-slate-950">{interviews + offers}</p></div>
                </section>
                <section className="space-y-4" aria-label="Your job applications">
                    {applications.map((job: any) => <CandidateApplicationCard key={job._id} job={job} />)}
                </section>
            </> : (
                <Card className="rounded-3xl border-dashed border-slate-300 bg-white shadow-sm">
                    <CardContent className="flex flex-col items-center px-6 py-14 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-700"><BriefcaseBusiness className="h-6 w-6" /></div>
                        <h2 className="mt-5 text-lg font-semibold text-slate-900">No applications to track yet</h2>
                        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">When you apply for a role, you’ll see the hiring team’s updates and each next step here.</p>
                        <Button asChild className="mt-5 rounded-xl bg-violet-700 hover:bg-violet-800"><Link href="/find-jobs/?page=1"><Search className="mr-2 h-4 w-4" />Find a job</Link></Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default Page;
