"use client";

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
                `${process.env.NEXT_PUBLIC_SERVER_URL!}/resume/create`,
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
            className="w-[200px] h-[300px] border border-dashed cursor-pointer"
            variant={"ghost"}
            onClick={handleCreate}
        >
            {loading ? <Loader2 className="animate-spin" /> : <Plus />}
        </Button>
    );
};

export default CreateResumeBtn;
