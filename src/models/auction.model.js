import mongoose from "mongoose";
const { Schema } = mongoose;
import { userModel } from "./user.model.js"
import { productModel } from "./product.model.js"

const auctionSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, required: true, ref: "product" },
    auctioneerId: { type: Schema.Types.ObjectId, required: true, ref: "user" },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },

    // "timeRemaining": "3600" // seconds or human readable.
    startPrice: { type: Number, required: true },
    reservePrice: { type: Number, required: true },
    status: { type: String, enum: ['upcoming', 'active', 'closed'], default: 'upcoming' },
    bidIds: [{ type: Schema.Types.ObjectId, ref: 'bid' }],
    currentBidPrice: { type: Number, default: 0 },
    highestBid: {
      bidderId: { type: Schema.Types.ObjectId, ref: "user" },
      amount: { type: Number, default: 0 },
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

export const auctionModel = mongoose.model("auction", auctionSchema);
