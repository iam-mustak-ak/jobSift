"use client";

import { ResumeDataTypes, useResumeData } from "@/state/store";
import { debounce } from "@/utils/debounce";
import { saveResume } from "@/utils/saveResume";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import CpInfoForm from "./resumeFormSections/cpInfoForm";
import EducationInfoForm from "./resumeFormSections/EducationInfoForm";
import ExperienceInfoForm from "./resumeFormSections/ExperienceInfoForm";
import InterestedInfoForm from "./resumeFormSections/interestedInfoForm";
import LanguageInfoForm from "./resumeFormSections/languageInfoForm";
import PersonalInfoForm from "./resumeFormSections/personalInfoForm";
import ProjectInfoForm from "./resumeFormSections/projectsInfoForm";
import ReferencesInfoForm from "./resumeFormSections/referencesInfoForm";
import ResearchesInfoForm from "./resumeFormSections/researchesInfoForm";
import SkillsInfoForm from "./resumeFormSections/SkillsInfoForm";
import { useParams } from "next/navigation";
import { useCallback } from "react";
import { useSaveLoader } from "@/state/store";
import { toast } from "sonner";

type EditableSectionKey =
    | "languages"
    | "interests"
    | "educations"
    | "experience"
    | "skills"
    | "projects"
    | "researches"
    | "cp"
    | "references";

const SectionTitleField = ({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) => (
    <label className="mb-4 block max-w-sm">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Heading shown on your resume
        </span>
        <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            maxLength={40}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
        />
    </label>
);

const ResumeForm: React.FC = () => {
    const resumeData = useResumeData((state) => state);
    const setResumeData = useResumeData((state) => state.setResumeData);
    const { setIsloading } = useSaveLoader((state) => state);
    const { resumeId } = useParams();
    const debouncedSave = useCallback(
        debounce(async (data: ResumeDataTypes) => {
            setIsloading(true);
            try {
                await saveResume(resumeId ?? "", data);
            } catch {
                toast.error("Could not save the section heading.");
            } finally {
                setIsloading(false);
            }
        }, 1000),
        [resumeId, setIsloading],
    );

    const updateSectionTitle = (section: EditableSectionKey, title: string) => {
        const updatedData = {
            ...resumeData,
            [section]: {
                ...(resumeData[section] ?? { items: [] }),
                title,
            },
        } as ResumeDataTypes;
        setResumeData(updatedData);
        debouncedSave(updatedData);
    };

    const sections = [
        { key: "languages", label: "Languages", title: resumeData.languages?.title ?? "Languages", form: <LanguageInfoForm /> },
        { key: "interests", label: "Interests", title: resumeData.interests?.title ?? "Interests", form: <InterestedInfoForm /> },
        { key: "educations", label: "Education", title: resumeData.educations?.title ?? "Education", form: <EducationInfoForm /> },
        { key: "experience", label: "Experience", title: resumeData.experience?.title ?? "Experience", form: <ExperienceInfoForm /> },
        { key: "skills", label: "Skills", title: resumeData.skills?.title ?? "Skills", form: <SkillsInfoForm /> },
        { key: "projects", label: "Projects", title: resumeData.projects?.title ?? "Projects", form: <ProjectInfoForm /> },
        { key: "researches", label: "Research & publications", title: resumeData.researches?.title ?? "Research & publications", form: <ResearchesInfoForm /> },
        { key: "cp", label: "Competitive programming", title: resumeData.cp?.title ?? "Competitive programming", form: <CpInfoForm /> },
        { key: "references", label: "References", title: resumeData.references?.title ?? "References", form: <ReferencesInfoForm /> },
    ] as const;

    return (
        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-700">Your content</p>
                <h2 className="mt-1 text-lg font-bold text-slate-950">Build your resume</h2>
                <p className="mt-1 text-sm leading-5 text-slate-500">Add the sections that fit your experience. Empty sections stay out of the finished resume.</p>
            </div>
            <Accordion type="single" collapsible defaultValue="personal">
                <AccordionItem value="personal" className="border-t-0">
                    <AccordionTrigger className="py-4 text-left text-sm font-semibold text-slate-800 hover:no-underline">
                        Personal details
                    </AccordionTrigger>
                    <AccordionContent className="pb-5">
                        <PersonalInfoForm />
                    </AccordionContent>
                </AccordionItem>

                {sections.map((section) => (
                    <AccordionItem key={section.key} value={section.key}>
                        <AccordionTrigger className="py-4 text-left text-sm font-semibold text-slate-800 hover:no-underline">
                            {section.label}
                        </AccordionTrigger>
                        <AccordionContent className="pb-5">
                            <SectionTitleField
                                value={section.title}
                                onChange={(title) => updateSectionTitle(section.key, title)}
                            />
                            {section.form}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default ResumeForm;
