/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuthStore } from "@/state/store";
import { dateFormate } from "@/utils/dateFormate";
import { formateCapitalized } from "@/utils/formateCapitalized";
import { salaryFormat } from "@/utils/salaryFormat";
import {
    BriefcaseBusiness,
    CheckCircle2,
    CircleDollarSign,
    Clock3,
    MapPin,
    Pen,
    Trash2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import BookMarkButton from "../ui/bookMarkButton";
import { Button } from "../ui/button";
import { Card, CardContent, CardTitle } from "../ui/card";
import RecruiterApplicantsDialog from "./recruiterApplicantsDialog";
import Tag from "./tag";

const FeaturedJobCard = ({
    featuredJobs,
    isSuggested = false,
    isRecuiter = false,
    onDelete,
    cardClassName,
}: {
    featuredJobs: Record<string, any>;
    isSuggested?: boolean;
    isRecuiter?: boolean;
    onDelete?: (id: string) => void;
    cardClassName?: string;
}) => {
    const { user } = useAuthStore((state) => state);
    const salary = salaryFormat(featuredJobs?.salaryRange);
    const postedDate = featuredJobs?.openings ?? featuredJobs?.createdAt;
    const isExpired =
        !featuredJobs?.isActive ||
        Boolean(
            featuredJobs?.deadline &&
                new Date(featuredJobs.deadline) <= new Date()
        );
    const hasSalary =
        featuredJobs?.salaryRange?.min != null &&
        featuredJobs?.salaryRange?.max != null;

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
        <Card
            className={`group overflow-hidden rounded-2xl py-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                cardClassName ?? ""
            }`}
        >
            <CardContent className="px-5 py-5 sm:px-6">
                <div className="flex items-start gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-700 ring-1 ring-violet-100">
                        <BriefcaseBusiness
                            className="h-5 w-5"
                            aria-hidden="true"
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                                <Link
                                    href={`/job/${featuredJobs?._id}`}
                                    className="group/title"
                                >
                                    <CardTitle className="mb-1 line-clamp-2 text-base font-semibold leading-snug text-current transition-colors group-hover/title:text-violet-700 sm:text-lg">
                                        {featuredJobs?.title}
                                    </CardTitle>
                                </Link>
                                {typeof featuredJobs?.company === "object" &&
                                    featuredJobs.company?.name && (
                                        <p className="truncate text-sm font-medium text-slate-500">
                                            {featuredJobs.company.name}
                                        </p>
                                    )}
                            </div>

                            <div className="flex shrink-0 items-center gap-1.5">
                                <BookMarkButton
                                    jobId={featuredJobs?._id}
                                    className="h-9 w-9 rounded-lg border-slate-200 bg-white p-0 text-slate-500 shadow-none hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                                />
                                {user &&
                                    user?._id ===
                                        featuredJobs?.recruiter?._id && (
                                        <>
                                            <Link
                                                href={`/edit-job/${featuredJobs?._id}`}
                                            >
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    aria-label="Edit job"
                                                    className="h-9 w-9 rounded-lg border-slate-200 bg-white p-0 text-slate-600 shadow-none hover:bg-slate-50"
                                                >
                                                    <Pen className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                aria-label="Delete job"
                                                className="h-9 w-9 rounded-lg p-0"
                                                onClick={handleDelete}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                            </div>
                        </div>

                        <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
                            {featuredJobs?.experienceLevel && (
                                <li className="flex items-center gap-2">
                                    <BriefcaseBusiness className="h-4 w-4 shrink-0 text-slate-400" />
                                    {formateCapitalized(
                                        featuredJobs?.experienceLevel
                                    )}
                                </li>
                            )}
                            {featuredJobs?.location && (
                                <li className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                                    {formateCapitalized(featuredJobs.location)}
                                </li>
                            )}

                            {postedDate && (
                                <li
                                    className={`flex items-center gap-2 ${
                                        isExpired ? "text-rose-600" : ""
                                    }`}
                                >
                                    <Clock3
                                        className={`h-4 w-4 shrink-0 ${
                                            isExpired
                                                ? "text-rose-500"
                                                : "text-slate-400"
                                        }`}
                                    />
                                    {isExpired
                                        ? "Expired"
                                        : dateFormate(postedDate)}
                                </li>
                            )}
                            {hasSalary && (
                                <li className="flex items-center gap-2 font-semibold text-slate-700">
                                    <CircleDollarSign className="h-4 w-4 shrink-0 text-violet-600" />
                                    {salary.min} – {salary.max}
                                </li>
                            )}
                        </ul>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                            <div className="flex flex-wrap items-center gap-2">
                                {featuredJobs?.jobType && (
                                    <Tag type={featuredJobs.jobType} />
                                )}
                                {featuredJobs?.employmentMode && (
                                    <Tag type={featuredJobs.employmentMode} />
                                )}
                            </div>
                            {isSuggested && (
                                <div className="flex items-center justify-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-100">
                                    {featuredJobs?.matchPercent}% match
                                </div>
                            )}
                            {isRecuiter && (
                                <RecruiterApplicantsDialog
                                    job={{
                                        _id: featuredJobs._id,
                                        title: featuredJobs.title,
                                        applicants: featuredJobs.applicants ?? [],
                                    }}
                                />
                            )}
                        </div>
                        {isSuggested && featuredJobs?.matchReasons?.length > 0 && (
                            <ul className="mt-3 flex flex-wrap gap-2">
                                {featuredJobs.matchReasons.map((reason: string, index: number) => (
                                    <li
                                        key={`${reason}-${index}`}
                                        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50/60 px-2.5 py-1 text-[11px] font-medium text-emerald-800"
                                    >
                                        <CheckCircle2 className="h-3 w-3 shrink-0" />
                                        {reason}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {isSuggested && featuredJobs?.matchedSkills?.length > 0 && (
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Shared skills</span>
                                {featuredJobs.matchedSkills.slice(0, 4).map((skill: string, index: number) => (
                                    <span key={`${skill}-${index}`} className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-800">{skill}</span>
                                ))}
                                {featuredJobs.matchedSkills.length > 4 && (
                                    <span className="text-[11px] text-slate-500">+{featuredJobs.matchedSkills.length - 4} more</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default FeaturedJobCard;
