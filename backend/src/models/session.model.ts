import { model, Schema, Types } from "mongoose";

const sessionSchema = new Schema(
    {
        user: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        token: {
            type: String,
            required: true,
        },
        userAgent: {
            type: String,
        },
        ipAddress: {
            type: String,
        },
        isValid: {
            type: Boolean,
            default: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Session = model("Session", sessionSchema);
export default Session;
