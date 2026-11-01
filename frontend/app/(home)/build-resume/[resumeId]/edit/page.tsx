"use client";
import ResumeBody from "@/components/resume/resumeBody";
import ResumeHeader from "@/components/resume/resumeHeader";
import { useResumeData } from "@/state/store";
import { fetcherClient } from "@/utils/fetcherClient";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
    const { resumeId } = useParams();
    const setResumeData = useResumeData((state) => state.setResumeData);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        let active = true;
        const fetchResume = async () => {
            try {
                const resume = await fetcherClient(`/resume/get-resume/${resumeId}`);
                if (!active) return;
                if (resume.success) {
                    setResumeData(resume.data);
                } else {
                    setLoadError(true);
                }
            } catch {
                if (active) setLoadError(true);
            } finally {
                if (active) setLoading(false);
            }
        };
        if (resumeId) {
            fetchResume();
        }
        return () => {
            active = false;
        };
    }, [resumeId, setResumeData]);

    if (loading) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 pt-16">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-600 shadow-sm">
                    <Loader2 className="h-5 w-5 animate-spin text-violet-700" />
                    Loading your resume editor…
                </div>
            </main>
        );
    }

    if (loadError) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 pt-16">
                <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm">
                    <FileText className="mx-auto h-9 w-9 text-violet-700" />
                    <h1 className="mt-4 text-xl font-bold text-slate-900">Couldn’t open this resume</h1>
                    <p className="mt-2 text-sm leading-6 text-slate-500">Try returning to your resume list and opening it again.</p>
                    <Link href="/build-resume" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800">
                        <ArrowLeft className="h-4 w-4" /> Back to resumes
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50/80 px-3 pb-10 pt-24 sm:px-6 sm:pt-28 lg:px-8">
            <div className="mx-auto max-w-[1600px]">
                <ResumeHeader />
                <div className="mt-5">
                    <ResumeBody />
                </div>
            </div>
        </main>
    );
};

export default Page;
