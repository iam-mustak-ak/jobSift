/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuthStore } from "@/state/store";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./button";

type BookMarkButtonProps = {
    jobId: string;
};

const BookMarkButton = ({ jobId }: BookMarkButtonProps) => {
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
                `${process.env.NEXT_PUBLIC_SERVER_URL}/job/bookmark/${jobId}`,
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
            className="float-right"
            onClick={handleToggleBookmark}
            disabled={loading}
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
