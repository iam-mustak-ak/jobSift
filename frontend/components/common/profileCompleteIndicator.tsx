import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

const ProfileCompleteIndicator = () => {
    return (
        <Card className="break-inside-avoid mb-4">
            <CardHeader className="flex items-center justify-between">
                <CardTitle>Profile Complete</CardTitle>
                <Badge variant="outline">60%</Badge>
            </CardHeader>
            <CardContent>
                <Progress value={60} />
            </CardContent>
        </Card>
    );
};

export default ProfileCompleteIndicator;
