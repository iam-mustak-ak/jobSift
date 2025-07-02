"use server";
import { redirect } from "next/navigation";

export const jobSearchAction = async (formData: FormData) => {
    "use server";

    const title = formData.get("title") || undefined;
    const location = formData.get("location") || undefined;
    const jobCategory = formData.get("jobCategory") || undefined;
    const jobtype = formData.get("jobtype") || undefined;
    const experiment = formData.get("experiment") || undefined;

    const params = new URLSearchParams({ page: "1" });
    if (title) params.append("title", String(title));
    if (location) params.append("location", String(location));
    if (jobCategory) params.append("jobCategory", String(jobCategory));
    if (jobtype) params.append("jobtype", String(jobtype));
    if (experiment) params.append("experiment", String(experiment));

    // Redirect
    redirect(`/find-jobs?${params.toString()}`);
};
