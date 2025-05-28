import ProfileCompleteIndicator from "@/components/common/profileCompleteIndicator";
import BasicInfo from "@/components/profile/basicInfo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
            <ProfileCompleteIndicator />
            <Card className="break-inside-avoid mb-4">
                <CardHeader>
                    <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Lorem ipsum, dolor sit amet consectetur adipisicing
                        elit. Nihil sint explicabo quia vel magnam mollitia
                        quod! Quis omnis harum quibusdam, at esse, voluptatem
                        natus, assumenda ullam quidem rem qui dolor. Lorem ipsum
                        dolor, sit amet consectetur adipisicing elit. Quo
                        aspernatur quisquam suscipit quaerat iure earum iste
                        distinctio repellendus necessitatibus fugit
                        voluptatibus, officiis sed facere itaque, in atque
                        porro, quis numquam?
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;
