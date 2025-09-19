import Subscription from "@/models/Subscription";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    const subscriptions = await Subscription.find().sort({ price: 1 });

    return NextResponse.json(
      {
        data: subscriptions,
        message: "Subscriptions fetched successfully",
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
