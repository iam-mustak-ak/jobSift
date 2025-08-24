import CustomInput from "@/components/common/customInput";
import { Button } from "@/components/ui/button";
import { ResumeDataTypes, useResumeData, useSaveLoader } from "@/state/store";
import { debounce } from "@/utils/debounce";
import { saveResume } from "@/utils/saveResume";
import { Plus, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

const ReferencesInfoForm = () => {
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

    const addReferences = () => {
        setResumeData({
            ...resumeData,
            references: {
                ...resumeData.references,
                items: [
                    ...resumeData.references.items,
                    {
                        name: "",
                        position: "",
                        institute: "",
                        phone: "",
                        email: "",
                    },
                ],
            },
        });

        const updatedInfo = {
            ...resumeData,
            references: {
                ...resumeData.references,
                items: [
                    ...resumeData.references.items,
                    {
                        name: "",
                        position: "",
                        institute: "",
                        phone: "",
                        email: "",
                    },
                ],
            },
        };

        debouncedSave(updatedInfo);
    };

    const handleReferences = (
        i: number,
        e: React.ChangeEvent<
            HTMLSelectElement | HTMLInputElement | HTMLButtonElement
        >
    ) => {
        const { name, value } = e.target;

        const updatedReferences = [...(resumeData.references.items ?? [])];

        if (!updatedReferences[i]) {
            updatedReferences[i] = {
                name: "",
                position: "",
                institute: "",
                phone: "",
                email: "",
            };
        }

        updatedReferences[i][name as "name"] = value;
        setResumeData({
            ...resumeData,
            references: {
                ...resumeData.references,
                items: updatedReferences,
            },
        });

        const updatedInfo = {
            ...resumeData,
            references: {
                ...resumeData.references,
                items: updatedReferences,
            },
        };

        debouncedSave(updatedInfo);
    };

    const handleDelete = (i: number) => {
        const updatetdReferences = [...(resumeData.references.items ?? [])];
        const filtered = updatetdReferences.filter((v, idx) => idx != i);
        setResumeData({
            ...resumeData,
            references: {
                ...resumeData.references,
                items: filtered,
            },
        });

        const updatedInfo = {
            ...resumeData,
            references: {
                ...resumeData.references,
                items: filtered,
            },
        };

        debouncedSave(updatedInfo);
    };

    return (
        <>
            <div className="flex flex-col gap-3">
                {resumeData.references.items.map((v, i) => (
                    <div key={i} className="flex items-start gap-2">
                        <div className="border p-3 rounded-md">
                            <div className="flex text-end gap-4 mb-3">
                                <CustomInput
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Enter Reference name"
                                    label="Name"
                                    onChange={(e) => handleReferences(i, e)}
                                    value={v.name}
                                />

                                <CustomInput
                                    type="text"
                                    id="institute"
                                    name="institute"
                                    placeholder="Enter your institute"
                                    label="Institute/Company"
                                    onChange={(e) => handleReferences(i, e)}
                                    value={v.institute}
                                />
                                <CustomInput
                                    type="text"
                                    id="position"
                                    name="position"
                                    placeholder="Enter Reference position"
                                    label="Position"
                                    onChange={(e) => handleReferences(i, e)}
                                    value={v.position}
                                />
                            </div>

                            <CustomInput
                                type="text"
                                id="phone"
                                name="phone"
                                placeholder="phone"
                                label="Phone"
                                onChange={(e) => handleReferences(i, e)}
                                value={v.phone ?? ""}
                                className="mb-2"
                            />
                            <CustomInput
                                type="text"
                                id="email"
                                name="email"
                                placeholder="Email"
                                label="Email"
                                onChange={(e) => handleReferences(i, e)}
                                value={v.email ?? ""}
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
                    onClick={addReferences}
                    variant="outline"
                    className="cursor-pointer"
                >
                    <Plus />
                    Add Reference
                </Button>
            </div>
        </>
    );
};

export default ReferencesInfoForm;
