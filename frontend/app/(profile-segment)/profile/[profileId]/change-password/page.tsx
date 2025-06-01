import ChangePasswordForm from "@/components/common/changePasswordForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Page = () => {
    return (
        <Card className="max-w-3/12">
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
                <ChangePasswordForm />
            </CardContent>
        </Card>
    );
};

export default Page;
