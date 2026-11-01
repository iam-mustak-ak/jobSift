"use client";

import { useAuthStore } from "@/state/store";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Sparkles } from "lucide-react";

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
        <Card className="rounded-2xl border-slate-200 shadow-sm shadow-slate-900/[0.03]">
            <CardHeader className="flex grid-cols-[1fr_auto] items-center px-5 pb-2">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-base">Profile strength</CardTitle>
                        <p className="mt-1 text-xs text-slate-500">Complete your profile to stand out</p>
                    </div>
                </div>
                <Badge className="rounded-full bg-violet-50 text-violet-700 hover:bg-violet-50">
                    {percentage}%
                </Badge>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-2">
                <Progress value={percentage} className="h-2 bg-violet-100 [&>div]:bg-violet-600" />
                <p className="mt-3 text-xs leading-5 text-slate-500">
                    {percentage === 100
                        ? "Your profile is complete and ready to shine."
                        : "Add your details, skills, and experience to make a stronger impression."}
                </p>
            </CardContent>
        </Card>
    );
};

export default ProfileCompleteIndicator;
