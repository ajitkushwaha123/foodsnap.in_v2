import dbConnect from "@/lib/dbConnect";
import Otp from "@/models/Otp";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/session";

export const POST = async (req) => {
  try {
    await dbConnect();

    const { phone, otp, name } = await req.json();

    console.log("OTP verification request:", { name , phone, otp });

    if (!phone || !otp) {
      return NextResponse.json(
        { message: "Phone and OTP are required." },
        { status: 400 }
      );
    }

    const record = await Otp.findOne({ phone }).sort({ createdAt: -1 });
    if (!record) {
      return NextResponse.json({ message: "Invalid OTP." }, { status: 400 });
    }

    if (record.expiresAt < new Date()) {
      return NextResponse.json(
        { message: `OTP expired at ${record.expiresAt.toISOString()}` },
        { status: 400 }
      );
    }

    const isValid = await bcrypt.compare(otp, record.otp);
    if (!isValid) {
      return NextResponse.json({ message: "Invalid OTP." }, { status: 400 });
    }

    await Otp.deleteOne({ _id: record._id });

    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({
        phone,
        isActive: true,
        role: "user",
        name,
        credits: 5,
        subscription: {
          plan: "free",
          isActive: false,
          expiresAt: null,
          razorpayOrderId: null,
          razorpayPaymentId: null,
        },
        isPhoneVerified: true,
      });
    } else {
      user.isPhoneVerified = true;
      await user.save();
    }

    console.log("User verified successfully:", user);
    const { token } = await createSession(user._id.toString(), req);

    if (!token) {
      return NextResponse.json(
        { message: "Session creation failed." },
        { status: 500 }
      );
    }

    // Create response
    const response = NextResponse.json({
      message: "OTP verified successfully.",
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name || null,
        role: user.role,
        credits: user.credits,
        subscription: user.subscription,
        isPhoneVerified: user.isPhoneVerified,
      },
    });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 30, 
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Verify OTP error:", err);
    return NextResponse.json(
      { message: "Unexpected server error.", error: err.message },
      { status: 500 }
    );
  }
};
