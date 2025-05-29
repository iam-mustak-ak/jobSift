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
    return (
        <Card className="break-inside-avoid mb-4">
            <CardHeader>
                <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
                <EducationCard />
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
