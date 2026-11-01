import ChangePasswordForm from "@/components/common/changePasswordForm";
import WorkspacePageHeading from "@/components/common/workspacePageHeading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LockKeyhole, ShieldCheck } from "lucide-react";

const Page = () => {
    return (
        <div className="mx-auto w-full max-w-5xl space-y-6 pb-10">
            <WorkspacePageHeading
                title="Change password"
                description="Update your password regularly to help keep your account secure."
                icon={<LockKeyhole className="h-5 w-5" />}
            />
            <Card className="max-w-2xl rounded-2xl border-slate-200 shadow-sm shadow-slate-900/[0.03]">
                <CardHeader className="px-5 pb-3 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><ShieldCheck className="h-5 w-5" /></div>
                        <div><CardTitle className="text-base">Password security</CardTitle><p className="mt-1 text-sm text-slate-500">Use a unique password you don’t use elsewhere.</p></div>
                    </div>
                </CardHeader>
                <CardContent className="px-5 pb-6 sm:px-6">
                    <ChangePasswordForm />
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;
