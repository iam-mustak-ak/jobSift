"use client";
import LanguageCard from "@/components/resume/languageCard";
import ResumeSocial from "@/components/resume/resumeSocial";
import TemplatesTile from "@/components/resume/templatesTile";
import { Separator } from "@/components/ui/separator";
import { usePrintRef } from "@/state/store";
import Image from "next/image";
import { useEffect, useRef } from "react";

const FirstTemplate: React.FC = () => {
    const printRef = useRef<HTMLDivElement | null>(null);
    const { setPrintRef } = usePrintRef((state) => state);

    useEffect(() => {
        setPrintRef(printRef);
    }, []);

    return (
        <div ref={printRef} className="flex items-start gap-5 max-h-[842px]">
            <div className="max-w-[250px] flex flex-col items-stretch w-full  p-5">
                <Image
                    src="/avatar-pl.jpg"
                    width={200}
                    height={200}
                    alt="profile"
                    className="w-full max-w-[1050px] h-full max-h-[200px] rounded-full"
                />

                <div className="mt-4">
                    <TemplatesTile title="Socials" />
                    <div className="flex flex-col gap-2 mt-4">
                        <ResumeSocial
                            link="#"
                            text="mustakahmedkhan32@gmail.com"
                            type="email"
                        />
                        <ResumeSocial
                            link="#"
                            text="github.com/claire_russel"
                            type="github"
                        />
                        <ResumeSocial
                            link="#"
                            text="linkedin.com/n/clairevrussel"
                            type="linkedin"
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <div className="w-full mt-4">
                        <TemplatesTile title="Languages" />

                        <div className="mt-4">
                            <LanguageCard
                                language="English"
                                status="Professional"
                            />
                            <LanguageCard
                                language="Bangla"
                                status="Native or Bilingual"
                            />
                            <LanguageCard
                                language="French"
                                status="Working Proftaency"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <div className="w-full mt-4">
                        <TemplatesTile title="Interests" />

                        <div className="mt-4 flex flex-col gap-2">
                            <div className="rounded-md border border-primary p-2">
                                <p className="text-xs">
                                    Emerging Technologies in Education
                                </p>
                            </div>
                            <div className="rounded-md border border-primary p-2">
                                <p className="text-xs">
                                    Emerging Technologies in Education
                                </p>
                            </div>
                            <div className="rounded-md border border-primary p-2">
                                <p className="text-xs">
                                    Emerging Technologies in Education
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <div className="w-full bg-primary p-5 mt-5">
                    <h2 className="text-2xl text-white font-bold">
                        Mustak Ahmed Khan
                    </h2>
                    <h6 className="text-base text-white">Web developer</h6>
                    <Separator className="h-0.5 bg-white w-full" />
                    <p className="text-sm text-white mt-3 leading-4">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Quisquam facilis odio illum quam dolorum? Optio minus
                        hic perferendis! Ab tenetur laborum ea sint, dolore
                        harum. Non, tempore! Nemo, doloribus debitis.
                    </p>
                </div>

                <div className="mt-5 pr-5">
                    <TemplatesTile title="Education" />

                    <div className="mt-2">
                        <h6 className="text-sm font-semibold text-primary">
                            Bsc in CSE
                        </h6>
                        <p className="text-xs">Leading University</p>
                        <p className="text-xs text-primary">2023 - present</p>
                        <p className="text-xs text-primary mt-1 underline mb-1">
                            Major Courses
                        </p>
                        <ul className="text-xs list-disc pl-4">
                            <li>Data Structure</li>
                            <li>Software Engineering</li>
                            <li>Machine Learning</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-5 pr-5">
                    <TemplatesTile title="Experience" />

                    <div className="mt-2">
                        <h6 className="text-sm font-semibold text-primary">
                            Bsc in CSE
                        </h6>
                        <p className="text-xs">Leading University</p>
                        <p className="text-xs text-primary">2023 - present</p>
                        <p className="text-xs text-primary mt-1 underline mb-1">
                            Achivements
                        </p>
                        <ul className="text-xs list-disc pl-4">
                            <li>Data Structure</li>
                            <li>Software Engineering</li>
                            <li>Machine Learning</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FirstTemplate;
