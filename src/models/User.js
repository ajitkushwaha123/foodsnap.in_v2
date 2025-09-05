import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: "/assets/user-avatar.png",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    credits: {
      type: Number,
      default: 5,
      min: 0,
    },
    subscription: {
      isActive: { type: Boolean, default: false },
      expiresAt: { type: Date, default: null },
      plan: {
        type: String,
        enum: ["free", "pro", "enterprise"],
        default: "free",
      },
      razorpayOrderId: { type: String, default: null },
      razorpayPaymentId: { type: String, default: null },
    },
    totalSearches: { type: Number, default: 0, min: 0 },
    totalImagesDownloaded: { type: Number, default: 0, min: 0 },
    isPhoneVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.index({ phone: 1 });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
