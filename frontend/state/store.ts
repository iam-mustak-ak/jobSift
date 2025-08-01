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
};

type ResumeDataActions = {
    setResumeData: (resumeData: ResumeDataTypes) => void;
};

export const useResumeData = create<ResumeDataTypes & ResumeDataActions>(
    (set) => ({
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
        setResumeData: (resumeData: ResumeDataTypes) => {
            set((prev) => ({ ...prev, ...resumeData }));
        },
    })
);
