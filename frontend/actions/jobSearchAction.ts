"use server";
import { redirect } from "next/navigation";

export const jobSearchAction = async (formData: FormData) => {
    "use server";

    const title = formData.get("title") || undefined;
    const location = formData.get("location") || undefined;
    const jobCategory = formData.get("jobCategory") || undefined;
    const jobtype = formData.get("jobType") || undefined;
    const experienceLevel = formData.get("experienceLevel") || undefined;

    const params = new URLSearchParams({ page: "1" });
    if (title) params.append("title", String(title).toLowerCase());
    if (location) params.append("location", String(location).toLowerCase());
    if (jobCategory)
        params.append("jobCategory", String(jobCategory).toLowerCase());
    if (jobtype) params.append("jobType", String(jobtype).toLowerCase());
    if (experienceLevel)
        params.append("experienceLevel", String(experienceLevel).toLowerCase());

    // Redirect
    redirect(`/find-jobs?${params.toString()}`);
};
