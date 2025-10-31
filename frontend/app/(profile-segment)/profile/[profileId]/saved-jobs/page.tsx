/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import FeaturedJobCard from "@/components/jobs/featuredJobCard";
import { useAuthStore } from "@/state/store";
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

    if (loading)
        return <p className="text-left text-xl">Loading saved jobs...</p>;

    return (
        <div className="grid grid-cols-2 gap-5">
            {savedJobs.length > 0 ? (
                savedJobs?.map((job) => (
                    <FeaturedJobCard featuredJobs={job} key={job?._id} />
                ))
            ) : (
                <p className="text-left text-xl">No saved jobs found!</p>
            )}
        </div>
    );
};

export default Page;
