// utils/saveResume.ts
import { ResumeDataTypes } from "@/state/store";

export const saveResume = async (
    resumeId: string | string[],
    data: ResumeDataTypes
) => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/resume/save-resume/${resumeId}`,
        {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
        }
    );

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Saving failed");
    return result;
};
