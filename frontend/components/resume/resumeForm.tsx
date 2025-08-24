"use client";

import { useResumeData } from "@/state/store";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion";
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

const ResumeForm: React.FC = () => {
    const resumeData = useResumeData((state) => state);
    const setResumeData = useResumeData((state) => state.setResumeData);

    return (
        <div className="w-full rounded-md shadow p-5 border">
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger className="cursor-pointer">
                        <input
                            onChange={() => {}}
                            type="text"
                            value="Personal Details"
                            readOnly
                            className="text-2xl font-bold text-muted-foreground outline-none border-none"
                        />
                    </AccordionTrigger>
                    <AccordionContent>
                        <PersonalInfoForm />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger className="cursor-pointer">
                        <input
                            onChange={(e) => {
                                setResumeData({
                                    ...resumeData,
                                    languages: {
                                        title: e.target.value,
                                        langs:
                                            resumeData.languages?.langs ?? [],
                                    },
                                });
                            }}
                            type="text"
                            value={resumeData.languages?.title ?? "Languages"}
                            readOnly
                            className="text-2xl font-bold text-muted-foreground outline-none border-none"
                        />
                    </AccordionTrigger>
                    <AccordionContent>
                        <LanguageInfoForm />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger className="cursor-pointer">
                        <input
                            onChange={(e) => {
                                setResumeData({
                                    ...resumeData,
                                    interests: {
                                        title: e.target.value,
                                        items:
                                            resumeData.interests?.items ?? "",
                                    },
                                });
                            }}
                            type="text"
                            readOnly
                            value={resumeData.interests?.title ?? "Interests"}
                            className="text-2xl font-bold text-muted-foreground outline-none border-none"
                        />
                    </AccordionTrigger>
                    <AccordionContent>
                        <InterestedInfoForm />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger className="cursor-pointer">
                        <input
                            onChange={(e) => {
                                setResumeData({
                                    ...resumeData,
                                    educations: {
                                        title: e.target.value,
                                        items:
                                            resumeData.educations?.items ?? [],
                                    },
                                });
                            }}
                            value={resumeData.educations?.title ?? "Education"}
                            type="text"
                            readOnly
                            className="text-2xl font-bold text-muted-foreground outline-none border-none"
                        />
                    </AccordionTrigger>
                    <AccordionContent>
                        <EducationInfoForm />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                    <AccordionTrigger className="cursor-pointer">
                        <input
                            onChange={(e) => {
                                setResumeData({
                                    ...resumeData,
                                    experience: {
                                        title: e.target.value,
                                        items:
                                            resumeData.experience?.items ?? [],
                                    },
                                });
                            }}
                            value={
                                resumeData.experience?.title ?? "Experiences"
                            }
                            type="text"
                            readOnly
                            className="text-2xl font-bold text-muted-foreground outline-none border-none"
                        />
                    </AccordionTrigger>
                    <AccordionContent>
                        <ExperienceInfoForm />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                    <AccordionTrigger className="cursor-pointer">
                        <input
                            onChange={(e) => {
                                setResumeData({
                                    ...resumeData,
                                    skills: {
                                        title: e.target.value,
                                        items: resumeData.skills?.items ?? [],
                                    },
                                });
                            }}
                            value={resumeData.skills.title ?? "Skills"}
                            type="text"
                            readOnly
                            className="text-2xl font-bold text-muted-foreground outline-none border-none"
                        />
                    </AccordionTrigger>
                    <AccordionContent>
                        <SkillsInfoForm />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-7">
                    <AccordionTrigger className="cursor-pointer">
                        <input
                            onChange={(e) => {
                                setResumeData({
                                    ...resumeData,
                                    projects: {
                                        title: e.target.value,
                                        items: resumeData.projects?.items ?? [],
                                    },
                                });
                            }}
                            value={resumeData.projects?.title ?? "Projects"}
                            type="text"
                            readOnly
                            className="text-2xl font-bold text-muted-foreground outline-none border-none"
                        />
                    </AccordionTrigger>
                    <AccordionContent>
                        <ProjectInfoForm />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-8">
                    <AccordionTrigger className="cursor-pointer">
                        <input
                            onChange={(e) => {
                                setResumeData({
                                    ...resumeData,
                                    researches: {
                                        title: e.target.value,
                                        items:
                                            resumeData.researches?.items ?? [],
                                    },
                                });
                            }}
                            value={resumeData.researches?.title ?? "Researches"}
                            type="text"
                            readOnly
                            className="text-2xl font-bold text-muted-foreground outline-none border-none"
                        />
                    </AccordionTrigger>
                    <AccordionContent>
                        <ResearchesInfoForm />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-9">
                    <AccordionTrigger className="cursor-pointer">
                        <input
                            onChange={(e) => {
                                setResumeData({
                                    ...resumeData,
                                    cp: {
                                        title: e.target.value,
                                        items: resumeData.cp?.items ?? [],
                                    },
                                });
                            }}
                            value={
                                resumeData.cp?.title ??
                                "Competitive Programming"
                            }
                            type="text"
                            readOnly
                            className="text-2xl font-bold text-muted-foreground outline-none border-none"
                        />
                    </AccordionTrigger>
                    <AccordionContent>
                        <CpInfoForm />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-10">
                    <AccordionTrigger className="cursor-pointer">
                        <input
                            onChange={(e) => {
                                setResumeData({
                                    ...resumeData,
                                    references: {
                                        title: e.target.value,
                                        items:
                                            resumeData.references?.items ?? [],
                                    },
                                });
                            }}
                            value={resumeData.references?.title ?? "References"}
                            type="text"
                            readOnly
                            className="text-2xl font-bold text-muted-foreground outline-none border-none"
                        />
                    </AccordionTrigger>
                    <AccordionContent>
                        <ReferencesInfoForm />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default ResumeForm;
