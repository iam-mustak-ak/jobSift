import ResumeForm from "./resumeForm";
import ResumePreview from "./resumePreview";

const ResumeBody: React.FC = () => {
    return (
        <div className="flex items-start justify-center gap-5 mt-5">
            <ResumeForm />

            <ResumePreview />
        </div>
    );
};

export default ResumeBody;
