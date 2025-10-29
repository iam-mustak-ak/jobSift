/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuthStore } from "@/state/store";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "../ui/button";

type buttonType = {
    job: {
        url?: string;
        recruiter?: string;
        isActive: boolean;
    };
    jobId: string;
};

const ApplyJobButton: React.FC<buttonType> = ({ job, jobId }) => {
    const { user } = useAuthStore((state) => state);

    const hasAlreadyApplied = user?.appliedJobs?.some(
        (appliedJob: any) => appliedJob.jobId === jobId
    );

    const handleOnClick = () => {
        if (!user) {
            return toast.error("You must be logged in to apply");
        }

        if (job.recruiter && user._id === job.recruiter) {
            return toast.error("You can't apply for your posted job");
        }

        if (!job.isActive) {
            return toast.error("Job has expired");
        }

        if (user.role === "recruiter") {
            return toast.error("Recruiters can't apply for jobs");
        }

        if (hasAlreadyApplied) {
            return toast.error("You have already applied for this job");
        }
    };

    const canApply =
        user &&
        user.role !== "recruiter" &&
        user._id !== job.recruiter &&
        job.isActive &&
        !hasAlreadyApplied;

    return canApply ? (
        <Button asChild>
            <Link
                href={job?.url ? job.url : `/apply/${jobId}`}
                target={job?.url ? "_blank" : "_self"}
            >
                Apply For Job
                <SquareArrowOutUpRight className="ml-2" size={16} />
            </Link>
        </Button>
    ) : (
        <Button className="cursor-pointer" onClick={handleOnClick}>
            Apply For Job
            <SquareArrowOutUpRight className="ml-2" size={16} />
        </Button>
    );
};

export default ApplyJobButton;
