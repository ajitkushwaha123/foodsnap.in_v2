import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  device: {
    userAgent: { type: String },
    browser: { type: String },
    os: { type: String },
    type: { type: String },
    vendor: { type: String },
    model: { type: String },
  },
  ip: { type: String },
  location: { type: String },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Session =
  mongoose.models.Session || mongoose.model("Session", SessionSchema);

export default Session;
