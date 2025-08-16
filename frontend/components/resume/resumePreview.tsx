import FirstTemplate from "@/lib/resumeTemplates/firstTemplate";
// Removed render import

const ResumePreview = () => {
    return (
        <div className="w-full bg-white rounded-md shadow border sticky top-36">
            <FirstTemplate />
        </div>
    );
};

export default ResumePreview;
