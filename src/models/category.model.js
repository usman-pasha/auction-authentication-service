import mongoose from "mongoose";
const schema = mongoose.Schema;
import { userModel } from "./user.model.js"

const categorySchema = new schema(
    {
        categoryName: { type: String },
        categoryDescription: { type: String },
        status: {
            type: String,
            default: "active",
            enum: ["active", "deleted"],
        },
        createdBy: { type: schema.Types.ObjectId, ref: "user" },
        updatedBy: { type: schema.Types.ObjectId, ref: "user" },
    },
    { timestamps: true }
);

export const categoryModel = mongoose.model("category", categorySchema);
