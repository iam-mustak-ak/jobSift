import SettingButtons from "@/components/profile/settingButtons";
import WorkspacePageHeading from "@/components/common/workspacePageHeading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings2, Sparkles } from "lucide-react";

const Page = () => {
    return (
        <div className="mx-auto w-full max-w-5xl space-y-6 pb-10">
            <WorkspacePageHeading
                title="Settings"
                description="Control how your profile is presented to employers."
                icon={<Settings2 className="h-5 w-5" />}
            />
            <Card className="max-w-3xl rounded-2xl border-slate-200 shadow-sm shadow-slate-900/[0.03]">
                <CardHeader className="px-5 pb-3 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Sparkles className="h-5 w-5" /></div>
                        <div>
                            <CardTitle className="text-base">Career visibility</CardTitle>
                            <p className="mt-1 text-sm text-slate-500">Choose whether employers can see you’re open to new opportunities.</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="px-5 pb-6 sm:px-6">
                    <SettingButtons
                        label="Available for work"
                        description="Let employers know you’re interested in hearing about relevant roles."
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;
