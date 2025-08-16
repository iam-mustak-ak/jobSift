import CustomInput from "@/components/common/customInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ResumeDataTypes, useResumeData, useSaveLoader } from "@/state/store";
import { debounce } from "@/utils/debounce";
import { saveResume } from "@/utils/saveResume";
import { Plus, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

const EducationInfoForm = () => {
    const resumeData = useResumeData((state) => state);
    const setResumeData = useResumeData((state) => state.setResumeData);

    const { setIsloading } = useSaveLoader((state) => state);
    const { resumeId } = useParams();

    const debouncedSave = useCallback(
        debounce(async (data: ResumeDataTypes) => {
            setIsloading(true);
            try {
                await saveResume(resumeId ?? "", data);
                toast.success("Resume Updated");
            } catch (error) {
                toast.error("Error while saving");
            } finally {
                setIsloading(false);
            }
        }, 1500),
        [resumeId]
    );
    const addEducations = () => {
        setResumeData({
            ...resumeData,
            educations: {
                ...resumeData.educations,
                items: [
                    ...resumeData.educations.items,
                    {
                        degree: "",
                        university: "",
                        startingDate: new Date(),
                        endingDate: new Date(),
                        courses: "",
                        location: "",
                    },
                ],
            },
        });

        const updatedInfo = {
            ...resumeData,
            educations: {
                ...resumeData.educations,
                items: [
                    ...resumeData.educations.items,
                    {
                        degree: "",
                        university: "",
                        startingDate: new Date(),
                        endingDate: new Date(),
                        courses: "",
                        location: "",
                    },
                ],
            },
        };

        debouncedSave(updatedInfo);
    };

    const handleEducations = (
        i: number,
        e: React.ChangeEvent<
            HTMLSelectElement | HTMLInputElement | HTMLButtonElement
        >
    ) => {
        const { name, value } = e.target;

        const updatedEducations = [...(resumeData.educations.items ?? [])];

        if (!updatedEducations[i]) {
            updatedEducations[i] = {
                degree: "",
                university: "",
                startingDate: new Date(),
                endingDate: new Date(),
                courses: "",
                location: "",
            };
        }

        updatedEducations[i][name as "degree"] = value;
        setResumeData({
            ...resumeData,
            educations: {
                ...resumeData.educations,
                items: updatedEducations,
            },
        });

        const updatedInfo = {
            ...resumeData,
            educations: {
                ...resumeData.educations,
                items: updatedEducations,
            },
        };

        debouncedSave(updatedInfo);
    };

    const handleEndingDate = (i: number, v: boolean) => {
        const updatedEducations = [...(resumeData.educations.items ?? [])];

        if (v) {
            updatedEducations[i]["endingDate"] = "Present";
        } else {
            updatedEducations[i]["endingDate"] = new Date();
        }
        setResumeData({
            ...resumeData,
            educations: {
                ...resumeData.educations,
                items: updatedEducations,
            },
        });

        const updatedInfo = {
            ...resumeData,
            educations: {
                ...resumeData.educations,
                items: updatedEducations,
            },
        };

        debouncedSave(updatedInfo);
    };

    const handleDelete = (i: number) => {
        const updatedEducations = [...(resumeData.educations.items ?? [])];
        const filtered = updatedEducations.filter((v, idx) => idx != i);
        setResumeData({
            ...resumeData,
            educations: {
                ...resumeData.educations,
                items: filtered,
            },
        });

        const updatedInfo = {
            ...resumeData,
            educations: {
                ...resumeData.educations,
                items: filtered,
            },
        };

        debouncedSave(updatedInfo);
    };

    return (
        <>
            <div className="flex flex-col gap-3">
                {resumeData.educations.items.map((v, i) => (
                    <div key={i} className="flex items-start gap-2">
                        <div className="border p-3 rounded-md">
                            <div className="flex text-end gap-4 mb-3">
                                <CustomInput
                                    type="text"
                                    id="degree"
                                    name="degree"
                                    placeholder="Enter your degree"
                                    label="Degree"
                                    onChange={(e) => handleEducations(i, e)}
                                    value={v.degree}
                                />
                                <CustomInput
                                    type="text"
                                    id="university"
                                    name="university"
                                    placeholder="Enter your University"
                                    label="University"
                                    onChange={(e) => handleEducations(i, e)}
                                    value={v.university}
                                />
                                <div>
                                    <Label>Starting Date</Label>
                                    <Input
                                        type="date"
                                        className="mt-3"
                                        name="startingDate"
                                        onChange={(e) => handleEducations(i, e)}
                                        value={
                                            v.startingDate
                                                ? new Date(v.startingDate)
                                                      .toISOString()
                                                      .split("T")[0]
                                                : v.startingDate
                                        }
                                    />
                                </div>
                                <div className="flex items-start">
                                    <div>
                                        <Label>Ending Date</Label>
                                        {v.endingDate &&
                                        v.endingDate !== "Present" ? (
                                            <Input
                                                type="date"
                                                className="mt-3"
                                                name="endingDate"
                                                onChange={(e) =>
                                                    handleEducations(i, e)
                                                }
                                                value={
                                                    new Date(v.endingDate)
                                                        .toISOString()
                                                        .split("T")[0]
                                                }
                                            />
                                        ) : (
                                            <p className="w-full px-4 py-2 border rounded-md mt-3">
                                                Present
                                            </p>
                                        )}
                                    </div>

                                    <div className="">
                                        <Label htmlFor="running">Running</Label>
                                        <Switch
                                            id="running"
                                            className="mt-3"
                                            name="running"
                                            checked={v.endingDate === "Present"}
                                            onCheckedChange={(v) =>
                                                handleEndingDate(i, v)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <CustomInput
                                type="text"
                                id="location"
                                name="location"
                                placeholder="Location"
                                label="Location"
                                onChange={(e) => handleEducations(i, e)}
                                value={v.location ?? ""}
                                className="mb-2"
                            />
                            <CustomInput
                                type="text"
                                id="courses"
                                name="courses"
                                placeholder="Enter your Major courses (comma separeted)"
                                label="Courses"
                                onChange={(e) => handleEducations(i, e)}
                                value={v.courses ?? ""}
                            />
                        </div>
                        <Button
                            onClick={() => handleDelete(i)}
                            variant="destructive"
                            className="mb-2 "
                        >
                            <Trash />
                        </Button>
                    </div>
                ))}
            </div>
            <div className="mt-4">
                <Button
                    onClick={addEducations}
                    variant="outline"
                    className="cursor-pointer"
                >
                    <Plus />
                    Add Eduations
                </Button>
            </div>
        </>
    );
};

export default EducationInfoForm;
