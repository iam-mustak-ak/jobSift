import BasicInfo from "@/components/profile/basicInfo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cookies } from "next/headers";

type ProfilePrps = {
    params: Promise<{ profileId: string }>;
};
const Page = async ({ params }: ProfilePrps) => {
    const { profileId } = await params;
    const cookieStore = await cookies();
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/me/${profileId}`,
        {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
        }
    );
    const { data } = await res.json();

    return (
        <div className="mt-5 columns-2 ">
            <BasicInfo data={data} />
            <Card className="break-inside-avoid">
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Profile Complete</CardTitle>
                    <Badge variant="outline">60%</Badge>
                </CardHeader>
                <CardContent>
                    <Progress value={60} />
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;
