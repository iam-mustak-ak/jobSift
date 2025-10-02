"use client";
import { useAuthStore } from "@/state/store";
import { Plus } from "lucide-react";
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
    const { setAuth, user } = useAuthStore((state) => state);

    return (
        <Card className="break-inside-avoid mb-4">
            <CardHeader>
                <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
                <Sheet>
                    <SheetTrigger asChild>
                        <span>
                            {user?.educations &&
                                user.educations.length > 0 &&
                                user.educations.map(
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
                        </span>
                    </SheetTrigger>
                    <AddEditEducation />
                </Sheet>
            </CardContent>
            <CardFooter>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline">
                            <Plus />
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
