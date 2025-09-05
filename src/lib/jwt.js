import jwt from "jsonwebtoken";

export function createJwtToken(user) {
  return jwt.sign(
    { userId: user._id, phone: user.phone },
    process.env.JWT_SECRET,
    { expiresIn: "30m" }
  );
}
