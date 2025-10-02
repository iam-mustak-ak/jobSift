import bcrypt from "bcrypt";
import { model, Schema } from "mongoose";
import { IUserDocument, UserModel } from "./model-types/userTypes";

const userSchema = new Schema<IUserDocument, UserModel>(
    {
        name: String,
        email: { type: String, required: true, unique: true },
        password: {
            type: String,
            required: function () {
                return !this.isOAuthUser;
            },
        },
        role: {
            type: String,
            enum: ["candidate", "recruiter"],
            default: "candidate",
        },
        isOAuthUser: {
            type: Boolean,
            default: false,
        },
        phone: { type: String },
        location: String,
        experience: String,
        skills: [String],
        bio: {
            type: String,
            default: "",
        },
        educations: [
            {
                degree: String,
                institution: String,
                startDate: Date,
                endDate: Date,
            },
        ],
        resume: String,
        about: String,
        profilePicture: String,
        isAvailableForHire: { type: Boolean, default: false },
        isVerified: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        isBlocked: { type: Boolean, default: false },
        isOnline: { type: Boolean, default: false },
        lastSeen: { type: Date, default: Date.now },
        jobPreferences: {
            jobType: {
                type: String,
                enum: ["full-time", "part-time", "contract", "internship"],
            },
            preferredLocation: String,
            expectedSalary: Number,
        },
        socialLinks: [
            {
                platform: {
                    type: String,
                    enum: [
                        "LinkedIn",
                        "GitHub",
                        "Twitter",
                        "Facebook",
                        "Instagram",
                        "Other",
                    ],
                },
                url: String,
                logo: String,
            },
        ],
        notifications: [{ type: Schema.Types.ObjectId, ref: "Notification" }],
        appliedJobs: [
            {
                jobId: { type: Schema.Types.ObjectId, ref: "Job" },
                dateApplied: { type: Date, default: Date.now },
            },
        ],
        savedJobs: [
            {
                jobId: { type: Schema.Types.ObjectId, ref: "Job" },
                dateSaved: { type: Date, default: Date.now },
            },
        ],
        savedCandidates: [
            {
                candidateId: { type: Schema.Types.ObjectId, ref: "User" },
                dateSaved: { type: Date, default: Date.now },
            },
        ],
        savedRecruiters: [
            {
                recruiterId: { type: Schema.Types.ObjectId, ref: "User" },
                dateSaved: { type: Date, default: Date.now },
            },
        ],
        savedCompanies: [
            {
                companyId: { type: Schema.Types.ObjectId, ref: "Company" },
                dateSaved: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

// Pre-save hook for password hashing
userSchema.pre<IUserDocument>("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = model<IUserDocument, UserModel>("User", userSchema);
export default User;
