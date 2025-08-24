import CustomInput from "@/components/common/customInput";
import { Button } from "@/components/ui/button";
import { ResumeDataTypes, useResumeData, useSaveLoader } from "@/state/store";
import { debounce } from "@/utils/debounce";
import { saveResume } from "@/utils/saveResume";
import { Plus, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

const CpInfoForm = () => {
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

    const addPlatform = () => {
        setResumeData({
            ...resumeData,
            cp: {
                ...resumeData.cp,
                items: [
                    ...resumeData.cp.items,
                    {
                        platform: "",
                        rating: 0,
                        username: "",
                    },
                ],
            },
        });

        const updatedInfo = {
            ...resumeData,
            cp: {
                ...resumeData.cp,
                items: [
                    ...resumeData.cp.items,
                    {
                        platform: "",
                        rating: 0,
                        username: "",
                    },
                ],
            },
        };

        debouncedSave(updatedInfo);
    };

    const handlecp = (
        i: number,
        e: React.ChangeEvent<
            HTMLSelectElement | HTMLInputElement | HTMLButtonElement
        >
    ) => {
        const { name, value } = e.target;

        const updatedcp = [...(resumeData.cp.items ?? [])];

        if (!updatedcp[i]) {
            updatedcp[i] = {
                platform: "",
                rating: 0,
                username: "",
            };
        }

        updatedcp[i][name as "platform"] = value;
        setResumeData({
            ...resumeData,
            cp: {
                ...resumeData.cp,
                items: updatedcp,
            },
        });

        const updatedInfo = {
            ...resumeData,
            cp: {
                ...resumeData.cp,
                items: updatedcp,
            },
        };

        debouncedSave(updatedInfo);
    };

    const handleDelete = (i: number) => {
        const updatetdcp = [...(resumeData.cp.items ?? [])];
        const filtered = updatetdcp.filter((v, idx) => idx != i);
        setResumeData({
            ...resumeData,
            cp: {
                ...resumeData.cp,
                items: filtered,
            },
        });

        const updatedInfo = {
            ...resumeData,
            cp: {
                ...resumeData.cp,
                items: filtered,
            },
        };

        debouncedSave(updatedInfo);
    };

    return (
        <>
            <div className="flex flex-col gap-3">
                {resumeData.cp.items.map((v, i) => (
                    <div key={i} className="flex items-start gap-2">
                        <div className="border p-3 rounded-md">
                            <div className="flex text-end gap-4 mb-3">
                                <CustomInput
                                    type="text"
                                    id="platform"
                                    name="platform"
                                    placeholder="Enter platform name"
                                    label="Platform"
                                    onChange={(e) => handlecp(i, e)}
                                    value={v.platform}
                                />

                                <CustomInput
                                    type="number"
                                    id="institute"
                                    name="rating"
                                    placeholder="Enter rating"
                                    label="Rating"
                                    onChange={(e) => handlecp(i, e)}
                                    value={String(v.rating)}
                                />
                                <CustomInput
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="Enter Reference username"
                                    label="Username"
                                    onChange={(e) => handlecp(i, e)}
                                    value={v.username}
                                />
                            </div>
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
                    onClick={addPlatform}
                    variant="outline"
                    className="cursor-pointer"
                >
                    <Plus />
                    Add Platform
                </Button>
            </div>
        </>
    );
};

export default CpInfoForm;
