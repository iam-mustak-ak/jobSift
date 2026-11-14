/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { API_BASE_URL } from "@/lib/api";
import { useAuthStore } from "@/state/store";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./button";

type BookMarkButtonProps = {
    jobId: string;
    className?: string;
};

const BookMarkButton = ({ jobId, className = "float-right" }: BookMarkButtonProps) => {
    const { user, setAuth } = useAuthStore((state) => state);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.savedJobs?.some((item: any) => item.jobId === jobId)) {
            setIsBookmarked(true);
        } else {
            setIsBookmarked(false);
        }
    }, [user, jobId]);

    const handleToggleBookmark = async () => {
        setLoading(true);
        try {
            if (!user) {
                return toast.error("Please login to bookmark this job");
            }

            const res = await fetch(
                `${API_BASE_URL}/job/bookmark/${jobId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                }
            );

            if (!res.ok) {
                return toast.error("Error occurred while bookmarking");
            }

            const data = await res.json();
            setIsBookmarked(data.data.isBookmarked);

            // Keep savedJobs as objects
            if (data.data.isBookmarked) {
                setAuth({
                    ...user,
                    savedJobs: [...user?.savedJobs, { jobId }],
                });
            } else {
                setAuth({
                    ...user,
                    savedJobs: user?.savedJobs.filter(
                        (item: any) => item.jobId !== jobId
                    ),
                });
            }

            toast.success(data.message);
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant={"outline"}
            className={className}
            onClick={handleToggleBookmark}
            disabled={loading}
            aria-label={isBookmarked ? "Remove saved job" : "Save job"}
            aria-pressed={isBookmarked}
        >
            {loading ? (
                <Bookmark className="animate-spin" />
            ) : isBookmarked ? (
                <BookmarkCheck className="text-primary" />
            ) : (
                <Bookmark />
            )}
        </Button>
    );
};

export default BookMarkButton;
