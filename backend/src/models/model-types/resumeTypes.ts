import { Document, Model, Schema } from "mongoose";

interface IResume {
    resumeName?: string | null;
    image?: string | null;
    name?: string | null;
    tagline?: string | null;
    about?: string | null;
    socials?: Record<string, string>[] | null;
    languages?: {
        title?: string;
        langs?: {
            title?: string;
            experience?: string;
        }[];
    } | null;
    interests?: {
        title?: string;
        items?: string;
    };
    educations?: {
        title?: string;
        items?: {
            degree?: string;
            university?: string;
            startingDate?: Date | string;
            endingDate?: Date | string;
            courses?: string;
        }[];
    };
    experience?: {
        title?: string;
        items?: {
            position?: string;
            institute?: string;
            startingDate?: Date | string;
            endingDate?: Date | string;
            achivments?: string;
        }[];
    };
    skills?: {
        title?: string;
        items?: {
            skill?: string;
            experience?: "Noob" | "Medium" | "Professional" | "Expert";
        }[];
    };
    user: Schema.Types.ObjectId;
}

export type IResumeDocument = IResume & Document;
export type ResumeModel = Model<IResumeDocument>;
