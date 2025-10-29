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
            required: true,
        },
        url: {
            type: String,
        },
        employmentMode: {
            type: String,
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

jobSchema.index({ title: "text", description: "text", location: "text" });

const Job = model("Job", jobSchema);
export default Job;
