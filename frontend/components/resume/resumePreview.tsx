import FirstTemplate from "@/lib/resumeTemplates/firstTemplate";
import MinimalTemplate from "@/lib/resumeTemplates/minimalTemplate";
import ModernTemplate from "@/lib/resumeTemplates/modernTemplate";
import { useResumeData } from "@/state/store";

const ResumePreview = () => {
    const templateId = useResumeData((state) => state.templateId);

    return (
        <div className="min-h-[800px] w-full bg-white">
            {templateId === "modern" ? (
                <ModernTemplate />
            ) : templateId === "minimal" ? (
                <MinimalTemplate />
            ) : (
                <FirstTemplate />
            )}
        </div>
    );
};

export default ResumePreview;
