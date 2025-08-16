import CustomInput from "@/components/common/customInput";
import { Button } from "@/components/ui/button";
import { ResumeDataTypes, useResumeData, useSaveLoader } from "@/state/store";
import { debounce } from "@/utils/debounce";
import { saveResume } from "@/utils/saveResume";
import { Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { FormEvent, useCallback, useState } from "react";
import { toast } from "sonner";

type Skill = {
    skill: string;
    experience: "Noob" | "Medium" | "Professional" | "Expert";
};

const SkillsInfoForm = () => {
    const [skills, setSkills] = useState<Skill>({
        skill: "",
        experience: "Noob",
    });
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

    const handleEnter = (e: FormEvent) => {
        e.preventDefault();
        if (!skills.skill) {
            return;
        }
        setResumeData({
            ...resumeData,
            skills: {
                ...resumeData.skills,
                items: [...(resumeData.skills.items ?? []), { ...skills }],
            },
        });

        const updatedInfo = {
            ...resumeData,
            skills: {
                ...resumeData.skills,
                items: [...(resumeData.skills.items ?? []), { ...skills }],
            },
        };

        debouncedSave(updatedInfo);

        setSkills({
            skill: "",
            experience: "Noob",
        });
    };

    const handleDelete = (i: number) => {
        const updatedSkills = [...(resumeData.skills.items ?? [])];
        const filtered = updatedSkills.filter((v, idx) => idx != i) ?? [];

        setResumeData({
            ...resumeData,
            skills: {
                ...resumeData.skills,
                items: filtered,
            },
        });
        const updatedInfo = {
            ...resumeData,
            skills: {
                ...resumeData.skills,
                items: filtered,
            },
        };

        debouncedSave(updatedInfo);
    };

    return (
        <form onSubmit={handleEnter}>
            <div className="flex items-start gap-4">
                <div className="w-full">
                    <CustomInput
                        type="text"
                        id="skill"
                        name="skill"
                        placeholder="Enter your skills"
                        label="Skill"
                        className="w-full"
                        value={skills.skill}
                        onChange={(e) =>
                            setSkills((prev) => ({
                                ...prev,
                                [e.target.name]: e.target.value,
                            }))
                        }
                    />

                    {resumeData.skills.items.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 mt-2">
                            {resumeData.skills.items.map((v, i) => (
                                <div
                                    key={i}
                                    className="flex items-center bg-primary rounded-full"
                                >
                                    <p className="py-1 px-4 pr-2  rounded-full inline text-sm bg-primary font-semibold text-white">
                                        {v.skill}
                                    </p>
                                    <Button
                                        type="button"
                                        className="rounded-full cursor-pointer"
                                        onClick={() => handleDelete(i)}
                                    >
                                        <Trash />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <div className="w-auto">
                        <label
                            htmlFor="experience"
                            className="mb-2 block text-sm font-medium text-foreground"
                        >
                            Experience
                        </label>
                        <select
                            id="experience"
                            name="experience"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={skills.experience}
                            onChange={(e) =>
                                setSkills((prev) => ({
                                    ...prev,
                                    [e.target.name]: e.target.value,
                                }))
                            }
                        >
                            <option value="Noob">Noob</option>
                            <option value="Medium">Medium</option>
                            <option value="Professional">Professional</option>
                            <option value="Expert">Expert</option>
                        </select>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default SkillsInfoForm;
