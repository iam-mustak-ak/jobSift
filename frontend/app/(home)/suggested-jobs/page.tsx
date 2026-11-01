/* eslint-disable @typescript-eslint/no-explicit-any */
import ContainerWrapper from "@/components/common/containerWrapper";
import FeaturedJobCard from "@/components/jobs/featuredJobCard";
import { fetcherSever } from "@/utils/fetcherSever";
import WorkspacePageHeading from "@/components/common/workspacePageHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Search } from "lucide-react";
import Link from "next/link";

const Page = async () => {
    const jobs = await fetcherSever(`/match-job`);
    const matches = Array.isArray(jobs?.data)
        ? jobs.data.filter((item: Record<string, any>) => item.isActive)
        : [];

    return (
        <>
            <ContainerWrapper>
                <div className="mx-auto max-w-6xl space-y-6 py-10 sm:py-12">
                    <WorkspacePageHeading
                        title="Suggested for you"
                        description="Roles matched to your profile, skills, and preferences."
                        icon={<Sparkles className="h-5 w-5" />}
                    />
                    {matches.length ? (
                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                            {matches.map((item: Record<string, any>) => (
                                <FeaturedJobCard
                                    featuredJobs={item}
                                    key={item._id}
                                    isSuggested={true}
                                />
                            ))}
                        </div>
                    ) : (
                        <Card className="rounded-3xl border-dashed border-slate-300 bg-white shadow-sm">
                            <CardContent className="flex flex-col items-center px-6 py-14 text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-700"><Sparkles className="h-6 w-6" /></div>
                                <h2 className="mt-5 text-lg font-semibold text-slate-900">Your next match is on its way</h2>
                                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">Add skills and preferences to your profile, or explore all current roles while we look for a fit.</p>
                                <Button asChild className="mt-5 rounded-xl bg-violet-700 hover:bg-violet-800">
                                    <Link href="/find-jobs"><Search className="mr-2 h-4 w-4" />Explore all jobs</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </ContainerWrapper>
        </>
    );
};

export default Page;
