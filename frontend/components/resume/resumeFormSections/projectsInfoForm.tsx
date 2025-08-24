import CustomInput from "@/components/common/customInput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ResumeDataTypes, useResumeData, useSaveLoader } from "@/state/store";
import { debounce } from "@/utils/debounce";
import { saveResume } from "@/utils/saveResume";
import { Plus, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

const ProjectInfoForm = () => {
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

    const addProjects = () => {
        setResumeData({
            ...resumeData,
            projects: {
                ...resumeData.projects,
                items: [
                    ...resumeData.projects.items,
                    {
                        title: "",
                        description: "",
                        livelink: "",
                        codelink: "",
                    },
                ],
            },
        });

        const updatedInfo = {
            ...resumeData,
            projects: {
                ...resumeData.projects,
                items: [
                    ...resumeData.projects.items,
                    {
                        title: "",
                        description: "",
                        livelink: "",
                        codelink: "",
                    },
                ],
            },
        };

        debouncedSave(updatedInfo);
    };

    const handleProjects = (
        i: number,
        e: React.ChangeEvent<
            | HTMLSelectElement
            | HTMLInputElement
            | HTMLButtonElement
            | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;

        const updatedProjects = [...(resumeData.projects.items ?? [])];

        if (!updatedProjects[i]) {
            updatedProjects[i] = {
                title: "",
                description: "",
                livelink: "",
                codelink: "",
            };
        }

        updatedProjects[i][name as "title"] = value;
        setResumeData({
            ...resumeData,
            projects: {
                ...resumeData.projects,
                items: updatedProjects,
            },
        });

        const updatedInfo = {
            ...resumeData,
            projects: {
                ...resumeData.projects,
                items: updatedProjects,
            },
        };

        debouncedSave(updatedInfo);
    };

    const handleDelete = (i: number) => {
        const updatedtProjects = [...(resumeData.projects.items ?? [])];
        const filtered = updatedtProjects.filter((v, idx) => idx != i);
        setResumeData({
            ...resumeData,
            projects: {
                ...resumeData.projects,
                items: filtered,
            },
        });

        const updatedInfo = {
            ...resumeData,
            projects: {
                ...resumeData.projects,
                items: filtered,
            },
        };

        debouncedSave(updatedInfo);
    };

    return (
        <>
            <div className="flex flex-col gap-3">
                {resumeData.projects.items.map((v, i) => (
                    <div key={i} className="flex items-start gap-2">
                        <div className="border w-full p-3 rounded-md">
                            <CustomInput
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Enter Project title"
                                label="Title"
                                onChange={(e) => handleProjects(i, e)}
                                value={v.title}
                                className="mb-2"
                            />

                            <div className="w-full">
                                <Label
                                    htmlFor="description"
                                    className="text-sm font-medium"
                                >
                                    Description
                                </Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    placeholder="Enter Project description"
                                    onChange={(e) => handleProjects(i, e)}
                                    value={v.description}
                                    className="border rounded-md p-2 w-full my-2"
                                    rows={5}
                                ></textarea>
                            </div>

                            <CustomInput
                                type="text"
                                id="livelink"
                                name="livelink"
                                placeholder="Provide live project link"
                                label="Live Link"
                                onChange={(e) => handleProjects(i, e)}
                                value={v.livelink ?? ""}
                                className="mb-2"
                            />
                            <CustomInput
                                type="text"
                                id="codelink"
                                name="codelink"
                                placeholder="Enter github link"
                                label="Code Link"
                                onChange={(e) => handleProjects(i, e)}
                                value={v.codelink ?? ""}
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
                    onClick={addProjects}
                    variant="outline"
                    className="cursor-pointer"
                >
                    <Plus />
                    Add Projects
                </Button>
            </div>
        </>
    );
};

export default ProjectInfoForm;
