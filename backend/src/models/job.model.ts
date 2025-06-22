import { model, Schema, Types } from "mongoose";

const jobSchema = new Schema(
    {
        jobId: {
            type: Number,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        jobType: {
            type: String,
            enum: [
                "full-time",
                "part-time",
                "contract",
                "internship",
                "temporary",
            ],
            required: true,
        },
        employmentMode: {
            type: String,
            enum: ["remote", "onsite", "hybrid"],
            default: "onsite",
        },
        location: {
            type: String,
        },
        salaryRange: {
            min: { type: Number },
            max: { type: Number },
        },
        experienceLevel: {
            type: String,
            enum: ["entry", "mid", "senior", "lead"],
        },
        recruiter: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        company: {
            type: Types.ObjectId,
            ref: "Company",
        },
        skillsRequired: {
            type: [String],
            default: [],
        },
        jobCategory: [
            {
                type: Schema.Types.ObjectId,
                ref: "JobCategory",
                required: true,
            },
        ],

        openings: {
            type: Number,
            default: 1,
        },
        deadline: {
            type: Date,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        applicants: [
            {
                user: {
                    type: Types.ObjectId,
                    ref: "User",
                },
                resume: {
                    type: String,
                },
                coverLetter: {
                    type: String,
                },
                dateApplied: {
                    type: Date,
                    default: Date.now,
                },
                status: {
                    type: String,
                    enum: [
                        "applied",
                        "shortlisted",
                        "interview",
                        "offered",
                        "rejected",
                    ],
                    default: "applied",
                },
            },
        ],
        tags: {
            type: [String],
            default: [],
        },
        views: {
            type: Number,
            default: 0,
        },
        bookmarkedBy: [
            {
                type: Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    }
);

jobSchema.index({ title: "text", description: "text", skillsRequired: 1 });

const Job = model("Job", jobSchema);
export default Job;
