import { model, Schema, Types } from "mongoose";

const reportSchema = new Schema(
    {
        reporter: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        reportedUser: {
            type: Types.ObjectId,
            ref: "User",
        },
        reportedJob: {
            type: Types.ObjectId,
            ref: "Job",
        },
        reportedCompany: {
            type: Types.ObjectId,
            ref: "Company",
        },
        reason: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        status: {
            type: String,
            enum: ["pending", "reviewed", "resolved", "rejected"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

const Report = model("Report", reportSchema);
export default Report;
