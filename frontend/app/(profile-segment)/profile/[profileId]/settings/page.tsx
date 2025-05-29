import SettingButtons from "@/components/profile/settingButtons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Page = () => {
    return (
        <Card className="max-w-4/12">
            <CardHeader>
                <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <SettingButtons
                    label="Available for Work"
                    description=" Mark your availibility"
                />
            </CardContent>
        </Card>
    );
};

export default Page;
