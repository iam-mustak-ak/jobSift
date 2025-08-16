"use client";
import { usePrintRef, useResumeData } from "@/state/store";
import {
    CaseSensitive,
    CloudUploadIcon,
    Download,
    LayoutPanelLeft,
    Loader2,
    Type,
} from "lucide-react";
import { useParams } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";
import CustomSelect from "../common/customSelect";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const ResumeHeader: React.FC = () => {
    const { printRef } = usePrintRef((state) => state);
    const [loading, setLoading] = useState<boolean>(false);

    const reactToPrintFn = useReactToPrint({ contentRef: printRef });
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
    } = useResumeData((state) => state);

    const handleResumeName = (e: ChangeEvent<HTMLInputElement>) => {
        setResumeName({
            ...resumeData,
            resumeName: e.target.value,
        });
    };

    const handleSaveResume = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/resume/save-resume/${resumeId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
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
                    }),
                }
            );

            const result = await response.json();

            console.log(result);

            if (!response.ok) {
                return toast.error("Saving Error Occured");
            }

            toast.success("Resume Updated");
        } catch (error) {
            toast.error("Erro while saving");
        } finally {
            setLoading(false);
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
                        {loading ? (
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
                    <CustomSelect
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
                    />
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
