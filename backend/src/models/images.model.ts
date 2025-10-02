import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
    {
        imageUrl: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["resume", "jobs", "profile"],
            required: true,
        },
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
        },
        resumeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "resume",
        },
    },
    {
        timestamps: true,
    }
);

const ImageModel = mongoose.model("Image", imageSchema);

export default ImageModel;
