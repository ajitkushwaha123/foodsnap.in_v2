import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    features: {
      type: [String],
      default: [],
    },
    duration: {
      type: Number,
      default: 30,
    },
    discount: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    credits: {
      type: Number,
      required: true,
    },
    maxDownloads: {
      type: Number,
      default: 0,
    },
    highlight: {
      type: Boolean,
      default: false,
    },
    redirectUrl: {
      type: String,
      default: "",
    },
    buttonText: {
      type: String,
      default: "Get Started",
    },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
