import CustomInput from "@/components/common/customInput";
import { Button } from "@/components/ui/button";
import { useResumeData } from "@/state/store";
import { Trash } from "lucide-react";
import { FormEvent, useState } from "react";

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
