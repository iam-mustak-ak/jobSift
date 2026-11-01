"use client";

import { ResumeDataTypes, usePrintRef, useResumeData } from "@/state/store";
import Image from "next/image";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

const getYear = (value: Date | string | undefined) => {
    if (!value) return "";
    if (value === "Present") return value;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : String(date.getFullYear());
};

const splitList = (value?: string) =>
    (value || "").split(",").map((item) => item.trim()).filter(Boolean);

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
    <section className="mt-6 break-inside-avoid">
        <h2 className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">{title}</h2>
        <div className="mb-3 h-px bg-primary/30" />
        {children}
    </section>
);

const FirstTemplate: React.FC = () => {
    const printRef = useRef<HTMLDivElement | null>(null);
    const setPrintRef = usePrintRef((state) => state.setPrintRef);
    const resume = useResumeData<ResumeDataTypes>((state) => state);

    useEffect(() => {
        setPrintRef(printRef);
    }, [setPrintRef]);

    const name = resume.name || "Your name";
    const socialLinks = (resume.socials || []).filter((social) => social.link);

    return (
        <article
            ref={printRef}
            style={{
                "--primary": resume.themeColor || "#6d28d9",
                fontFamily: resume.fontFamily || "Arial",
            } as CSSProperties}
            className="mx-auto flex min-h-[1123px] w-[794px] max-w-none bg-white text-slate-800"
        >
            <aside className="w-[252px] shrink-0 bg-slate-50 px-7 py-9">
                {resume.image && (
                    <Image src={resume.image} width={112} height={112} alt={`${name} profile`} className="mb-6 h-24 w-24 rounded-2xl object-cover" />
                )}
                {socialLinks.length > 0 && (
                    <Section title="Contact">
                        <div className="space-y-2 break-words text-[11px] leading-5 text-slate-600">
                            {socialLinks.map((social, index) => <p key={`${social.socialType}-${index}`}><span className="font-semibold capitalize text-slate-800">{social.socialType}: </span>{social.link}</p>)}
                        </div>
                    </Section>
                )}
                {!!resume.skills?.items?.length && (
                    <Section title={resume.skills.title || "Skills"}>
                        <div className="flex flex-wrap gap-1.5">
                            {resume.skills.items.map((item, index) => <span key={`${item.skill}-${index}`} className="rounded-md border border-primary/20 bg-white px-2 py-1 text-[10px] font-medium text-slate-700">{item.skill}</span>)}
                        </div>
                    </Section>
                )}
                {!!resume.languages?.langs?.length && (
                    <Section title={resume.languages.title || "Languages"}>
                        <div className="space-y-2 text-[11px]">
                            {resume.languages.langs.map((item, index) => <div key={`${item.title}-${index}`}><p className="font-semibold text-slate-800">{item.title}</p><p className="text-slate-500">{item.experience}</p></div>)}
                        </div>
                    </Section>
                )}
                {!!resume.interests?.items && (
                    <Section title={resume.interests.title || "Interests"}>
                        <div className="flex flex-wrap gap-1.5">{splitList(resume.interests.items).map((item) => <span key={item} className="text-[11px] text-slate-600">{item}</span>)}</div>
                    </Section>
                )}
                {!!resume.cp?.items?.length && (
                    <Section title={resume.cp.title || "Competitive programming"}>
                        <div className="space-y-2 text-[11px]">{resume.cp.items.map((item, index) => <div key={`${item.platform}-${index}`}><p className="font-semibold text-slate-800">{item.platform}</p><p className="text-slate-500">{item.username} · rating {item.rating}</p></div>)}</div>
                    </Section>
                )}
            </aside>

            <div className="min-w-0 flex-1 px-9 py-10">
                <header className="border-b-2 border-primary pb-5">
                    <p className="text-3xl font-bold tracking-tight text-slate-950">{name}</p>
                    {resume.tagline && <p className="mt-1 text-sm font-medium tracking-wide text-primary">{resume.tagline}</p>}
                    {typeof resume.about === "string" && !!resume.about && <div className="prose prose-sm mt-4 max-w-none text-slate-600" dangerouslySetInnerHTML={{ __html: resume.about }} />}
                </header>

                {!!resume.experience?.items?.length && (
                    <Section title={resume.experience.title || "Experience"}>
                        <div className="space-y-4">{resume.experience.items.map((item, index) => <div key={`${item.position}-${index}`} className="break-inside-avoid"><div className="flex items-start justify-between gap-3"><h3 className="text-sm font-bold text-slate-900">{item.position}</h3><span className="shrink-0 text-[10px] font-medium text-slate-500">{getYear(item.startingDate)}{item.endingDate ? ` – ${getYear(item.endingDate)}` : ""}</span></div><p className="mt-0.5 text-xs font-medium text-primary">{[item.institute, item.location].filter(Boolean).join(" · ")}</p><ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] leading-5 text-slate-600">{splitList(item.achivments).map((achievement, itemIndex) => <li key={itemIndex}>{achievement}</li>)}</ul></div>)}</div>
                    </Section>
                )}
                {!!resume.educations?.items?.length && (
                    <Section title={resume.educations.title || "Education"}>
                        <div className="space-y-3">{resume.educations.items.map((item, index) => <div key={`${item.degree}-${index}`} className="break-inside-avoid"><div className="flex items-start justify-between gap-3"><h3 className="text-sm font-bold text-slate-900">{item.degree}</h3><span className="shrink-0 text-[10px] text-slate-500">{getYear(item.startingDate)}{item.endingDate ? ` – ${getYear(item.endingDate)}` : ""}</span></div><p className="mt-0.5 text-xs text-primary">{[item.university, item.location].filter(Boolean).join(" · ")}</p>{item.courses && <p className="mt-1 text-[11px] leading-5 text-slate-600">Relevant coursework: {item.courses}</p>}</div>)}</div>
                    </Section>
                )}
                {!!resume.projects?.items?.length && <Section title={resume.projects.title || "Projects"}><div className="space-y-3">{resume.projects.items.map((item, index) => <div key={`${item.title}-${index}`} className="break-inside-avoid"><h3 className="text-sm font-bold text-slate-900">{item.title}</h3>{item.description && <p className="mt-1 text-[11px] leading-5 text-slate-600">{item.description}</p>}<p className="mt-1 break-all text-[10px] text-primary">{[item.livelink, item.codelink].filter(Boolean).join(" · ")}</p></div>)}</div></Section>}
                {!!resume.researches?.items?.length && <Section title={resume.researches.title || "Research & publications"}><div className="space-y-3">{resume.researches.items.map((item, index) => <div key={`${item.title}-${index}`} className="break-inside-avoid"><h3 className="text-sm font-bold text-slate-900">{item.title}</h3><p className="text-[11px] text-slate-600">{[item.publisher, getYear(item.yearofpublish)].filter(Boolean).join(" · ")}</p>{item.link && <p className="break-all text-[10px] text-primary">{item.link}</p>}</div>)}</div></Section>}
                {!!resume.references?.items?.length && <Section title={resume.references.title || "References"}><div className="grid grid-cols-2 gap-3">{resume.references.items.map((item, index) => <div key={`${item.name}-${index}`} className="text-[11px] leading-5"><p className="font-semibold text-slate-900">{item.name}</p><p className="text-slate-600">{[item.position, item.institute].filter(Boolean).join(" · ")}</p><p className="text-slate-500">{[item.email, item.phone].filter(Boolean).join(" · ")}</p></div>)}</div></Section>}
            </div>
        </article>
    );
};

export default FirstTemplate;
