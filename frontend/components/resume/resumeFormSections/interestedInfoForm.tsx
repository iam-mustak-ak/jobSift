import CustomInput from "@/components/common/customInput";
import { useResumeData } from "@/state/store";

const InterestedInfoForm = () => {
    const resumeData = useResumeData((state) => state);
    const setResumeData = useResumeData((state) => state.setResumeData);
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
