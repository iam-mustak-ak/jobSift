"use client";
import {
    ResumeDataTypes,
    usePrintRef,
    useResumeData,
    useSaveLoader,
} from "@/state/store";
import { debounce } from "@/utils/debounce";
import { saveResume } from "@/utils/saveResume";
import {
    CloudUploadIcon,
    Download,
    LayoutPanelLeft,
    Loader2,
} from "lucide-react";
import { useParams } from "next/navigation";
import { ChangeEvent, useCallback } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";
import CustomSelect from "../common/customSelect";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const ResumeHeader: React.FC = () => {
    const { printRef } = usePrintRef((state) => state);

    const { setIsloading, isLoading } = useSaveLoader((state) => state);

    const { resumeId } = useParams();

    const resumeData = useResumeData((state) => state);
    const setResumeName = useResumeData((state) => state.setResumeData);
    const {
        about,
        educations,
        experience,
        image,
        interests,
        languages,
        name,
        resumeName,
        skills,
        socials,
        tagline,
        references,
        researches,
        projects,
        cp,
    } = useResumeData((state) => state);
    const reactToPrintFn = useReactToPrint({
        contentRef: printRef,
        documentTitle: resumeName ?? "Untitled",
    });
    const resumeFormData = {
        about,
        educations,
        experience,
        image,
        interests,
        languages,
        name,
        resumeName,
        skills,
        socials,
        tagline,
        references,
        researches,
        projects,
        cp,
    };

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

    const handleResumeName = (e: ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;

        setResumeName({
            ...resumeData,
            resumeName: newName,
        });

        const updatedData = { ...resumeData, resumeName: newName };

        debouncedSave(updatedData);
    };

    const handleSaveResume = async () => {
        setIsloading(true);
        try {
            await saveResume(resumeId ?? "", resumeFormData);
            toast.success("Resume Updated");
        } catch (error) {
            toast.error("Erro while saving");
        } finally {
            setIsloading(false);
        }
    };

    return (
        <div className="backdrop-blur-2xl bg-neutral-50 shadow-md py-5 px-10 z-10 sticky top-16">
            <div className="flex items-center justify-between">
                <div className="max-w-[20rem]">
                    <Input
                        className={`outline-0 border-0 shadow-none focus-visible:outline-0 focus-visible:border-0 focus-visible:ring-0 text-primary font-bold text-4xl w-fit`}
                        value={resumeName ?? ""}
                        onChange={handleResumeName}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Button onClick={handleSaveResume}>
                        {isLoading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <CloudUploadIcon />
                        )}
                    </Button>

                    <CustomSelect
                        name="templates"
                        placeholder="select a template"
                        options={["temp1", "temp-2"]}
                        icon={<LayoutPanelLeft />}
                        title="Templates"
                    />
                    {/* <CustomSelect
                        name="font"
                        placeholder="Font"
                        options={["Arial", "Times new Roman"]}
                        icon={<CaseSensitive />}
                        title="Font Family"
                    />
                    <CustomSelect
                        name="font-size"
                        placeholder="Font Size"
                        options={["XS", "M"]}
                        icon={<Type />}
                        title="Font Size"
                    /> */}
                    <Button onClick={reactToPrintFn}>
                        <Download />
                        Download
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ResumeHeader;
