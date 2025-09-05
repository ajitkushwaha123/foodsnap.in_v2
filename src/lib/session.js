import jwt from "jsonwebtoken";
import { UAParser } from "ua-parser-js";
import Session from "@/models/Session";

export async function createSession(userId, req) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "0.0.0.0";

  const userAgentString = req.headers.get("user-agent") || "";
  const parser = new UAParser(userAgentString);
  const result = parser.getResult();

  const device = {
    userAgent: userAgentString,
    browser: result.browser.name || "unknown",
    os: result.os.name || "unknown",
    type: result.device.type || "desktop",
    vendor: result.device.vendor || "unknown",
    model: result.device.model || "unknown",
  };

  const location = "unknown";

  const token = jwt.sign({ userId, ip, device }, process.env.JWT_SECRET, {
    expiresIn: "30m",
  });

  await Session.deleteMany({ userId });

  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  const session = await Session.create({
    userId,
    ip,
    device,
    location,
    token,
    expiresAt,
  });

  return session;
}

export async function getSession(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const session = await Session.findOne({ token }).populate("userId");
    if (!session) return null;

    return {
      session,
      user: session.userId,
    };
  } catch (err) {
    return null;
  }
}
