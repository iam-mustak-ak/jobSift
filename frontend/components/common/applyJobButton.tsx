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

    const handleOnCLick = () => {
        if (user && job.recruiter && user?._id !== job.recruiter) {
            return toast.error("You can't apply for your posted job");
        }

        if (!job.isActive) {
            return toast.error("Job Has been Expired");
        }

        if (user && user.role === "recruiter") {
            return toast.error("Recruiter can't apply for any job");
        }
    };

    return (user && job.recruiter && user?._id !== job.recruiter) ||
        (user && user.role !== "recruiter" && job.isActive) ? (
        <Button asChild>
            <Link
                href={job?.url ? job.url : `/apply/${jobId}`}
                target={job?.url ? "_blank" : "_self"}
            >
                Apply For Job
                <SquareArrowOutUpRight />
            </Link>
        </Button>
    ) : (
        <Button className="cursor-pointer" onClick={handleOnCLick}>
            Apply For Job
            <SquareArrowOutUpRight />
        </Button>
    );
};

export default ApplyJobButton;
