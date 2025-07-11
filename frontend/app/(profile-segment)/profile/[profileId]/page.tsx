import ProfileCompleteIndicator from "@/components/common/profileCompleteIndicator";
import BasicInfo from "@/components/profile/basicInfo";
import EducationInfo from "@/components/profile/educationInfo";
import SocialInfo from "@/components/profile/socialInfo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetcherSever } from "@/utils/fetcherSever";

type ProfilePrps = {
    params: Promise<{ profileId: string }>;
};
const Page = async ({ params }: ProfilePrps) => {
    const { profileId } = await params;
    const { data } = await fetcherSever(`/auth/me/${profileId}`);

    return (
        <div className="mt-5 columns-2 ">
            <BasicInfo data={data} />
            <SocialInfo data={data} />
            <EducationInfo />
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
