import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
    {
        role: String,
        type: String,
        level: String,
        questions: [String],
        userid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        jobid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
        },
    },
    {
        timestamps: true,
    }
);

const InterViewModel = mongoose.model("InterView", interviewSchema);

export default InterViewModel;
