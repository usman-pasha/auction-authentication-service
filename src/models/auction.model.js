import mongoose from "mongoose";
const { Schema } = mongoose;
import { userModel } from "./user.model.js"
import { categoryModel } from "./category.model.js"

const auctionSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, required: true, ref: "category" },
    auctioneerId: { type: Schema.Types.ObjectId, required: true, ref: "user" },
    startTime: { type: String, },
    endTime: { type: String, },
    startPrice: { type: Number, required: true },
    reservePrice: { type: Number, required: true },
    status: { type: String, enum: ['upcoming', 'active', 'closed'], default: 'upcoming' },
    // images: { type: [String], required: true },
    bidIds: [{ type: Schema.Types.ObjectId, ref: 'bid' }],
    currentBidPrice: { type: Number, default: 0 },
    highestBid: { // Reference to the highest bid
      bidderId: { type: Schema.Types.ObjectId, ref: "user" },
      amount: { type: Number, default: 0 },
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

export const auctionModel = mongoose.model('auction', auctionSchema);
