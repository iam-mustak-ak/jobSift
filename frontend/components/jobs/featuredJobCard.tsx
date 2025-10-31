/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuthStore } from "@/state/store";
import { dateFormate } from "@/utils/dateFormate";
import { formateCapitalized } from "@/utils/formateCapitalized";
import { salaryFormat } from "@/utils/salaryFormat";
import {
    BriefcaseBusiness,
    CircleDollarSign,
    Clock3,
    MapPin,
    Pen,
    Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import BookMarkButton from "../ui/bookMarkButton";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import Tag from "./tag";

const FeaturedJobCard = ({
    featuredJobs,
    isSuggested = false,
    isRecuiter = false,
    onDelete,
}: {
    featuredJobs: Record<string, any>;
    isSuggested?: boolean;
    isRecuiter?: boolean;
    onDelete?: (id: string) => void;
}) => {
    const { user } = useAuthStore((state) => state);
    const salary = salaryFormat(featuredJobs?.salaryRange);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this job?")) return;

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/job/delete/${featuredJobs._id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            if (!res.ok) throw new Error("Failed to delete job");

            toast.success("Job deleted successfully");

            onDelete?.(featuredJobs._id);
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        }
    };

    return (
        <Card>
            <CardContent>
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 aspect-square rounded-md">
                        <Link href="/employer/1243">
                            <Image
                                src="/item-brand.png"
                                width={500}
                                height={500}
                                alt="brand logo"
                            />
                        </Link>
                    </div>
                    <div className="w-full flex flex-col gap-0">
                        <div className="w-full flex justify-between items-center">
                            <Link href={`/job/${featuredJobs?._id}` || "#"}>
                                <CardTitle className="leading-tight mb-2">
                                    {featuredJobs?.title}
                                </CardTitle>
                            </Link>

                            <div className="flex items-center gap-2">
                                <BookMarkButton jobId={featuredJobs?._id} />
                                {user &&
                                    user?._id ===
                                        featuredJobs?.recruiter?._id && (
                                        <>
                                            <Link
                                                href={
                                                    `/edit-job/${featuredJobs?._id}` ||
                                                    "#"
                                                }
                                            >
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    <Pen />
                                                </Button>
                                            </Link>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={handleDelete}
                                            >
                                                <Trash2 />
                                            </Button>
                                        </>
                                    )}
                            </div>
                        </div>

                        <ul className="flex items-center gap-5 max-md:flex-wrap">
                            <li className="flex gap-2 font-normal text-muted-foreground">
                                <BriefcaseBusiness />{" "}
                                {formateCapitalized(
                                    featuredJobs?.experienceLevel
                                )}
                            </li>
                            {featuredJobs?.location && (
                                <li className="flex gap-2 font-normal text-muted-foreground">
                                    <MapPin />{" "}
                                    {formateCapitalized(featuredJobs.location)}
                                </li>
                            )}

                            <li className="flex gap-2 font-normal text-muted-foreground">
                                <Clock3
                                    className={
                                        !featuredJobs?.isActive
                                            ? "text-destructive"
                                            : ""
                                    }
                                />{" "}
                                {featuredJobs?.isActive ? (
                                    featuredJobs?.deadline &&
                                    new Date(featuredJobs.deadline) <=
                                        new Date() ? (
                                        dateFormate(featuredJobs?.deadline)
                                    ) : (
                                        dateFormate(featuredJobs?.openings)
                                    )
                                ) : (
                                    <span className="text-destructive">
                                        Expired
                                    </span>
                                )}
                            </li>
                            <li className="flex gap-2 font-normal text-muted-foreground">
                                <CircleDollarSign /> {salary.min} - {salary.max}
                            </li>
                        </ul>
                        <div className="flex items-center gap-4 justify-between">
                            <div className="flex items-center gap-3 mt-5">
                                <Tag type={featuredJobs?.jobType} />
                                <Tag type={featuredJobs?.employmentMode} />
                            </div>
                            {isSuggested && (
                                <div className="bg-green-800 text-white rounded-full py-1 px-2 text-sm flex items-center justify-center">
                                    <p>{featuredJobs?.matchPercent}% Matched</p>
                                </div>
                            )}
                            {isRecuiter && (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <p>
                                                view{" "}
                                                {
                                                    featuredJobs?.applicants
                                                        .length
                                                }{" "}
                                                applicant
                                            </p>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[600px]">
                                        <DialogHeader>
                                            <DialogTitle className="mb-2">
                                                Applicants
                                            </DialogTitle>

                                            <div className="flex flex-col gap-2">
                                                {featuredJobs?.applicants &&
                                                    featuredJobs.applicants
                                                        .length > 0 &&
                                                    featuredJobs.applicants?.map(
                                                        (applicant: any) => (
                                                            <Card
                                                                key={
                                                                    applicant._id
                                                                }
                                                            >
                                                                <CardHeader>
                                                                    <CardTitle>
                                                                        {
                                                                            applicant.user
                                                                        }
                                                                    </CardTitle>
                                                                </CardHeader>
                                                                <Separator />

                                                                <CardContent>
                                                                    <div className="flex items-center gap-2">
                                                                        <Dialog>
                                                                            <DialogTrigger
                                                                                asChild
                                                                            >
                                                                                <Button
                                                                                    variant={
                                                                                        "outline"
                                                                                    }
                                                                                >
                                                                                    View
                                                                                    Coverletter
                                                                                </Button>
                                                                            </DialogTrigger>
                                                                            <DialogContent className="sm:max-w-[600px]">
                                                                                <DialogHeader>
                                                                                    <DialogTitle>
                                                                                        Cover
                                                                                        Letter
                                                                                    </DialogTitle>
                                                                                </DialogHeader>
                                                                                <div
                                                                                    dangerouslySetInnerHTML={{
                                                                                        __html:
                                                                                            typeof applicant?.coverLetter ===
                                                                                            "string"
                                                                                                ? applicant.coverLetter
                                                                                                : "",
                                                                                    }}
                                                                                />
                                                                            </DialogContent>
                                                                        </Dialog>

                                                                        <Dialog>
                                                                            <DialogTrigger
                                                                                asChild
                                                                            >
                                                                                <Button>
                                                                                    View
                                                                                    Resume
                                                                                </Button>
                                                                            </DialogTrigger>
                                                                            <DialogContent className="sm:max-w-[600px]">
                                                                                <DialogHeader>
                                                                                    <DialogTitle>
                                                                                        Resume
                                                                                    </DialogTitle>
                                                                                </DialogHeader>

                                                                                {applicant?.resume && (
                                                                                    <iframe
                                                                                        title="PDF preview"
                                                                                        src={
                                                                                            applicant.resume as string
                                                                                        }
                                                                                        className="mt-4 w-full h-[80vh] border sticky top-20"
                                                                                    />
                                                                                )}
                                                                            </DialogContent>
                                                                        </Dialog>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        )
                                                    )}
                                            </div>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default FeaturedJobCard;
