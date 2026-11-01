"use client";
import { useAuthStore } from "@/state/store";
import { GraduationCap, Plus } from "lucide-react";
import EducationCard from "../common/educationCard";
import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Sheet, SheetTrigger } from "../ui/sheet";
import AddEditEducation from "./addEditEducation";

const EducationInfo = () => {
    const { user } = useAuthStore((state) => state);

    return (
        <Card className="rounded-2xl border-slate-200 shadow-sm shadow-slate-900/[0.03]">
            <CardHeader className="px-5 pb-2">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                        <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-base">Education</CardTitle>
                        <p className="mt-1 text-sm text-slate-500">Your academic background</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-5 pt-3">
                <div className="grid gap-3">
                    {user?.educations?.map(
                        (
                            v: {
                                degree: string;
                                institution: string;
                                startDate: string;
                                endDate: string;
                            },
                            i: number
                        ) => <EducationCard key={i} data={v} />
                    )}
                    {(!user?.educations || user.educations.length === 0) && (
                        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-5 text-sm text-slate-500">
                            Add your education to give your profile more context.
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="px-5 pb-5 pt-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="rounded-xl">
                            <Plus className="h-4 w-4" />
                            Add Education
                        </Button>
                    </SheetTrigger>
                    <AddEditEducation />
                </Sheet>
            </CardFooter>
        </Card>
    );
};

export default EducationInfo;
