import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const token = req.cookies.get("token")?.value;

    const response = NextResponse.json({
      message: "Logged out successfully.",
    });

    response.cookies.set({
      name: "token",
      value: "",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json(
      { message: "Unexpected server error.", error: err.message },
      { status: 500 }
    );
  }
};
