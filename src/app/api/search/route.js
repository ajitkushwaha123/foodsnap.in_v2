import Image from "@/models/Image";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 }).limit(10);
    return NextResponse.json(
      {
        data: images,
        message: "Images fetched successfully",
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};
