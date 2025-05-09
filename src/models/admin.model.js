import mongoose from "mongoose";
const schema = mongoose.Schema;

const adminSchema = new schema(
    {
        fullName: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        preferences: {
            notificationChannel: { type: String, enum: ['email', 'sms'], required: true },
            timezone: { type: String, required: true }
        },
        status: { type: String, enum: ["active", "inactive"], default: "inactive" },
    },
    { timestamps: true }
);

adminSchema.index({ email: true })

export const adminModel = mongoose.model("admin", adminSchema);
