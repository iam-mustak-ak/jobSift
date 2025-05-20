import { model, Schema } from "mongoose";

const skillSchema = new Schema(
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

const Skill = model("Skill", skillSchema);
export default Skill;
