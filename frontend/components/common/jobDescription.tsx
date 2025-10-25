import React from "react";
import CompanyInfoCard from "./CompanyInfoCard";

interface JobDescriptionProps {
    html: string;
    company: {
        _id: string;
        name: string;
        description: string;
        industry: string;
        foundedYear: number;
        location: string;
        socialLinks: [
            {
                platform: string;
                url: string;
                _id: string;
            }
        ];
        website: string;
    };
}

const JobDescription: React.FC<JobDescriptionProps> = ({ html, company }) => {
    return (
        <div className="w-full mx-auto py-6 mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-20">
            <div
                className="prose prose-slate dark:prose-invert max-w-none md:col-span-2"
                dangerouslySetInnerHTML={{
                    __html: typeof html === "string" ? html : "",
                }}
            />
            <div>
                <CompanyInfoCard company={company} />
            </div>
        </div>
    );
};

export default JobDescription;
