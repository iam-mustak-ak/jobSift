"use client";

import { ResumeDataTypes, usePrintRef, useResumeData } from "@/state/store";
import Image from "next/image";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

const year = (value?: Date | string) => {
    if (!value) return "";
    if (value === "Present") return value;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : String(date.getFullYear());
};
const commaItems = (value?: string) => (value || "").split(",").map((item) => item.trim()).filter(Boolean);
const Section = ({ title, children }: { title: string; children: ReactNode }) => (
    <section className="mt-6 break-inside-avoid">
        <div className="mb-3 flex items-center gap-3"><h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">{title}</h2><div className="h-px flex-1 bg-slate-200" /></div>
        {children}
    </section>
);

const ModernTemplate: React.FC = () => {
    const printRef = useRef<HTMLDivElement | null>(null);
    const setPrintRef = usePrintRef((state) => state.setPrintRef);
    const resume = useResumeData<ResumeDataTypes>((state) => state);
    useEffect(() => setPrintRef(printRef), [setPrintRef]);
    const contacts = (resume.socials || []).filter((item) => item.link);

    return (
        <article ref={printRef} style={{ "--primary": resume.themeColor || "#6d28d9", fontFamily: resume.fontFamily || "Arial" } as CSSProperties} className="mx-auto min-h-[1123px] w-[794px] max-w-none bg-white px-12 py-11 text-slate-800">
            <header className="relative overflow-hidden rounded-2xl bg-slate-950 px-9 py-8 text-white">
                <div className="absolute inset-y-0 left-0 w-2 bg-primary" />
                <div className="flex items-center gap-5">
                    {resume.image && <Image src={resume.image} width={96} height={96} alt="Profile" className="h-20 w-20 rounded-full border-2 border-white/20 object-cover" />}
                    <div className="min-w-0 flex-1">
                        <h1 className="text-3xl font-bold tracking-tight">{resume.name || "Your name"}</h1>
                        {resume.tagline && <p className="mt-1 text-sm font-medium text-white/75">{resume.tagline}</p>}
                        {contacts.length > 0 && <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-white/75">{contacts.map((item, index) => <span key={`${item.socialType}-${index}`} className="break-all"><b className="capitalize text-white">{item.socialType}:</b> {item.link}</span>)}</div>}
                    </div>
                </div>
            </header>
            {typeof resume.about === "string" && resume.about && <div className="prose prose-sm mt-5 max-w-none text-slate-600" dangerouslySetInnerHTML={{ __html: resume.about }} />}

            {!!resume.experience?.items?.length && <Section title={resume.experience.title || "Experience"}><div className="space-y-4">{resume.experience.items.map((item, index) => <div key={`${item.position}-${index}`}><div className="flex items-baseline justify-between gap-4"><h3 className="text-sm font-bold text-slate-900">{item.position}</h3><span className="shrink-0 text-[10px] text-slate-500">{year(item.startingDate)}{item.endingDate ? ` – ${year(item.endingDate)}` : ""}</span></div><p className="mt-0.5 text-xs text-primary">{[item.institute, item.location].filter(Boolean).join(" · ")}</p>{commaItems(item.achivments).length > 0 && <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] leading-5 text-slate-600">{commaItems(item.achivments).map((line, lineIndex) => <li key={lineIndex}>{line}</li>)}</ul>}</div>)}</div></Section>}
            <div className="grid grid-cols-2 gap-x-9">
                {!!resume.educations?.items?.length && <Section title={resume.educations.title || "Education"}><div className="space-y-3">{resume.educations.items.map((item, index) => <div key={`${item.degree}-${index}`}><h3 className="text-xs font-bold text-slate-900">{item.degree}</h3><p className="mt-0.5 text-[11px] text-primary">{[item.university, item.location].filter(Boolean).join(" · ")}</p><p className="text-[10px] text-slate-500">{year(item.startingDate)}{item.endingDate ? ` – ${year(item.endingDate)}` : ""}</p>{item.courses && <p className="mt-1 text-[10px] leading-4 text-slate-600">{item.courses}</p>}</div>)}</div></Section>}
                {!!resume.skills?.items?.length && <Section title={resume.skills.title || "Skills"}><div className="flex flex-wrap gap-1.5">{resume.skills.items.map((item, index) => <span key={`${item.skill}-${index}`} className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-slate-700">{item.skill}{item.experience ? ` · ${item.experience}` : ""}</span>)}</div></Section>}
                {!!resume.languages?.langs?.length && <Section title={resume.languages.title || "Languages"}><div className="space-y-1.5">{resume.languages.langs.map((item, index) => <p key={`${item.title}-${index}`} className="text-[11px] text-slate-700"><b>{item.title}</b>{item.experience && <span className="text-slate-500"> · {item.experience}</span>}</p>)}</div></Section>}
                {!!resume.projects?.items?.length && <Section title={resume.projects.title || "Projects"}><div className="space-y-3">{resume.projects.items.map((item, index) => <div key={`${item.title}-${index}`}><h3 className="text-xs font-bold text-slate-900">{item.title}</h3>{item.description && <p className="mt-1 text-[10px] leading-4 text-slate-600">{item.description}</p>}<p className="mt-1 break-all text-[9px] text-primary">{[item.livelink, item.codelink].filter(Boolean).join(" · ")}</p></div>)}</div></Section>}
                {!!resume.interests?.items && <Section title={resume.interests.title || "Interests"}><p className="text-[11px] leading-5 text-slate-600">{resume.interests.items}</p></Section>}
                {!!resume.cp?.items?.length && <Section title={resume.cp.title || "Competitive programming"}><div className="space-y-2">{resume.cp.items.map((item, index) => <p key={`${item.platform}-${index}`} className="text-[11px] text-slate-700"><b>{item.platform}</b> · {item.username} · {item.rating}</p>)}</div></Section>}
                {!!resume.researches?.items?.length && <Section title={resume.researches.title || "Research & publications"}><div className="space-y-2">{resume.researches.items.map((item, index) => <div key={`${item.title}-${index}`}><p className="text-xs font-semibold text-slate-900">{item.title}</p><p className="text-[10px] text-slate-500">{[item.publisher, year(item.yearofpublish), item.link].filter(Boolean).join(" · ")}</p></div>)}</div></Section>}
                {!!resume.references?.items?.length && <Section title={resume.references.title || "References"}><div className="space-y-2">{resume.references.items.map((item, index) => <div key={`${item.name}-${index}`} className="text-[10px] leading-4"><p className="font-semibold text-slate-900">{item.name}</p><p className="text-slate-600">{[item.position, item.institute].filter(Boolean).join(" · ")}</p><p className="text-slate-500">{[item.email, item.phone].filter(Boolean).join(" · ")}</p></div>)}</div></Section>}
            </div>
        </article>
    );
};

export default ModernTemplate;
