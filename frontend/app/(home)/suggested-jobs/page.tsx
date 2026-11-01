/* eslint-disable @typescript-eslint/no-explicit-any */
import ContainerWrapper from "@/components/common/containerWrapper";
import FeaturedJobCard from "@/components/jobs/featuredJobCard";
import WorkspacePageHeading from "@/components/common/workspacePageHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetcherSever } from "@/utils/fetcherSever";
import { BriefcaseBusiness, Search, Sparkles, UserRound, WandSparkles } from "lucide-react";
import Link from "next/link";

const Page = async () => {
    const result = await fetcherSever("/match-job");
    const matches = Array.isArray(result?.data) ? result.data : [];
    const meta = result?.meta;
    const needsLogin = !result?.success && /auth|login/i.test(result?.message ?? "");
    const noOpenRoles = result?.success && meta?.jobsConsidered === 0;
    const profileHref = meta?.profileId
        ? `/profile/${meta.profileId}/edit-profile`
        : "/login";

    return (
        <ContainerWrapper>
            <div className="mx-auto max-w-6xl space-y-6 pb-12 pt-16 sm:pt-20">
                <WorkspacePageHeading
                    title="Suggested for you"
                    description="Active roles ranked against your skills, experience, location, and preferences."
                    icon={<Sparkles className="h-5 w-5" />}
                />

                {result?.success && meta?.hasProfileSignals && (
                    <Card className="rounded-2xl border-violet-100 bg-gradient-to-r from-violet-50/80 via-white to-indigo-50/70 shadow-sm shadow-slate-900/[0.03]">
                        <CardContent className="grid gap-5 px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:px-6">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-violet-700 shadow-sm ring-1 ring-violet-100">
                                    <WandSparkles className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold text-slate-900">Personalized using your profile</h2>
                                    <p className="mt-1 text-sm leading-5 text-slate-500">
                                        {matches.length
                                            ? `Compared your profile with ${meta.jobsConsidered ?? matches.length} open roles and ranked the closest fits.`
                                            : `We checked ${meta.jobsConsidered ?? 0} open roles against your profile details.`}
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {meta.usedProfileSignals?.map((signal: string) => (
                                            <span key={signal} className="rounded-full border border-violet-100 bg-white/80 px-2.5 py-1 text-xs font-medium text-violet-800">{signal}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="min-w-40 sm:w-48">
                                <div className="mb-2 flex items-center justify-between text-xs">
                                    <span className="font-medium text-slate-600">Profile readiness</span>
                                    <span className="font-semibold text-violet-700">{meta.profileReadiness ?? 0}%</span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-violet-100">
                                    <div className="h-full rounded-full bg-violet-600 transition-all" style={{ width: `${meta.profileReadiness ?? 0}%` }} />
                                </div>
                                {meta.missingProfileDetails?.length > 0 && (
                                    <p className="mt-2 text-xs leading-5 text-slate-500">Add {meta.missingProfileDetails.slice(0, 2).join(" and ")} for more precise matches.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {matches.length > 0 ? (
                    <>
                        <div className="flex items-end justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">Your best matches</h2>
                                <p className="mt-1 text-sm text-slate-500">Ranked by how closely each role fits your profile.</p>
                            </div>
                            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200">{matches.length} matches</span>
                        </div>
                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                            {matches.map((job: Record<string, any>) => (
                                <FeaturedJobCard
                                    featuredJobs={job}
                                    key={job._id}
                                    isSuggested
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <Card className="rounded-3xl border-dashed border-slate-300 bg-white shadow-sm">
                        <CardContent className="flex flex-col items-center px-6 py-14 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                                {!result?.success ? <UserRound className="h-6 w-6" /> : !meta?.hasProfileSignals ? <UserRound className="h-6 w-6" /> : <BriefcaseBusiness className="h-6 w-6" />}
                            </div>
                            <h2 className="mt-5 text-lg font-semibold text-slate-900">
                                {needsLogin
                                    ? "Sign in to get personalized matches"
                                    : !result?.success
                                      ? "We couldn’t load your suggestions"
                                      : noOpenRoles
                                        ? "No open roles to match yet"
                                    : !meta?.hasProfileSignals
                                      ? "Add profile details to get started"
                                      : "No close matches yet"}
                            </h2>
                            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                                {needsLogin
                                    ? "Your suggestions are private to your account. Sign in to match jobs with your experience and preferences."
                                    : !result?.success
                                      ? "We couldn’t reach the job matching service. You can still browse all available jobs."
                                      : noOpenRoles
                                        ? "There are no active job postings right now. Browse the job board again soon to see new opportunities."
                                    : !meta?.hasProfileSignals
                                      ? "Add your skills, experience, location, or job preferences. JobSift will use those details to rank relevant roles for you."
                                      : "We couldn’t find a strong match among the current open roles. Update your preferences or browse all available jobs."}
                            </p>
                            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                                {result?.success && meta?.hasProfileSignals && (
                                    <Button asChild variant="outline" className="rounded-xl">
                                        <Link href={profileHref}><UserRound className="mr-2 h-4 w-4" />Update profile</Link>
                                    </Button>
                                )}
                                <Button asChild className="rounded-xl bg-violet-700 hover:bg-violet-800">
                                    <Link href={needsLogin ? "/login" : "/find-jobs"}>
                                        {needsLogin ? <UserRound className="mr-2 h-4 w-4" /> : <Search className="mr-2 h-4 w-4" />}
                                        {needsLogin ? "Sign in" : "Browse all jobs"}
                                    </Link>
                                </Button>
                                {result?.success && !meta?.hasProfileSignals && meta?.profileId && (
                                    <Button asChild variant="outline" className="rounded-xl">
                                        <Link href={profileHref}><UserRound className="mr-2 h-4 w-4" />Complete profile</Link>
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </ContainerWrapper>
    );
};

export default Page;
