import ResetPasswordForm from "@/components/common/resetPasswordForm";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const Page = async ({
    searchParams,
}: {
    searchParams?: Promise<{ email?: string; resetId: string }>;
}) => {
    const searchKey = await searchParams;

    return (
        <div className="w-full max-w-96 mx-auto flex items-center justify-center h-[90svh]">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Reset Password?</CardTitle>
                    <CardDescription>Fill all the fields</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResetPasswordForm
                        email={searchKey?.email}
                        resetId={searchKey?.resetId}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;
