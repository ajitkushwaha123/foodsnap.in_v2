import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

const JWT_SECRET = process.env.JWT_SECRET;

export const getUserId = async () => {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    console.log("[JWT_TOKEN]", token);

    const decoded = jwt.verify(token, JWT_SECRET);

    console.log("[JWT_DECODED]", decoded);

    if (!decoded) return null;

    const user = await User.findById(decoded.userId);

    return {
      userId: decoded.userId,
    };
  } catch (error) {
    console.error("Error fetching user ID:", error);
    return null;
  }
};

export const updateCredits = async (userId, amount) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      return { success: false, message: "User not found" };
    }

    user.credits -= amount;

    if (user.credits < 0) {
      return { success: false, message: "Insufficient credits" };
    }

    if (user.credits === 0) {
      user.subscription.isActive = false;
    }

    await user.save();

    return { success: true, credits: user.credits };
  } catch (error) {
    console.error("Error updating credits:", error);
    return { success: false, message: "Failed to update credits" };
  }
};

