/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuthStore } from "@/state/store";
import { Check, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "../ui/button";

type buttonType = {
    job: {
        url?: string;
        recruiter?: string | { _id?: string };
        isActive: boolean;
    };
    jobId: string;
};

const ApplyJobButton: React.FC<buttonType> = ({ job, jobId }) => {
    const { user } = useAuthStore((state) => state);

    const getId = (value: any) => String(typeof value === "object" ? value?._id ?? "" : value ?? "");
    const recruiterId = getId(job.recruiter);
    const hasAlreadyApplied = user?.role === "candidate" && user.appliedJobs?.some(
        (application: any) => getId(application?.jobId) === getId(jobId)
    );

    const handleOnClick = () => {
        if (!user) {
            return toast.error("You must be logged in to apply");
        }

        if (recruiterId && getId(user._id) === recruiterId) {
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
        getId(user._id) !== recruiterId &&
        job.isActive &&
        !hasAlreadyApplied;

    if (hasAlreadyApplied) {
        return (
            <Button
                type="button"
                disabled
                aria-label="You have already applied for this job"
                className="cursor-default bg-emerald-50 text-emerald-700 shadow-none hover:bg-emerald-50"
            >
                <Check className="mr-2 h-4 w-4" />
                Applied
            </Button>
        );
    }

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
