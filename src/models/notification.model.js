import mongoose from "mongoose";
const schema = mongoose.Schema;

const notificationSchema = new schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['sent', 'failed', 'pending'], required: true },
    sentAt: { type: Date },
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'template' },
}, { timestamps: true });

export const notificationModel = mongoose.model('notification', notificationSchema);
