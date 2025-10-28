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
    },
    {
        timestamps: true,
    }
);

const InterViewModel = mongoose.model("Interview", interviewSchema);

export default InterViewModel;
