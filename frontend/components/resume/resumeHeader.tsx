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
    Loader2,
    LayoutTemplate,
    Palette,
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
        themeColor,
        fontFamily,
        templateId,
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
        themeColor,
        fontFamily,
        templateId,
    };

    const debouncedSave = useCallback(
        debounce(async (data: ResumeDataTypes) => {
            setIsloading(true);
            try {
                await saveResume(resumeId ?? "", data);
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

    const handleDesignChange = (field: "themeColor" | "fontFamily" | "templateId", value: string) => {
        const updatedData = { ...resumeData, [field]: value } as ResumeDataTypes;
        setResumeName(updatedData);
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
        <div className="sticky top-16 z-30 border-b border-slate-200/80 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-[1600px] flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0 xl:max-w-[22rem]">
                    <Input
                        aria-label="Resume name"
                        className="h-11 w-full border-transparent bg-transparent px-2 text-xl font-bold text-slate-900 shadow-none focus-visible:border-violet-200 focus-visible:bg-white focus-visible:ring-violet-100 sm:text-2xl"
                        value={resumeName ?? ""}
                        onChange={handleResumeName}
                    />
                    <p className="px-2 text-xs text-slate-500">Your changes save automatically</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                    <label className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm">
                        <LayoutTemplate className="h-4 w-4 text-violet-600" />
                        <select
                            aria-label="Resume template"
                            value={templateId || "classic"}
                            onChange={(event) => handleDesignChange("templateId", event.target.value)}
                            className="max-w-28 cursor-pointer bg-transparent text-sm outline-none"
                        >
                            <option value="classic">Classic</option>
                            <option value="modern">Modern</option>
                            <option value="minimal">Minimal</option>
                        </select>
                    </label>
                    <label className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm" title="Choose resume accent color">
                        <Palette className="h-4 w-4 text-violet-600" />
                        <span className="hidden sm:inline">Accent</span>
                        <input
                            aria-label="Resume accent color"
                            type="color"
                            value={themeColor || "#6d28d9"}
                            onChange={(event) => handleDesignChange("themeColor", event.target.value)}
                            className="h-6 w-7 cursor-pointer rounded border-0 bg-transparent p-0"
                        />
                    </label>
                    <CustomSelect
                        name="resume-font"
                        placeholder="Font"
                        options={["Arial", "Georgia", "Times New Roman", "Verdana"]}
                        value={fontFamily || "Arial"}
                        onChangeValue={(value) => handleDesignChange("fontFamily", value)}
                        className="h-10 w-[150px] rounded-xl border-slate-200 bg-white text-slate-700 shadow-sm"
                    />
                    <Button className="h-10 rounded-xl" variant="outline" onClick={handleSaveResume}>
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <CloudUploadIcon className="h-4 w-4" />
                        )}
                        <span className="hidden sm:inline">Save now</span>
                    </Button>

                    <Button className="h-10 rounded-xl bg-violet-700 hover:bg-violet-800" onClick={reactToPrintFn}>
                        <Download className="h-4 w-4" />
                        Download
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ResumeHeader;
