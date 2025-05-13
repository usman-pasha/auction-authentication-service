import mongoose from "mongoose";
const { Schema } = mongoose;
import { userModel } from "./user.model.js"
import { categoryModel } from "./category.model.js"

const productSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        categoryId: { type: Schema.Types.ObjectId, required: true, ref: "category" },
        auctioneerId: { type: Schema.Types.ObjectId, required: true, ref: "user" },
        condition: { type: String, enum: ["new", "used"], required: true },
        // images: { type: [String], default: [] },
        status: {
            type: String,
            enum: ["listed", "sold", "unsold", "unlisted"],
            default: "listed"
        },
        createdBy: { type: Schema.Types.ObjectId, ref: "user" },
        updatedBy: { type: Schema.Types.ObjectId, ref: "user" },
    },
    { timestamps: true }
);

export const productModel = mongoose.model("product", productSchema);


// Meaning of each status:
// "listed": Product is available and actively shown to users.
// "sold": Product has been sold via auction or directly.
// "unsold": Auction or sale period ended but no one bought it.
// "unlisted": Manually hidden or removed by owner/admin.