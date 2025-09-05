import { sendOtpMessage } from "@/helpers";
import { generateAndSaveOtp } from "@/helpers/function";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    await dbConnect();

    const { phone } = await req.json();
    if (!phone) {
      return NextResponse.json(
        { message: "Phone number is required" },
        { status: 400 }
      );
    }

    const otp = await generateAndSaveOtp({ phone });

    try {
      await sendOtpMessage({ phone, otp });
    } catch (sendErr) {
      console.error("OTP sending failed:", sendErr);
      return NextResponse.json(
        { message: "Failed to send OTP. Please try again later." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        message: "OTP sent successfully. Please verify your OTP.",
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
