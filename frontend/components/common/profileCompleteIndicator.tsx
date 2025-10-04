"use client";

import { useAuthStore } from "@/state/store";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

const ProfileCompleteIndicator = () => {
    const { user } = useAuthStore((state) => state);

    // required fields
    const requiredFields = [
        !!(user?.skills && user.skills.length > 0),
        !!user?.bio,
        !!user?.profilePicture,
        !!(user?.educations && user.educations.length > 0),
        !!(user?.socialLinks && user.socialLinks.length > 0),
        !!user?.phone,
        !!user?.location,
        !!user?.experience,
        !!(user?.jobPreferences && Object.keys(user.jobPreferences).length > 0),
        !!user?.about,
    ];

    const completedCount = requiredFields.filter(Boolean).length;
    const percentage = Math.round(
        (completedCount / requiredFields.length) * 100
    );

    return (
        <Card className="break-inside-avoid mb-4">
            <CardHeader className="flex items-center justify-between">
                <CardTitle>Profile Complete</CardTitle>
                <Badge variant={percentage === 100 ? "default" : "outline"}>
                    {percentage}%
                </Badge>
            </CardHeader>
            <CardContent>
                <Progress value={percentage} />
            </CardContent>
        </Card>
    );
};

export default ProfileCompleteIndicator;
