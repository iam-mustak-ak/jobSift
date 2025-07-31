"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion";
import EducationInfoForm from "./resumeFormSections/EducationInfoForm";
import PersonalInfoForm from "./resumeFormSections/personalInfoForm";

const ResumeForm: React.FC = () => {
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
                            onChange={() => {}}
                            type="text"
                            value="Education"
                            className="text-2xl font-bold text-muted-foreground outline-none border-none"
                        />
                    </AccordionTrigger>
                    <AccordionContent>
                        <EducationInfoForm />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default ResumeForm;
