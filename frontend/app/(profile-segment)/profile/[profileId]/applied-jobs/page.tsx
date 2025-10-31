/* eslint-disable @typescript-eslint/no-explicit-any */
import FeaturedJobCard from "@/components/jobs/featuredJobCard";
import { fetcherSever } from "@/utils/fetcherSever";

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
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">
                Applied Jobs ({jobs.length})
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs?.map((job: any) => (
                    <FeaturedJobCard featuredJobs={job} key={job._id} />
                ))}
            </div>
        </div>
    );
};

export default Page;
