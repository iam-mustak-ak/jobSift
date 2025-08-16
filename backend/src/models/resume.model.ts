import { model, Schema } from "mongoose";
import { IResumeDocument, ResumeModel } from "./model-types/resumeTypes";

const resumeSchema = new Schema<IResumeDocument, ResumeModel>(
    {
        resumeName: { type: String },
        image: { type: String },
        name: { type: String },
        tagline: { type: String },
        about: { type: String },

        socials: {
            type: [
                {
                    socialType: String,
                    link: String,
                },
            ],
        },

        languages: {
            title: { type: String },
            langs: [
                {
                    title: { type: String },
                    experience: { type: String },
                },
            ],
        },

        interests: {
            title: { type: String },
            items: { type: String },
        },

        educations: {
            title: { type: String },
            items: [
                {
                    degree: { type: String },
                    university: { type: String },
                    startingDate: { type: Date },
                    endingDate: { type: Date },
                    courses: { type: String },
                    location: { type: String },
                },
            ],
        },

        experience: {
            title: { type: String },
            items: [
                {
                    position: { type: String },
                    institute: { type: String },
                    startingDate: { type: Date },
                    endingDate: { type: Date },
                    achivments: { type: String },
                    location: { type: String },
                },
            ],
        },

        skills: {
            title: { type: String },
            items: [
                {
                    skill: { type: String },
                    experience: {
                        type: String,
                        enum: ["Noob", "Medium", "Professional", "Expert"],
                    },
                },
            ],
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
    },
    {
        timestamps: true,
    }
);

const Resume = model<IResumeDocument, ResumeModel>("resume", resumeSchema);
export default Resume;
