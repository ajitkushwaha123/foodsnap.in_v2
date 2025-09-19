import Image from "@/models/Image";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    const images = await Image.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        images,
        message: "Latest images fetched successfully",
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: err.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
};
