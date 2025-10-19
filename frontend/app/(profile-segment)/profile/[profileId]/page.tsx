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
            <Card className="break-inside-avoid mb-4">
                <CardHeader>
                    <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent>
                    <div
                        className="text-muted-foreground prose"
                        dangerouslySetInnerHTML={{
                            __html:
                                typeof data?.about === "string"
                                    ? data.about
                                    : "",
                        }}
                    />
                </CardContent>
            </Card>
            <ProfileCompleteIndicator />
            <SocialInfo />
            <EducationInfo />
        </div>
    );
};

export default Page;
