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
import { Card, CardContent, CardTitle } from "../ui/card";
import Tag from "./tag";

const FeaturedJobCard = ({
    featuredJobs,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    featuredJobs: Record<string, any>;
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
            toast.success("Post Deleted");
        } catch (err) {
            console.error(err);
            toast.success("Somthing is wrong");
        }
    };

    console.log(featuredJobs?.recruiter);

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
                                    dateFormate(featuredJobs?.openings)
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

                        <div className="flex items-center gap-3 mt-5">
                            <Tag type={featuredJobs?.jobType} />
                            <Tag type={featuredJobs?.employmentMode} />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default FeaturedJobCard;
