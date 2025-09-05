import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = ["/login", "/register"];
const PUBLIC_API = [
  "/api/login",
  "/api/register",
  "/api/send-otp",
  "/api/verify-otp",
  "/api/image/upload",
  "/api/image/analyze",
];

async function verifyJwtToken(token) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (e) {
    return null;
  }
}

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const isPublicPage = PUBLIC_ROUTES.some((p) => pathname.startsWith(p));
  const isPublicApi = PUBLIC_API.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (!token) {
    if (isPublicPage || isPublicApi) return NextResponse.next();

    if (pathname.startsWith("/api")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname === "/login" || pathname === "/register") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const decoded = await verifyJwtToken(token);
  if (!decoded) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);

    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete("token");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo.png|videos/dashboard-video.mp4|public|api/auth).*)",
  ],
};
