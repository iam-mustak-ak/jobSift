"use client";

import ProfileCompleteIndicator from "@/components/common/profileCompleteIndicator";
import BasicInfo from "@/components/profile/basicInfo";
import EducationInfo from "@/components/profile/educationInfo";
import SocialInfo from "@/components/profile/socialInfo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { fetcherClient } from "@/utils/fetcherClient";
import RecruiterProfile from "@/components/profile/recruiterProfile";
import { useAuthStore } from "@/state/store";
import { use, useEffect, useState, type ComponentProps } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ProfilePrps = {
    params: Promise<{ profileId: string }>;
};
type RecruiterData = ComponentProps<typeof RecruiterProfile>;

const Page = ({ params }: ProfilePrps) => {
    const { profileId } = use(params);
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [profile, setProfile] = useState<{
        id: string;
        data: RecruiterData["user"];
        company: RecruiterData["initialCompany"];
        jobs: RecruiterData["jobs"];
    } | null>(null);
    const [error, setError] = useState("");
    const [retry, setRetry] = useState(0);

    useEffect(() => {
        let active = true;
        const loadProfile = async () => {
            setError("");
            setProfile(null);
            try {
                // Backend cookies belong to the API domain, so use the browser's
                // authenticated connection rather than a Next.js server fetch.
                const validId = /^[a-f\d]{24}$/i.test(profileId);
                const result = await fetcherClient(
                    validId ? `/auth/me/${profileId}` : "/auth/check-auth"
                );
                if (!active) return;
                if (!result?.success || !result.data?._id) {
                    throw new Error(result?.message || "Couldn’t load your profile. Please sign in again or retry.");
                }
                const data = result.data;
                setAuth(data);
                if (!validId) {
                    router.replace(`/profile/${data._id}`);
                    return;
                }

                let company: RecruiterData["initialCompany"] = null;
                let jobs: RecruiterData["jobs"] = [];
                if (data.role === "recruiter") {
                    const companyId = typeof data.company === "string" ? data.company : data.company?._id;
                    const [companyResult, jobsResult] = await Promise.all([
                        companyId ? fetcherClient(`/company/get-company/${companyId}`) : Promise.resolve(undefined),
                        fetcherClient(`/job/recruiter/${data._id}?page=1&limit=100`),
                    ]);
                    company = companyResult?.data ?? (typeof data.company === "object" ? data.company : null);
                    jobs = Array.isArray(jobsResult?.data) ? jobsResult.data : [];
                }
                if (active) setProfile({ id: profileId, data, company, jobs });
            } catch (error) {
                if (active) setError(error instanceof Error ? error.message : "Couldn’t load your profile.");
            }
        };
        void loadProfile();
        return () => { active = false; };
    }, [profileId, retry, router, setAuth]);

    if (error) {
        return (
            <div role="alert" className="rounded-2xl border border-slate-200 bg-white p-6">
                <h1 className="text-xl font-semibold">Couldn’t load your profile</h1>
                <p className="mt-2 text-sm text-slate-600">{error}</p>
                <div className="mt-4 flex gap-4 text-sm font-semibold text-violet-700">
                    <button type="button" onClick={() => setRetry((value) => value + 1)}>Try again</button>
                    <Link href="/login">Sign in</Link>
                </div>
            </div>
        );
    }

    if (!profile || profile.id !== profileId) {
        return <p role="status" className="p-6 text-sm text-slate-600">Loading your profile…</p>;
    }

    const { data } = profile;

    if (data?.role === "recruiter") {
        return (
            <RecruiterProfile
                user={data}
                initialCompany={profile.company}
                jobs={profile.jobs}
            />
        );
    }

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6 pb-10">
            <div>
                <p className="text-sm font-medium text-violet-700">Your workspace</p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">My profile</h1>
                <p className="mt-2 text-sm text-slate-500">Showcase your experience and keep your professional details up to date.</p>
            </div>
            <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3">
                <div className="space-y-5 lg:col-span-2">
                    <BasicInfo data={data} />
                    <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm shadow-slate-900/[0.03]">
                        <CardHeader className="flex grid-cols-[auto_1fr] items-center gap-3 px-6 pb-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-base">About me</CardTitle>
                                <p className="mt-1 text-sm text-slate-500">A short introduction for people viewing your profile.</p>
                            </div>
                        </CardHeader>
                        <CardContent className="px-6 pb-6 pt-3">
                            {typeof data?.about === "string" && data.about.trim() ? (
                                <div
                                    className="prose prose-slate max-w-none text-sm leading-7 [&_a]:text-violet-700 [&_h1]:text-xl [&_h2]:text-lg [&_ul]:my-2"
                                    dangerouslySetInnerHTML={{ __html: data.about }}
                                />
                            ) : (
                                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-5 text-sm text-slate-500">
                                    Add a short introduction to help people understand your background and goals.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    <EducationInfo />
                </div>
                <aside className="space-y-5">
                    <ProfileCompleteIndicator />
                    <SocialInfo />
                </aside>
            </div>
        </div>
    );
};

export default Page;
