"use client";
import ResumeBody from "@/components/resume/resumeBody";
import ResumeHeader from "@/components/resume/resumeHeader";
import { useResumeData } from "@/state/store";
import { fetcherClient } from "@/utils/fetcherClient";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
    const { resumeId } = useParams();
    const setResumeData = useResumeData((state) => state.setResumeData);

    useEffect(() => {
        const fetchResume = async () => {
            const resume = await fetcherClient(
                `/resume/get-resume/${resumeId}`
            );
            if (resume.success) {
                setResumeData(resume.data);
            }
        };
        if (resumeId) {
            fetchResume();
        }
    }, [resumeId, setResumeData]);

    return (
        <div className="px-10 mt-6 pt-16 pb-12 ">
            <div>
                <ResumeHeader />

                <ResumeBody />
            </div>
        </div>
    );
};

export default Page;
