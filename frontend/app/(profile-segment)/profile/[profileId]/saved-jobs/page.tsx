/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import FeaturedJobCard from "@/components/jobs/featuredJobCard";
import WorkspacePageHeading from "@/components/common/workspacePageHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/state/store";
import { Bookmark, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = () => {
    const { user } = useAuthStore((state) => state);
    const [savedJobs, setSavedJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSavedJobs = async () => {
            if (!user?.savedJobs?.length) return;

            setLoading(true);
            try {
                // Fetch all jobs in parallel
                const jobs = await Promise.all(
                    user.savedJobs?.map(async (item: any) => {
                        const res = await fetch(
                            `${process.env.NEXT_PUBLIC_SERVER_URL}/job/get-job/${item.jobId}`,
                            {
                                credentials: "include",
                            }
                        );
                        if (!res.ok) {
                            return toast.error("Somthing Went wrong");
                        }
                        return res.json().then((data) => data.data);
                    })
                );

                setSavedJobs(jobs);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedJobs();
    }, [user]);

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6 pb-10">
            <WorkspacePageHeading
                title="Saved jobs"
                description="Keep promising opportunities close and come back to them when you’re ready."
                icon={<Bookmark className="h-5 w-5" />}
            />
            {loading ? (
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Card key={index} className="animate-pulse rounded-2xl border-slate-200">
                            <CardContent className="space-y-3 p-5">
                                <div className="h-5 w-2/3 rounded bg-slate-100" />
                                <div className="h-4 w-1/2 rounded bg-slate-100" />
                                <div className="h-16 rounded-xl bg-slate-50" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : savedJobs.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    {savedJobs.filter(Boolean).map((job) => (
                        <FeaturedJobCard featuredJobs={job} key={job?._id} />
                    ))}
                </div>
            ) : (
                <Card className="rounded-3xl border-dashed border-slate-300 bg-white shadow-sm">
                    <CardContent className="flex flex-col items-center px-6 py-14 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-700"><Bookmark className="h-6 w-6" /></div>
                        <h2 className="mt-5 text-lg font-semibold text-slate-900">No saved jobs yet</h2>
                        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">Save roles that catch your eye and they’ll be collected here for an easy next look.</p>
                        <Button asChild className="mt-5 rounded-xl bg-violet-700 hover:bg-violet-800">
                            <Link href="/find-jobs"><Search className="mr-2 h-4 w-4" />Explore jobs</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default Page;
