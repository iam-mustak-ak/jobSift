import ProfileCompleteIndicator from "@/components/common/profileCompleteIndicator";
import BasicInfo from "@/components/profile/basicInfo";
import EducationInfo from "@/components/profile/educationInfo";
import SocialInfo from "@/components/profile/socialInfo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { fetcherSever } from "@/utils/fetcherSever";

type ProfilePrps = {
    params: Promise<{ profileId: string }>;
};
const Page = async ({ params }: ProfilePrps) => {
    const { profileId } = await params;
    const { data } = await fetcherSever(`/auth/me/${profileId}`);

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
