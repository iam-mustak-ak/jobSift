import { model, Schema, Types } from "mongoose";

const companySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
        },
        industry: {
            type: String,
        },
        size: {
            type: String,
            enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
        },
        foundedYear: {
            type: Number,
        },
        website: {
            type: String,
        },
        location: {
            type: String,
        },
        logo: {
            type: String,
        },
        banner: {
            type: String,
        },
        recruiter: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        jobs: [
            {
                type: Types.ObjectId,
                ref: "Job",
            },
        ],
        socialLinks: [
            {
                platform: {
                    type: String,
                },
                url: {
                    type: String,
                },
            },
        ],
        isVerified: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        followers: [
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

const Company = model("Company", companySchema);
export default Company;
