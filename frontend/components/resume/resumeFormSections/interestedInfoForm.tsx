import CustomInput from "@/components/common/customInput";
import { ResumeDataTypes, useResumeData, useSaveLoader } from "@/state/store";
import { debounce } from "@/utils/debounce";
import { saveResume } from "@/utils/saveResume";
import { useParams } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

const InterestedInfoForm = () => {
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

    const handleInterts = (
        e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
    ) => {
        const { value } = e.target;

        setResumeData({
            ...resumeData,
            interests: {
                title: resumeData.interests.title ?? "",
                items: value,
            },
        });

        const updatedInfo = {
            ...resumeData,
            interests: {
                title: resumeData.interests.title ?? "",
                items: value,
            },
        };

        debouncedSave(updatedInfo);
    };

    return (
        <>
            <div className="w-full">
                <CustomInput
                    type="text"
                    id="interest"
                    label="Interest"
                    placeholder="Enter you interest (Comma separeted)"
                    className="w-full"
                    onChange={handleInterts}
                    value={resumeData.interests.items ?? ""}
                />
            </div>
        </>
    );
};

export default InterestedInfoForm;
