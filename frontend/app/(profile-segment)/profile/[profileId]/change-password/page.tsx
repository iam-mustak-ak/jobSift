import IconInput from "@/components/common/iconInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

const Page = () => {
    return (
        <Card className="max-w-3/12">
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
                <form action="" className="grid gap-2">
                    <IconInput
                        Icon={Lock}
                        name="oldPassword"
                        placeholder="Old password"
                        type="password"
                        className="w-full"
                    />
                    <IconInput
                        Icon={Lock}
                        name="password"
                        placeholder="New Password"
                        type="password"
                        className="w-full"
                    />
                    <IconInput
                        Icon={Lock}
                        name="newPassword"
                        placeholder="New Password"
                        type="password"
                        className="w-full"
                    />

                    <Button>Change Password</Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default Page;
