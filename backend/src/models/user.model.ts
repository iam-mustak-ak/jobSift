import bcrypt from "bcrypt";
import { model, Schema } from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        role: {
            type: String,
            enum: ["candidate", "recruiter"],
            default: "candidate",
        },
        phone: {
            type: String,
            unique: true,
        },
        location: {
            type: String,
            required: true,
        },
        experience: {
            type: String,
        },
        skills: [
            {
                type: Schema.Types.ObjectId,
                ref: "Skill",
            },
        ],
        educations: [
            {
                degree: {
                    type: String,
                },
                institution: {
                    type: String,
                },
                startDate: {
                    type: Date,
                },
                endDate: {
                    type: Date,
                },
            },
        ],
        resume: {
            type: String,
        },
        about: {
            type: String,
        },
        profilePicture: {
            type: String,
        },
        isAvailableForHire: {
            type: Boolean,
            default: false,
            index: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
            index: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },
        isBlocked: {
            type: Boolean,
            default: false,
            index: true,
        },
        isOnline: {
            type: Boolean,
            default: false,
            index: true,
        },
        lastSeen: {
            type: Date,
            default: Date.now,
            index: true,
        },
        jobPreferences: {
            jobType: {
                type: String,
                enum: ["full-time", "part-time", "contract", "internship"],
            },
            preferredLocation: {
                type: String,
            },
            expectedSalary: {
                type: Number,
            },
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
                url: {
                    type: String,
                },
            },
        ],
        notifications: [
            {
                type: Schema.Types.ObjectId,
                ref: "Notification",
            },
        ],
        appliedJobs: [
            {
                jobId: {
                    type: Schema.Types.ObjectId,
                    ref: "Job",
                },
                dateApplied: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        savedJobs: [
            {
                jobId: {
                    type: Schema.Types.ObjectId,
                    ref: "Job",
                },
                dateSaved: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        savedCandidates: [
            {
                candidateId: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                },
                dateSaved: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        savedRecruiters: [
            {
                recruiterId: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                },
                dateSaved: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        savedCompanies: [
            {
                companyId: {
                    type: Schema.Types.ObjectId,
                    ref: "Company",
                },
                dateSaved: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
userSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};
userSchema.methods.markAsOnline = function () {
    this.isOnline = true;
    this.lastSeen = new Date();
    return this.save();
};
userSchema.methods.markAsOffline = function () {
    this.isOnline = false;
    this.lastSeen = new Date();
    return this.save();
};

const User = model("User", userSchema);
export default User;
