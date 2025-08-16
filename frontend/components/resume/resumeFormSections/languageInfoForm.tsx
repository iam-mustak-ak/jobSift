import CustomInput from "@/components/common/customInput";
import { Button } from "@/components/ui/button";
import { ResumeDataTypes, useResumeData, useSaveLoader } from "@/state/store";
import { debounce } from "@/utils/debounce";
import { saveResume } from "@/utils/saveResume";
import { Delete, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

const LanguageInfoForm = () => {
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

    const addLangues = () => {
        setResumeData({
            ...resumeData,
            languages: {
                ...resumeData.languages,

                langs: [
                    ...(resumeData.languages?.langs ?? []),
                    {
                        title: "",
                        experience: "Professional",
                    },
                ],
            },
        });

        const updatedInfo = {
            ...resumeData,
            languages: {
                ...resumeData.languages,

                langs: [
                    ...(resumeData.languages?.langs ?? []),
                    {
                        title: "",
                        experience: "Professional",
                    },
                ],
            },
        };

        debouncedSave(updatedInfo);
    };

    const updateLanguages = (
        i: number,
        e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        const updatedLanguages = [...(resumeData.languages?.langs ?? [])];

        if (!updatedLanguages[i]) {
            updatedLanguages[i] = {
                title: "",
                experience: "Professional",
            };
        }

        if (name === "title" || name === "experience") {
            updatedLanguages[i][name as "title" | "experience"] = value;
        }

        setResumeData({
            ...resumeData,
            languages: {
                ...resumeData.languages,

                langs: updatedLanguages,
            },
        });

        const updatedInfo = {
            ...resumeData,
            languages: {
                ...resumeData.languages,

                langs: updatedLanguages,
            },
        };

        debouncedSave(updatedInfo);
    };

    const handleDeleteLanguages = (i: number) => {
        const updatedLn =
            resumeData.languages?.langs.filter((v, idx) => idx !== i) ?? [];
        setResumeData({
            ...resumeData,
            languages: {
                ...resumeData.languages,

                langs: updatedLn,
            },
        });

        const updatedInfo = {
            ...resumeData,
            languages: {
                ...resumeData.languages,

                langs: updatedLn,
            },
        };

        debouncedSave(updatedInfo);
    };

    return (
        <>
            <div className="flex flex-col gap-3">
                {resumeData.languages?.langs.map((l, i) => (
                    <div key={i} className="flex items-end gap-5">
                        <CustomInput
                            label="Language"
                            id="lng"
                            type="text"
                            name="title"
                            placeholder="Enter a language"
                            onChange={(e) => updateLanguages(i, e)}
                            value={l.title}
                        />
                        <div className="w-auto">
                            <label
                                htmlFor="experience"
                                className="mb-2 block text-sm font-medium text-foreground"
                            >
                                Select Proficiency
                            </label>
                            <select
                                id="experience"
                                name="experience"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                onChange={(e) => updateLanguages(i, e)}
                                value={l.experience ?? "Professional"}
                            >
                                <option value="Professional">
                                    Professional
                                </option>
                                <option value="Native or Bilingual">
                                    Native or Bilingual
                                </option>
                                <option
                                    value="Working Proficiency
"
                                >
                                    Working Proficiency
                                </option>
                            </select>
                        </div>
                        <Button
                            variant="destructive"
                            className="cursor-pointer"
                            onClick={() => handleDeleteLanguages(i)}
                        >
                            <Delete />
                        </Button>
                    </div>
                ))}
            </div>

            <div>
                <div className="flex items-end gap-3">
                    <Button
                        onClick={addLangues}
                        variant="outline"
                        className="mt-4 cursor-pointer"
                    >
                        <Plus /> Add Language
                    </Button>
                </div>
            </div>
        </>
    );
};

export default LanguageInfoForm;
