import { Worker } from "bullmq";
import Redis from "ioredis";
import axios from "axios";
import dotenv from "dotenv";
import { uploadToS3 } from "../uploadToAws.js";
import dbConnect from "../../dbConnect.js";

dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error("Missing MONGODB_URI in .env file");
}
if (!process.env.REDIS_URL) {
  throw new Error("Missing REDIS_URL in .env file");
}
if (!process.env.NEXT_PUBLIC_BASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_BASE_URL in .env file");
}

const connection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  "productQueue",
  async (job) => {
    try {
      const {
        title,
        category,
        sub_category,
        food_type,
        description,
        resId,
        file,
      } = job.data;

      await dbConnect();

      const imageUrl = await uploadToS3(file);

      console.log(imageUrl);

      return;
      if (!imageUrl) throw new Error("S3 upload failed");

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/library/analyze`,
        {
          image_url: imageUrl,
          title,
          category,
          sub_category,
          food_type,
          description,
          resId,
        }
      );
    } catch (err) {
      console.error(`[Job ${job.id}] ❌ Failed: ${err.message}`);
      throw err;
    }
  },
  {
    connection,
    concurrency: 1,
    limiter: {
      max: 1,
      duration: 30000,
    },
  }
);

console.log("🚀 Worker started and listening for jobs in 'productQueue' queue");

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed: ${err.message}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Closing worker...");
  worker.close().then(() => process.exit(0));
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Closing worker...");
  worker.close().then(() => process.exit(0));
});

export default worker;
