"use client";
import StarRating from "@/components/common/ratingStars";
import LanguageCard from "@/components/resume/languageCard";
import ResumeSocial from "@/components/resume/resumeSocial";
import TemplatesTile from "@/components/resume/templatesTile";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ResumeDataTypes, usePrintRef, useResumeData } from "@/state/store";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef } from "react";

const expLevel = {
    Noob: 30,
    Medium: 45,
    Professional: 75,
    Expert: 100,
};

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
        skills,
        projects,
        researches,
        references,
        cp,
    } = useResumeData<ResumeDataTypes>((state) => state);

    useEffect(() => {
        setPrintRef(printRef);
    }, []);

    return (
        <div ref={printRef} className="flex items-start gap-5 h-auto py-5">
            <div className="max-w-[250px] flex flex-col items-stretch w-full  p-5">
                {image && (
                    <Image
                        src={image ? image : `/avatar-pl.jpg`}
                        width={200}
                        height={200}
                        alt="profile"
                        className="w-full max-w-[1050px] h-full max-h-[200px] rounded-full aspect-square object-cover"
                    />
                )}

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
                                        socialItem?.socialType as
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
                            <TemplatesTile
                                title={interests?.title ?? "Interests"}
                            />

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

                {educations.items.length > 0 && (
                    <div className="mt-4">
                        <div className="w-full mt-4">
                            <TemplatesTile
                                title={cp?.title ?? "Competitive Programming"}
                            />

                            <div className="mt-4 flex flex-col gap-2">
                                {cp.items.map((v, i) => (
                                    <div
                                        key={i}
                                        className="rounded-md border border-primary p-2 "
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="text-base">
                                                {v.platform}
                                            </p>
                                            <StarRating rating={v.rating} />
                                        </div>

                                        <Link
                                            href="#"
                                            className="text-sm text-primary"
                                        >
                                            {v.username}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="w-full">
                {name || tagline ? (
                    <div className="w-full bg-primary p-5 mt-5">
                        <h2 className="text-2xl text-white font-bold">
                            {name}
                        </h2>
                        <h6 className="text-base text-white">{tagline}</h6>
                        <Separator className="h-0.5 bg-white w-full" />
                        {/* <p className="">{about}</p> */}
                        <div
                            className="prose prose-slate dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{
                                __html: typeof about === "string" ? about : "",
                            }}
                        />
                    </div>
                ) : null}

                {educations.items.length > 0 && (
                    <div className="mt-5 pr-5">
                        <TemplatesTile
                            title={educations?.title ?? "Educations"}
                        />

                        <div className="flex flex-col gap-3">
                            {educations.items.map((v, i) => (
                                <div key={i} className="mt-2">
                                    <h6 className="text-sm font-semibold text-primary">
                                        {v.degree}
                                    </h6>
                                    <p className="text-xs">
                                        {v.university} - {v.location}
                                    </p>
                                    <p className="text-xs text-primary">
                                        <span>
                                            {new Date(
                                                v.startingDate
                                            ).getFullYear()}
                                        </span>{" "}
                                        -{" "}
                                        {v.endingDate &&
                                        v.endingDate !== "Present"
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
                        <TemplatesTile
                            title={experience?.title ?? "Experiences"}
                        />

                        <div className="flex flex-col gap-3">
                            {experience.items.map((v, i) => (
                                <div key={i} className="mt-2">
                                    <h6 className="text-sm font-semibold text-primary">
                                        {v.position}
                                    </h6>
                                    <p className="text-xs">
                                        {v.institute} - {v.location}
                                    </p>
                                    <p className="text-xs text-primary">
                                        <span>
                                            {new Date(
                                                v.startingDate
                                            ).getFullYear()}
                                        </span>{" "}
                                        -{" "}
                                        {v.endingDate &&
                                        v.endingDate !== "Present"
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

                {skills.items.length > 0 && (
                    <div className="mt-5 pr-5">
                        <TemplatesTile title={skills?.title ?? "Skills"} />

                        <div className="mt-2">
                            {skills.items.map((v, i) => (
                                <div
                                    key={i}
                                    className=" grid grid-cols-3 items-center gap-4"
                                >
                                    <h6 className="text-sm font-semibold text-primary">
                                        {v.skill}
                                    </h6>
                                    <Progress
                                        value={expLevel[v.experience!]}
                                        className="w-full"
                                    />
                                    <p className="text-sm">{v.experience}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {projects.items.length > 0 && (
                    <div className="mt-5 pr-5">
                        <TemplatesTile title={projects?.title ?? "Projects"} />

                        <div className="flex flex-col gap-3">
                            {projects.items.map((v, i) => (
                                <div key={i} className="mt-2">
                                    <h6 className="text-base font-semibold text-primary">
                                        {v.title}
                                    </h6>
                                    <p className="text-sm">{v.description}</p>
                                    <div className="flex items-center gap-4 mt-3">
                                        {v.livelink && (
                                            <Link
                                                href={v.livelink ?? "#"}
                                                className="flex items-center gap-2 text-sm"
                                            >
                                                <span>{v.livelink}</span>
                                                <ExternalLink className="w-3 " />
                                            </Link>
                                        )}
                                        {v.codelink && (
                                            <Link
                                                href={v.codelink ?? "#"}
                                                className="flex items-center gap-2 text-sm"
                                            >
                                                <span>{v.codelink}</span>
                                                <ExternalLink className="w-3 " />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {researches.items.length > 0 && (
                    <div className="mt-5 pr-5">
                        <TemplatesTile
                            title={researches?.title ?? "Researches"}
                        />

                        <div className="flex flex-col gap-3">
                            {researches.items.map((v, i) => (
                                <div key={i} className="mt-2">
                                    <h6 className="text-sm font-semibold ">
                                        <span>Title: </span>
                                        <span className="text-primary">
                                            {v.title}
                                        </span>
                                    </h6>

                                    <p className="text-sm ">
                                        <span>Year Of Publish: </span>
                                        <span className="text-primary">
                                            {" "}
                                            {new Date(
                                                v.yearofpublish
                                            ).getFullYear()}
                                        </span>
                                    </p>
                                    <p className="text-sm">
                                        <span>Publisher: </span>{" "}
                                        <span className="text-primary">
                                            {" "}
                                            {v.publisher}
                                        </span>
                                    </p>

                                    <Link
                                        href={v.link ?? "#"}
                                        className="flex items-center gap-2 text-sm mt-3"
                                    >
                                        <span>{v.link}</span>
                                        <ExternalLink className="w-3 " />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {references.items.length > 0 && (
                    <div className="mt-5 pr-5">
                        <TemplatesTile
                            title={references?.title ?? "References"}
                        />

                        <div className="flex flex-col gap-3">
                            <table>
                                <tbody>
                                    {references.items.map((v, i) => (
                                        <Fragment key={i}>
                                            <tr>
                                                <td>{i + 1}</td>
                                            </tr>
                                            <tr>
                                                <td className="border text-xs">
                                                    Name
                                                </td>
                                                <td className="border text-xs">
                                                    {v.name}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border text-xs">
                                                    Institute/Compnay
                                                </td>
                                                <td className="border text-xs">
                                                    {v.institute}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border text-xs">
                                                    Position
                                                </td>
                                                <td className="border text-xs">
                                                    {v.position}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border text-xs">
                                                    Phone
                                                </td>
                                                <td className="border text-xs">
                                                    {v.phone}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border text-xs">
                                                    Email
                                                </td>
                                                <td className="border text-xs">
                                                    {v.email}
                                                </td>
                                            </tr>
                                        </Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FirstTemplate;
