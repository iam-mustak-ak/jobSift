"use client";

import { API_BASE_URL } from "@/lib/api";
import { useResumeData } from "@/state/store";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

const CreateResumeBtn: React.FC = () => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    const {
        about,
        educations,
        experience,
        image,
        interests,
        languages,
        name,
        resumeName,
        skills,
        socials,
        tagline,
    } = useResumeData((state) => state);

    const handleCreate = async () => {
        setLoading(true);

        try {
            const response = await fetch(
                `${API_BASE_URL!}/resume/create`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        resumeName: "Untitled",
                        image: null,
                        name: null,
                        tagline: null,
                        about: null,
                        socials: null,
                        languages: {
                            title: "Languages",
                            langs: [],
                        },
                        interests: {
                            title: "Interests",
                            items: "",
                        },
                        educations: {
                            title: "Education",
                            items: [],
                        },
                        experience: {
                            title: "Experience",
                            items: [],
                        },
                        skills: {
                            title: "Skills",
                            items: [],
                        },
                    }),
                }
            );

            const data = await response.json();

            if (data.success) {
                router.push(`/build-resume/${data.data._id}/edit`);
            }
        } catch (err) {
            toast.error("Somthing is wrong while creating the resume");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            className="flex h-full min-h-[300px] w-full min-w-0 max-w-full flex-col gap-3 whitespace-normal rounded-2xl border border-dashed border-violet-200 bg-violet-50/30 p-6 text-center text-slate-700 transition hover:border-violet-400 hover:bg-violet-50 hover:text-violet-800"
            variant={"ghost"}
            onClick={handleCreate}
        >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm ring-1 ring-violet-100">
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Plus className="h-6 w-6" />}
            </span>
            <span className="max-w-full whitespace-normal break-words text-base font-semibold">Create a resume</span>
            <span className="max-w-full whitespace-normal break-words text-sm font-normal leading-5 text-slate-500">Start with a fresh, professional template.</span>
        </Button>
    );
};

export default CreateResumeBtn;
