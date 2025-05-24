import ForgotPasswordForm from "@/components/common/forgotPasswordForm";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const Page = () => {
    return (
        <div className="w-full max-w-96 mx-auto flex items-center justify-center h-[90svh]">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Forgot Password?</CardTitle>
                    <CardDescription>Provide your Email</CardDescription>
                </CardHeader>
                <CardContent>
                    <ForgotPasswordForm />
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;
