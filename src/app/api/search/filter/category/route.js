import { slugifyCategory } from "@/lib/slugify";
import Image from "@/models/Image";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    const categories = await Image.distinct("category", {
      category: { $ne: null },
    });

    return NextResponse.json(
      {
        data: categories.map((cat) => ({
          label: cat,
          value: slugifyCategory(cat), 
        })),
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: err.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
};
