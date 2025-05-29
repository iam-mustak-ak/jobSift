import { Plus } from "lucide-react";
import CustomInput from "../common/customInput";
import EducationCard from "../common/educationCard";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "../ui/sheet";

const AddEditEducation = () => {
    return (
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Add Education</SheetTitle>
                <SheetDescription>
                    Make changes to your profile here. Click save when you're
                    done.
                </SheetDescription>
            </SheetHeader>
            <div className="grid gap-2 p-4">
                <CustomInput
                    id="add-int"
                    label="Institute"
                    name="institution"
                    type="text"
                />
                <CustomInput
                    id="add-degg"
                    label="Degree"
                    name="degree"
                    type="text"
                />
                <CustomInput
                    id="add-start"
                    label="Starting Date"
                    name="startDate"
                    type="date"
                />
                <CustomInput
                    id="add-end"
                    label="End Date"
                    name="endDate"
                    type="date"
                />

                <Separator className="my-5" />
                <EducationCard />
            </div>

            <SheetFooter>
                <SheetClose asChild>
                    <Button type="submit">
                        <Plus /> Add
                    </Button>
                </SheetClose>
            </SheetFooter>
        </SheetContent>
    );
};

export default AddEditEducation;
