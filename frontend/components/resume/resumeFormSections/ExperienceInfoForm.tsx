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

const ExperienceInfoForm = () => {
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

    const addExperience = () => {
        setResumeData({
            ...resumeData,
            experience: {
                ...resumeData.experience,
                items: [
                    ...resumeData.experience.items,
                    {
                        position: "",
                        institute: "",
                        startingDate: new Date(),
                        endingDate: new Date(),
                        achivments: "",
                        location: "",
                    },
                ],
            },
        });

        const updatedInfo = {
            ...resumeData,
            experience: {
                ...resumeData.experience,
                items: [
                    ...resumeData.experience.items,
                    {
                        position: "",
                        institute: "",
                        startingDate: new Date(),
                        endingDate: new Date(),
                        achivments: "",
                        location: "",
                    },
                ],
            },
        };

        debouncedSave(updatedInfo);
    };

    const handleExperience = (
        i: number,
        e: React.ChangeEvent<
            HTMLSelectElement | HTMLInputElement | HTMLButtonElement
        >
    ) => {
        const { name, value } = e.target;

        const updatedExperience = [...(resumeData.experience.items ?? [])];

        if (!updatedExperience[i]) {
            updatedExperience[i] = {
                position: "",
                institute: "",
                startingDate: new Date(),
                endingDate: new Date(),
                achivments: "",
                location: "",
            };
        }

        updatedExperience[i][name as "position"] = value;
        setResumeData({
            ...resumeData,
            experience: {
                ...resumeData.experience,
                items: updatedExperience,
            },
        });

        const updatedInfo = {
            ...resumeData,
            experience: {
                ...resumeData.experience,
                items: updatedExperience,
            },
        };

        debouncedSave(updatedInfo);
    };

    const handleEndingDate = (i: number, v: boolean) => {
        const updatedtExperience = [...(resumeData.experience.items ?? [])];

        if (v) {
            updatedtExperience[i]["endingDate"] = "Present";
        } else {
            updatedtExperience[i]["endingDate"] = new Date();
        }
        setResumeData({
            ...resumeData,
            experience: {
                ...resumeData.experience,
                items: updatedtExperience,
            },
        });

        const updatedInfo = {
            ...resumeData,
            experience: {
                ...resumeData.experience,
                items: updatedtExperience,
            },
        };

        debouncedSave(updatedInfo);
    };

    const handleDelete = (i: number) => {
        const updatedtExperience = [...(resumeData.experience.items ?? [])];
        const filtered = updatedtExperience.filter((v, idx) => idx != i);
        setResumeData({
            ...resumeData,
            experience: {
                ...resumeData.experience,
                items: filtered,
            },
        });

        const updatedInfo = {
            ...resumeData,
            experience: {
                ...resumeData.experience,
                items: filtered,
            },
        };

        debouncedSave(updatedInfo);
    };

    return (
        <>
            <div className="flex flex-col gap-3">
                {resumeData.experience.items.map((v, i) => (
                    <div key={i} className="flex items-start gap-2">
                        <div className="border p-3 rounded-md">
                            <div className="flex text-end gap-4 mb-3">
                                <CustomInput
                                    type="text"
                                    id="position"
                                    name="position"
                                    placeholder="Enter your position"
                                    label="Position"
                                    onChange={(e) => handleExperience(i, e)}
                                    value={v.position}
                                />
                                <CustomInput
                                    type="text"
                                    id="institute"
                                    name="institute"
                                    placeholder="Enter your institute"
                                    label="Institute/Company"
                                    onChange={(e) => handleExperience(i, e)}
                                    value={v.institute}
                                />
                                <div>
                                    <Label>Starting Date</Label>
                                    <Input
                                        type="date"
                                        className="mt-3"
                                        name="startingDate"
                                        onChange={(e) => handleExperience(i, e)}
                                        value={
                                            v.startingDate instanceof Date
                                                ? v.startingDate
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
                                                    handleExperience(i, e)
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
                                onChange={(e) => handleExperience(i, e)}
                                value={v.location ?? ""}
                                className="mb-2"
                            />
                            <CustomInput
                                type="text"
                                id="achivments"
                                name="achivments"
                                placeholder="Enter your Major achivments (comma separeted)"
                                label="Achivments"
                                onChange={(e) => handleExperience(i, e)}
                                value={v.achivments ?? ""}
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
                    onClick={addExperience}
                    variant="outline"
                    className="cursor-pointer"
                >
                    <Plus />
                    Add Experience
                </Button>
            </div>
        </>
    );
};

export default ExperienceInfoForm;
