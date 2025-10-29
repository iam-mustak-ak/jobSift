/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner"; // or your toast lib
import EditorWrapper from "../common/EditorWrapper";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const ApplyJobForm = ({ jobId }: { jobId: string }) => {
    const [coverLetter, setCoverLetter] = useState<string>("");
    const [resume, setResume] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!jobId) {
            toast.error("Invalid Job ID");
            return;
        }

        if (!resume) {
            toast.error("Please attach your resume");
            return;
        }

        try {
            setLoading(true);

            const resumeForm = new FormData();
            resumeForm.append("resume", resume);

            const uploadRes = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/upload-resume`,
                {
                    method: "POST",
                    body: resumeForm,
                    credentials: "include",
                }
            );

            const uploadData = await uploadRes.json();
            if (!uploadRes.ok) {
                throw new Error(
                    uploadData.message || "Failed to upload resume"
                );
            }

            const resumeUrl = uploadData?.data?.resumeUrl;

            if (!resumeUrl) {
                throw new Error("Resume URL missing in response");
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/job/apply/${jobId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        coverLetter,
                        resume: resumeUrl,
                    }),
                    credentials: "include",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to apply");
            }

            toast.success("Application submitted successfully!");
            router.push("/");
        } catch (err: any) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 bg-white p-6 rounded-2xl shadow-sm"
        >
            {/* Cover Letter */}
            <div className="flex flex-col gap-2">
                <Label htmlFor="coverLetter">Cover Letter</Label>
                <EditorWrapper
                    value={coverLetter}
                    setValue={(val: string) => setCoverLetter(val)}
                    className="bg-white rounded-2xl border border-gray-200"
                />
            </div>

            {/* Resume Upload */}
            <div className="flex flex-col gap-2">
                <Label htmlFor="resume">Attach Resume</Label>
                <Input
                    id="resume"
                    name="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResume(e.target.files?.[0] || null)}
                />
            </div>

            {/* Submit */}
            <div className="mt-6">
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto cursor-pointer"
                >
                    {loading ? "Submitting..." : "Submit Application"}
                </Button>
            </div>
        </form>
    );
};

export default ApplyJobForm;
