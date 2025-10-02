import { useAuthStore } from "@/state/store";
import { Plus, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import CustomInput from "../common/customInput";
import EducationCard from "../common/educationCard";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "../ui/sheet";

type Education = {
    degree: string;
    institution: string;
    startDate: string;
    endDate: string;
};

const AddEditEducation = () => {
    const { setAuth, user } = useAuthStore((state) => state);

    const [formData, setFormData] = useState<Education>({
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
    });
    const [loading, setLoading] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null); // 🔥 track edit

    // handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // save to DB + Zustand
    const updateUserEducations = async (updatedList: Education[]) => {
        const updatedUser = { ...user, educations: updatedList };
        setAuth(updatedUser);

        await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/update-profile`,
            {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedUser),
            }
        );
    };

    // handle Add or Update
    const handleSave = async () => {
        setLoading(true);
        try {
            if (!formData.degree || !formData.institution) {
                toast.error("Please fill all required fields");
                return;
            }

            let updatedList: Education[];

            if (editingIndex !== null) {
                // 🔥 update existing
                updatedList = user?.educations.map(
                    (edu: Education, i: number) =>
                        i === editingIndex ? formData : edu
                );
                toast.success("Education updated!");
            } else {
                // 🔥 add new
                updatedList = [...(user?.educations || []), formData];
                toast.success("Education added!");
            }

            await updateUserEducations(updatedList);

            // reset form
            setFormData({
                degree: "",
                institution: "",
                startDate: "",
                endDate: "",
            });
            setEditingIndex(null);
        } catch (err) {
            toast.error("Something went wrong");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // handle Remove
    const handleRemove = async (index: number) => {
        try {
            const updatedList = user?.educations.filter(
                (_: Education, i: number) => i !== index
            );
            await updateUserEducations(updatedList);
            toast.success("Education removed!");
        } catch (err) {
            toast.error("Failed to remove education");
            console.error(err);
        }
    };

    // handle Edit → load data into form
    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setFormData(user?.educations[index]);
    };

    return (
        <SheetContent>
            <SheetHeader>
                <SheetTitle>
                    {editingIndex !== null ? "Edit Education" : "Add Education"}
                </SheetTitle>
                <SheetDescription>
                    Make changes to your profile here. Click save when done.
                </SheetDescription>
            </SheetHeader>

            <div className="grid gap-2 p-4">
                <CustomInput
                    id="add-int"
                    label="Institute"
                    name="institution"
                    type="text"
                    value={formData.institution}
                    onChange={handleChange}
                />
                <CustomInput
                    id="add-deg"
                    label="Degree"
                    name="degree"
                    type="text"
                    value={formData.degree}
                    onChange={handleChange}
                />
                <CustomInput
                    id="add-start"
                    label="Starting Date"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                />
                <CustomInput
                    id="add-end"
                    label="End Date"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                />

                <Separator className="my-5" />

                {/* render list */}
                <div className="space-y-3">
                    {user?.educations?.map((edu: Education, i: number) => (
                        <EducationCard
                            key={i}
                            data={edu}
                            onRemove={() => handleRemove(i)}
                            onEdit={() => handleEdit(i)} // 🔥 add edit
                        />
                    ))}
                </div>
            </div>

            <SheetFooter>
                <Button type="button" onClick={handleSave} disabled={loading}>
                    {editingIndex !== null ? <Save /> : <Plus />}
                    {editingIndex !== null ? " Update" : " Add"}
                </Button>
            </SheetFooter>
        </SheetContent>
    );
};

export default AddEditEducation;
