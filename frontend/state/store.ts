import React, { RefObject } from "react";
import { create } from "zustand";

type State = {
    user: Record<string, any> | undefined;
};

type Actions = {
    setAuth: (user: State["user"]) => void;
};

export const useAuthStore = create<State & Actions>((set) => ({
    user: undefined,
    setAuth: (user) => {
        set(() => ({ user }));
    },
}));

type PrintState = {
    printRef: RefObject<Element | Text | null>;
};

type PrintActions = {
    setPrintRef: (printRef: PrintState["printRef"]) => void;
};

export const usePrintRef = create<PrintState & PrintActions>((set) => ({
    printRef: React.createRef<HTMLDivElement>(),
    setPrintRef: (printRef) => {
        set(() => ({ printRef }));
    },
}));

export type LanguagesTypes = {
    title?: string;
    langs: {
        title: string;
        experience: string;
    }[];
};

export type ResumeDataTypes = {
    resumeName: string | null;
    image: string | null;
    name: string | null;
    tagline: string | null;
    about: any | null;
    socials: Record<string, string>[] | null;
    languages: LanguagesTypes | null;
    interests: {
        title: string;
        items: string;
    };
    educations: {
        title: string;
        items: {
            degree: string;
            university: string;
            startingDate: Date | string;
            endingDate: Date | string;
            courses: string;
            location: string;
        }[];
    };
    experience: {
        title: string;
        items: {
            position: string;
            institute: string;
            startingDate: Date | string;
            endingDate: Date | string;
            achivments: string;
            location: string;
        }[];
    };
    projects: {
        title: string;
        items: {
            title: string;
            description: string;
            livelink: string;
            codelink: string;
        }[];
    };
    skills: {
        title: string;
        items: {
            skill: string;
            experience: "Noob" | "Medium" | "Professional" | "Expert";
        }[];
    };
    researches: {
        title: string;
        items: {
            title: string;
            yearofpublish: Date | string;
            publisher: string;
            link: string;
        }[];
    };
    references: {
        title: string;
        items: {
            name: string;
            position: string;
            institute: string;
            phone: string;
            email: string;
        }[];
    };
    cp: {
        title: string;
        items: {
            platform: string;
            rating: number;
            username: string;
        }[];
    };
};

type ResumeDataActions = {
    setResumeData: (resumeData: ResumeDataTypes) => void;
};

export const useResumeData = create<ResumeDataTypes & ResumeDataActions>(
    (set) => ({
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
            title: "Educations",
            items: [],
        },
        experience: {
            title: "Experiences",
            items: [],
        },
        skills: {
            title: "Skills",
            items: [],
        },
        projects: {
            title: "Projects",
            items: [],
        },
        researches: {
            title: "Researches",
            items: [],
        },
        references: {
            title: "References",
            items: [],
        },
        cp: {
            title: "Competitive Programming",
            items: [],
        },
        setResumeData: (resumeData: ResumeDataTypes) => {
            set((prev) => ({ ...prev, ...resumeData }));
        },
    })
);

type ResumeSaveLoader = {
    isLoading: boolean;
    setIsloading: (isLoading: boolean) => void;
};

export const useSaveLoader = create<ResumeSaveLoader>((set) => ({
    isLoading: false,
    setIsloading: (isLoading: boolean) => {
        set({ isLoading });
    },
}));
