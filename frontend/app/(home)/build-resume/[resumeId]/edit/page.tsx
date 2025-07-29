import ResumeBody from "@/components/resume/resumeBody";
import ResumeHeader from "@/components/resume/resumeHeader";

const Page = () => {
    return (
        <div className="px-10 mt-6 pt-16 pb-12 ">
            <div>
                <ResumeHeader />

                <ResumeBody />
            </div>
        </div>
    );
};

export default Page;
