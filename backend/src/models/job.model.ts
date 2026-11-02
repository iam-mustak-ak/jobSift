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
            default: "",
        },
        jobType: {
            type: String,
            required: true,
            default: "full-time",
        },
        url: {
            type: String,
        },
        employmentMode: {
            type: String,
            default: "Remote",
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
            default: "entry",
        },

        company: {
            type: Types.ObjectId,
            ref: "Company",
        },
        recruiter: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        skillsRequired: [
            {
                type: Schema.Types.ObjectId,
                ref: "Skill",
            },
        ],
        jobCategory: [
            {
                type: Schema.Types.ObjectId,
                ref: "JobCategory",
                required: true,
            },
        ],

        openings: {
            type: Date,
            default: Date.now(),
        },
        deadline: {
            type: Date,
        },
        isDraft: {
            type: Boolean,
            default: false,
        },
        isPublished: {
            type: Boolean,
            default: false,
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
                candidateId: {
                    type: Types.ObjectId,
                    ref: "User",
                },
                user: {
                    type: String,
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
                        "reviewing",
                        "shortlisted",
                        "interview",
                        "offered",
                        "hired",
                        "rejected",
                    ],
                    default: "applied",
                },
                statusNote: {
                    type: String,
                    maxlength: 500,
                    default: "",
                },
                statusHistory: [
                    {
                        status: {
                            type: String,
                            enum: ["applied", "reviewing", "shortlisted", "interview", "offered", "hired", "rejected"],
                            required: true,
                        },
                        note: { type: String, maxlength: 500, default: "" },
                        changedAt: { type: Date, default: Date.now },
                        changedBy: { type: Types.ObjectId, ref: "User" },
                    },
                ],
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

jobSchema.index({ title: "text", description: "text", location: "text" });

const Job = model("Job", jobSchema);
export default Job;
