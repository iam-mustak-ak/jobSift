import CustomInput from "@/components/common/customInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResumeDataTypes, useResumeData, useSaveLoader } from "@/state/store";
import { debounce } from "@/utils/debounce";
import { saveResume } from "@/utils/saveResume";
import { Plus, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

const ResearchesInfoForm = () => {
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

    const addResearch = () => {
        setResumeData({
            ...resumeData,
            researches: {
                ...resumeData.researches,
                items: [
                    ...resumeData.researches.items,
                    {
                        title: "",
                        yearofpublish: new Date(),
                        publisher: "",
                        link: "",
                    },
                ],
            },
        });

        const updatedInfo = {
            ...resumeData,
            researches: {
                ...resumeData.researches,
                items: [
                    ...resumeData.researches.items,
                    {
                        title: "",
                        yearofpublish: new Date(),
                        publisher: "",
                        link: "",
                    },
                ],
            },
        };

        debouncedSave(updatedInfo);
    };

    const handleResearch = (
        i: number,
        e: React.ChangeEvent<
            HTMLSelectElement | HTMLInputElement | HTMLButtonElement
        >
    ) => {
        const { name, value } = e.target;

        const updatedtResearch = [...(resumeData.researches.items ?? [])];

        if (!updatedtResearch[i]) {
            updatedtResearch[i] = {
                title: "",
                yearofpublish: new Date(),
                publisher: "",
                link: "",
            };
        }

        updatedtResearch[i][name as "title"] = value;
        setResumeData({
            ...resumeData,
            researches: {
                ...resumeData.researches,
                items: updatedtResearch,
            },
        });

        const updatedInfo = {
            ...resumeData,
            researches: {
                ...resumeData.researches,
                items: updatedtResearch,
            },
        };

        debouncedSave(updatedInfo);
    };

    const handleDelete = (i: number) => {
        const updatetdResearch = [...(resumeData.researches.items ?? [])];
        const filtered = updatetdResearch.filter((v, idx) => idx != i);
        setResumeData({
            ...resumeData,
            researches: {
                ...resumeData.researches,
                items: filtered,
            },
        });

        const updatedInfo = {
            ...resumeData,
            researches: {
                ...resumeData.researches,
                items: filtered,
            },
        };

        debouncedSave(updatedInfo);
    };

    return (
        <>
            <div className="flex flex-col gap-3">
                {resumeData.researches.items.map((v, i) => (
                    <div key={i} className="flex items-start gap-2">
                        <div className="border p-3 rounded-md">
                            <div className="flex text-end gap-4 mb-3">
                                <CustomInput
                                    type="text"
                                    id="title"
                                    name="title"
                                    placeholder="Enter your research title"
                                    label="Title"
                                    onChange={(e) => handleResearch(i, e)}
                                    value={v.title}
                                />
                                <div>
                                    <Label>Year of Publish</Label>
                                    <Input
                                        type="date"
                                        className="mt-3"
                                        name="yearofpublish"
                                        onChange={(e) => handleResearch(i, e)}
                                        value={
                                            v.yearofpublish instanceof Date
                                                ? v.yearofpublish
                                                      .toISOString()
                                                      .split("T")[0]
                                                : v.yearofpublish
                                        }
                                    />
                                </div>
                            </div>
                            <CustomInput
                                type="text"
                                id="publisher"
                                name="publisher"
                                placeholder="Enter Publisher name"
                                label="Publisher"
                                onChange={(e) => handleResearch(i, e)}
                                value={v.publisher}
                            />
                            <CustomInput
                                type="text"
                                id="link"
                                name="link"
                                placeholder="link"
                                label="Link"
                                onChange={(e) => handleResearch(i, e)}
                                value={v.link ?? ""}
                                className="mb-2"
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
                    onClick={addResearch}
                    variant="outline"
                    className="cursor-pointer"
                >
                    <Plus />
                    Add Research
                </Button>
            </div>
        </>
    );
};

export default ResearchesInfoForm;
