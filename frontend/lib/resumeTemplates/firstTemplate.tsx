"use client";
import LanguageCard from "@/components/resume/languageCard";
import ResumeSocial from "@/components/resume/resumeSocial";
import TemplatesTile from "@/components/resume/templatesTile";
import { Separator } from "@/components/ui/separator";
import { ResumeDataTypes, usePrintRef, useResumeData } from "@/state/store";
import Image from "next/image";
import { useEffect, useRef } from "react";

const FirstTemplate: React.FC = () => {
    const printRef = useRef<HTMLDivElement | null>(null);
    const { setPrintRef } = usePrintRef((state) => state);
    const {
        image,
        about,
        tagline,
        name,
        socials,
        languages,
        interests,
        educations,
        experience,
    } = useResumeData<ResumeDataTypes>((state) => state);

    useEffect(() => {
        setPrintRef(printRef);
    }, []);

    return (
        <div
            ref={printRef}
            className="flex items-start gap-5 max-h-[842px] py-5"
        >
            <div className="max-w-[250px] flex flex-col items-stretch w-full  p-5">
                <Image
                    src={image ? image : `/avatar-pl.jpg`}
                    width={200}
                    height={200}
                    alt="profile"
                    className="w-full max-w-[1050px] h-full max-h-[200px] rounded-full"
                />

                {Array.isArray(socials) && socials.length > 0 && (
                    <div className="mt-4">
                        <TemplatesTile title="Socials" />
                        <div className="flex flex-col gap-2 mt-4">
                            {socials.map((socialItem, i) => (
                                <ResumeSocial
                                    key={i}
                                    link="#"
                                    text={socialItem?.link}
                                    type={
                                        socialItem?.type as
                                            | "email"
                                            | "linkedin"
                                            | "github"
                                    }
                                />
                            ))}
                        </div>
                    </div>
                )}

                {languages?.langs && languages.langs.length > 0 && (
                    <div className="mt-4">
                        <div className="w-full mt-4">
                            <TemplatesTile
                                title={languages?.title ?? "Languages"}
                            />

                            <div className="mt-4">
                                {languages.langs.map((v, i) => (
                                    <LanguageCard
                                        key={i}
                                        language={v.title}
                                        status={
                                            v.experience as
                                                | "Professional"
                                                | "Working Proficiency"
                                                | "Native or Bilingual"
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {interests.items && (
                    <div className="mt-4">
                        <div className="w-full mt-4">
                            <TemplatesTile title={interests.title} />

                            <div className="mt-4 flex flex-col gap-2">
                                {interests.items.split(",").map((v, i) => (
                                    <div
                                        key={i}
                                        className="rounded-md border border-primary p-2"
                                    >
                                        <p className="text-xs">{v}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="w-full">
                {name || tagline || about ? (
                    <div className="w-full bg-primary p-5 mt-5">
                        <h2 className="text-2xl text-white font-bold">
                            {name}
                        </h2>
                        <h6 className="text-base text-white">{tagline}</h6>
                        <Separator className="h-0.5 bg-white w-full" />
                        {/* <p className="">{about}</p> */}
                        <div
                            className="text-sm text-white mt-3 leading-4 prose"
                            dangerouslySetInnerHTML={{ __html: about }}
                        ></div>
                    </div>
                ) : null}

                {educations.items.length > 0 && (
                    <div className="mt-5 pr-5">
                        <TemplatesTile title={educations.title} />

                        <div className="flex flex-col gap-3">
                            {educations.items.map((v, i) => (
                                <div key={i} className="mt-2">
                                    <h6 className="text-sm font-semibold text-primary">
                                        {v.degree}
                                    </h6>
                                    <p className="text-xs">{v.university}</p>
                                    <p className="text-xs text-primary">
                                        <span>
                                            {new Date(
                                                v.startingDate
                                            ).getFullYear()}
                                        </span>{" "}
                                        -{" "}
                                        {v.endingDate instanceof Date
                                            ? new Date(
                                                  v.endingDate
                                              ).getFullYear()
                                            : v.endingDate}
                                    </p>
                                    <p className="text-xs text-primary mt-1 underline mb-1">
                                        Major Courses
                                    </p>
                                    <ul className="text-xs list-disc pl-4">
                                        {v.courses.split(",").map((v, i) => (
                                            <li key={i}>{v}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {experience.items.length > 0 && (
                    <div className="mt-5 pr-5">
                        <TemplatesTile title={experience.title} />

                        <div className="flex flex-col gap-3">
                            {experience.items.map((v, i) => (
                                <div key={i} className="mt-2">
                                    <h6 className="text-sm font-semibold text-primary">
                                        {v.position}
                                    </h6>
                                    <p className="text-xs">{v.institute}</p>
                                    <p className="text-xs text-primary">
                                        <span>
                                            {new Date(
                                                v.startingDate
                                            ).getFullYear()}
                                        </span>{" "}
                                        -{" "}
                                        {v.endingDate instanceof Date
                                            ? new Date(
                                                  v.endingDate
                                              ).getFullYear()
                                            : v.endingDate}
                                    </p>
                                    <p className="text-xs text-primary mt-1 underline mb-1">
                                        Achivments
                                    </p>
                                    <ul className="text-xs list-disc pl-4">
                                        {v.achivments.split(",").map((v, i) => (
                                            <li key={i}>{v}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FirstTemplate;
