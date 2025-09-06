// bid.model.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const bidSchema = new Schema(
    {
        auctionProductId: { type: Schema.Types.ObjectId, ref: "auction", required: true }, 
        userId: { type: Schema.Types.ObjectId, ref: "user", required: true }, 
        bidAmount: { type: Number, required: true }, // The amount of the bid
        bidTime: { type: Date, default: Date.now }, // Time when the bid was placed
    },
    { timestamps: true }
);

export const bidModel = mongoose.model("bid", bidSchema);
