import WorkspacePageHeading from "@/components/common/workspacePageHeading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock3, Monitor, ShieldCheck } from "lucide-react";

const Page = () => {
    return (
        <div className="mx-auto w-full max-w-5xl space-y-6 pb-10">
            <WorkspacePageHeading
                title="Active sessions"
                description="Review the device and browser currently signed in to your account."
                icon={<ShieldCheck className="h-5 w-5" />}
            />
            <Card className="max-w-3xl rounded-2xl border-slate-200 shadow-sm shadow-slate-900/[0.03]">
                <CardHeader className="px-5 pb-3 sm:px-6">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <CardTitle className="text-base">Where you’re signed in</CardTitle>
                            <p className="mt-1 text-sm text-slate-500">For your security, only keep sessions you recognize.</p>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">1 active</span>
                    </div>
                </CardHeader>
                <CardContent className="px-5 pb-6 sm:px-6">
                    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-gradient-to-r from-white to-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><Monitor className="h-6 w-6" /></div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900">Chrome on Windows</p>
                                <p className="mt-1 text-xs text-slate-500">Browser version 17.0.963.79</p>
                                <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Current session</p>
                            </div>
                        </div>
                        <p className="inline-flex items-center gap-2 text-xs text-slate-400"><Clock3 className="h-4 w-4" />Active now</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;
