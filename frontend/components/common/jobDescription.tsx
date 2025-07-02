import React from "react";

interface JobDescriptionProps {
    html: string;
}

const JobDescription: React.FC<JobDescriptionProps> = ({ html }) => {
    return (
        <div className="max-w-6xl mx-auto py-6 mt-10">
            <div
                className="prose prose-slate dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </div>
    );
};

export default JobDescription;
