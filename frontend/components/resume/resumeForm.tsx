"use client";

import { useResumeData } from "@/state/store";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion";
import EducationInfoForm from "./resumeFormSections/EducationInfoForm";
import ExperienceInfoForm from "./resumeFormSections/ExperienceInfoForm";
import InterestedInfoForm from "./resumeFormSections/interestedInfoForm";
import LanguageInfoForm from "./resumeFormSections/languageInfoForm";
import PersonalInfoForm from "./resumeFormSections/personalInfoForm";

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
                            value={resumeData.experience?.title ?? "Experience"}
                            type="text"
                            className="text-2xl font-bold text-muted-foreground outline-none border-none"
                        />
                    </AccordionTrigger>
                    <AccordionContent>
                        <ExperienceInfoForm />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default ResumeForm;
