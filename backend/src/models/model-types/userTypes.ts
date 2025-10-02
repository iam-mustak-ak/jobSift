import { Document, Model, Schema } from "mongoose";

// Main user schema fields
interface IUser {
    name?: string;
    email: string;
    password: string;
    role?: "candidate" | "recruiter";
    phone?: string;
    location?: string;
    experience?: string;
    resume?: string;
    isOAuthUser?: boolean;
    about?: string;
    bio?: string;
    profilePicture?: string;
    isAvailableForHire?: boolean;
    isVerified?: boolean;
    isDeleted?: boolean;
    isBlocked?: boolean;
    isOnline?: boolean;
    lastSeen?: Date;
    jobPreferences?: {
        jobType?: "full-time" | "part-time" | "contract" | "internship";
        preferredLocation?: string;
        expectedSalary?: number;
    };
    socialLinks?: {
        platform:
            | "LinkedIn"
            | "GitHub"
            | "Twitter"
            | "Facebook"
            | "Instagram"
            | "Other";
        url: string;
        logo: string;
    }[];
    skills?: String[];
    educations?: {
        degree?: string;
        institution?: string;
        startDate?: Date;
        endDate?: Date;
    }[];
    notifications?: Schema.Types.ObjectId[];
    appliedJobs?: {
        jobId: Schema.Types.ObjectId;
        dateApplied: Date;
    }[];
    savedJobs?: {
        jobId: Schema.Types.ObjectId;
        dateSaved: Date;
    }[];
    savedCandidates?: {
        candidateId: Schema.Types.ObjectId;
        dateSaved: Date;
    }[];
    savedRecruiters?: {
        recruiterId: Schema.Types.ObjectId;
        dateSaved: Date;
    }[];
    savedCompanies?: {
        companyId: Schema.Types.ObjectId;
        dateSaved: Date;
    }[];
}

// Combine with Document for model typing
export type IUserDocument = IUser & Document & { _id: Schema.Types.ObjectId };
export type UserModel = Model<IUserDocument>;
