import { NextResponse } from "next/server";
import { getUserId } from "@/helpers/auth";
import User from "@/models/User"; // ✅ MongoDB model

export const GET = async (req) => {
  try {
    const { userId } = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please login first." },
        { status: 401 }
      );
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User fetched successfully.",
        data: user,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /user error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
};
