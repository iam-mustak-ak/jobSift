import React from "react";
import CompanyInfoCard from "./CompanyInfoCard";
import CopyButton from "./copyButton";

interface JobDescriptionProps {
    html: string;
    company: {
        _id?: string;
        name?: string;
        description?: string;
        industry?: string;
        foundedYear?: number;
        location?: string;
        socialLinks?: Array<{
            platform: string;
            url: string;
            _id: string;
        }>;
        website?: string;
    };
}

const JobDescription: React.FC<JobDescriptionProps> = ({ html, company }) => {
    const hasCompanyInfo = Boolean(
        company.name ||
            company.description ||
            company.industry ||
            company.foundedYear ||
            company.location ||
            company.website ||
            company.socialLinks?.length
    );

    return (
        <div
            className={`grid grid-cols-1 items-start gap-6 py-8 lg:gap-8 ${
                hasCompanyInfo
                    ? "lg:grid-cols-[minmax(0,1fr)_340px]"
                    : "lg:grid-cols-1"
            }`}
        >
            <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                <div className="mb-6 flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-700">
                            Role overview
                        </p>
                        <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
                            About this position
                        </h2>
                    </div>
                    <CopyButton description={html} />
                </div>

                <div
                    className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-7 prose-a:text-violet-700 prose-li:marker:text-violet-500"
                    dangerouslySetInnerHTML={{
                        __html: typeof html === "string" ? html : "",
                    }}
                />
            </section>

            {hasCompanyInfo && (
                <aside className="lg:sticky lg:top-28">
                    <CompanyInfoCard company={company} />
                </aside>
            )}
        </div>
    );
};

export default JobDescription;
