/* eslint-disable @typescript-eslint/no-explicit-any */
import FeaturedJobCard from "@/components/jobs/featuredJobCard";
import WorkspacePageHeading from "@/components/common/workspacePageHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetcherSever } from "@/utils/fetcherSever";
import { BriefcaseBusiness, Search } from "lucide-react";
import Link from "next/link";

type ProfileProps = {
    params: Promise<{ profileId: string }>;
};

const Page = async ({ params }: ProfileProps) => {
    const { profileId } = await params;

    const { data } = await fetcherSever(`/auth/me/${profileId}`);
    const appliedJobs = data?.appliedJobs || [];

    const jobPromises = appliedJobs?.map((item: any) =>
        fetcherSever(`/job/get-job/${item.jobId}`)
            .then((res) => ({
                ...res.data,
                dateApplied: item.dateApplied,
            }))
            .catch(() => null)
    );

    const jobs = (await Promise.all(jobPromises)).filter(Boolean);

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6 pb-10">
            <WorkspacePageHeading
                title="Applied jobs"
                description="Follow the opportunities you’ve applied to and keep your search organized."
                icon={<BriefcaseBusiness className="h-5 w-5" />}
            />
            {jobs.length ? (
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    {jobs.map((job: any) => (
                        <FeaturedJobCard featuredJobs={job} key={job._id} />
                    ))}
                </div>
            ) : (
                <Card className="rounded-3xl border-dashed border-slate-300 bg-white shadow-sm">
                    <CardContent className="flex flex-col items-center px-6 py-14 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><BriefcaseBusiness className="h-6 w-6" /></div>
                        <h2 className="mt-5 text-lg font-semibold text-slate-900">No applications to follow</h2>
                        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">When you apply for a role, you’ll find it here so you can keep track of your search.</p>
                        <Button asChild className="mt-5 rounded-xl bg-violet-700 hover:bg-violet-800">
                            <Link href="/find-jobs"><Search className="mr-2 h-4 w-4" />Find a job</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default Page;
