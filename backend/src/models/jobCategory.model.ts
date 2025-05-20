import { model, Schema } from "mongoose";

const jobCategorySchema = new Schema(
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
    },
    {
        timestamps: true,
    }
);

const JobCategory = model("JobCategory", jobCategorySchema);
export default JobCategory;
