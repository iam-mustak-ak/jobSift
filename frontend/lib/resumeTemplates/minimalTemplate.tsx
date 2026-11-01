"use client";

import { ResumeDataTypes, usePrintRef, useResumeData } from "@/state/store";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

const year = (value?: Date | string) => {
    if (!value) return "";
    if (value === "Present") return value;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : String(date.getFullYear());
};
const lines = (value?: string) => (value || "").split(",").map((item) => item.trim()).filter(Boolean);
const Section = ({ title, children }: { title: string; children: ReactNode }) => (
    <section className="mt-6 break-inside-avoid">
        <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">{title}</h2>
        <div className="border-t border-slate-300 pt-3">{children}</div>
    </section>
);

const MinimalTemplate: React.FC = () => {
    const printRef = useRef<HTMLDivElement | null>(null);
    const setPrintRef = usePrintRef((state) => state.setPrintRef);
    const resume = useResumeData<ResumeDataTypes>((state) => state);
    useEffect(() => setPrintRef(printRef), [setPrintRef]);
    const contacts = (resume.socials || []).filter((item) => item.link);

    return (
        <article ref={printRef} style={{ "--primary": resume.themeColor || "#6d28d9", fontFamily: resume.fontFamily || "Georgia" } as CSSProperties} className="mx-auto min-h-[1123px] w-[794px] max-w-none bg-white px-[68px] py-14 text-slate-800">
            <header className="border-b-4 border-primary pb-6">
                <p className="font-serif text-4xl font-semibold tracking-tight text-slate-950">{resume.name || "Your name"}</p>
                {resume.tagline && <p className="mt-2 text-sm tracking-wide text-slate-600">{resume.tagline}</p>}
                {contacts.length > 0 && <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[10px] text-slate-600">{contacts.map((item, index) => <span key={`${item.socialType}-${index}`} className="break-all"><span className="capitalize text-primary">{item.socialType}</span> · {item.link}</span>)}</div>}
            </header>
            {typeof resume.about === "string" && resume.about && <div className="prose prose-sm mt-5 max-w-none text-slate-600" dangerouslySetInnerHTML={{ __html: resume.about }} />}

            {!!resume.experience?.items?.length && <Section title={resume.experience.title || "Experience"}><div className="space-y-4">{resume.experience.items.map((item, index) => <div key={`${item.position}-${index}`}><div className="flex justify-between gap-4"><h3 className="text-sm font-semibold text-slate-900">{item.position}</h3><span className="shrink-0 text-[10px] text-slate-500">{year(item.startingDate)}{item.endingDate ? ` – ${year(item.endingDate)}` : ""}</span></div><p className="mt-0.5 text-xs text-slate-600">{[item.institute, item.location].filter(Boolean).join(" | ")}</p>{lines(item.achivments).length > 0 && <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] leading-5 text-slate-600">{lines(item.achivments).map((line, lineIndex) => <li key={lineIndex}>{line}</li>)}</ul>}</div>)}</div></Section>}
            {!!resume.educations?.items?.length && <Section title={resume.educations.title || "Education"}><div className="space-y-3">{resume.educations.items.map((item, index) => <div key={`${item.degree}-${index}`}><div className="flex justify-between gap-4"><h3 className="text-xs font-semibold text-slate-900">{item.degree}</h3><span className="shrink-0 text-[10px] text-slate-500">{year(item.startingDate)}{item.endingDate ? ` – ${year(item.endingDate)}` : ""}</span></div><p className="text-[11px] text-slate-600">{[item.university, item.location].filter(Boolean).join(" | ")}</p>{item.courses && <p className="mt-1 text-[10px] text-slate-500">{item.courses}</p>}</div>)}</div></Section>}

            <div className="grid grid-cols-2 gap-x-10">
                {!!resume.skills?.items?.length && <Section title={resume.skills.title || "Skills"}><div className="space-y-1">{resume.skills.items.map((item, index) => <p key={`${item.skill}-${index}`} className="text-[11px] text-slate-700">{item.skill}{item.experience && <span className="text-slate-500"> — {item.experience}</span>}</p>)}</div></Section>}
                {!!resume.languages?.langs?.length && <Section title={resume.languages.title || "Languages"}><div className="space-y-1">{resume.languages.langs.map((item, index) => <p key={`${item.title}-${index}`} className="text-[11px] text-slate-700">{item.title}{item.experience && <span className="text-slate-500"> — {item.experience}</span>}</p>)}</div></Section>}
                {!!resume.projects?.items?.length && <Section title={resume.projects.title || "Projects"}><div className="space-y-3">{resume.projects.items.map((item, index) => <div key={`${item.title}-${index}`}><p className="text-xs font-semibold text-slate-900">{item.title}</p>{item.description && <p className="mt-1 text-[10px] leading-4 text-slate-600">{item.description}</p>}{[item.livelink, item.codelink].filter(Boolean).length > 0 && <p className="mt-1 break-all text-[9px] text-slate-500">{[item.livelink, item.codelink].filter(Boolean).join(" · ")}</p>}</div>)}</div></Section>}
                {!!resume.interests?.items && <Section title={resume.interests.title || "Interests"}><p className="text-[11px] leading-5 text-slate-600">{resume.interests.items}</p></Section>}
                {!!resume.researches?.items?.length && <Section title={resume.researches.title || "Research & publications"}><div className="space-y-2">{resume.researches.items.map((item, index) => <div key={`${item.title}-${index}`}><p className="text-[11px] font-semibold text-slate-900">{item.title}</p><p className="text-[10px] text-slate-500">{[item.publisher, year(item.yearofpublish), item.link].filter(Boolean).join(" · ")}</p></div>)}</div></Section>}
                {!!resume.cp?.items?.length && <Section title={resume.cp.title || "Competitive programming"}><div className="space-y-1">{resume.cp.items.map((item, index) => <p key={`${item.platform}-${index}`} className="text-[10px] text-slate-600"><b className="text-slate-800">{item.platform}</b> — {item.username} · {item.rating}</p>)}</div></Section>}
                {!!resume.references?.items?.length && <Section title={resume.references.title || "References"}><div className="space-y-2">{resume.references.items.map((item, index) => <div key={`${item.name}-${index}`} className="text-[10px] leading-4"><p className="font-semibold text-slate-900">{item.name}</p><p className="text-slate-600">{[item.position, item.institute].filter(Boolean).join(" · ")}</p><p className="text-slate-500">{[item.email, item.phone].filter(Boolean).join(" · ")}</p></div>)}</div></Section>}
            </div>
        </article>
    );
};

export default MinimalTemplate;
