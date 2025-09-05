import dbConnect from "@/lib/dbConnect";
import Otp from "@/models/Otp";
import otpGenerator from "otp-generator";
import bcrypt from "bcryptjs";

export const generateOtp = (length = 6) => {
  if (length <= 0) throw new Error("OTP length must be greater than 0");
  return otpGenerator.generate(length, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
    digits: true,
  });
};

const OTP_EXPIRY_MINUTES = 15;
const OTP_COOLDOWN_SECONDS = 60;

export const generateAndSaveOtp = async ({ phone }) => {
  if (!phone) throw new Error("Phone number is required");

  await dbConnect();

  const lastOtp = await Otp.findOne({ phone });

  if (lastOtp) {
    const secondsSinceLastRequest =
      (Date.now() - lastOtp.requestedAt.getTime()) / 1000;

    if (secondsSinceLastRequest < OTP_COOLDOWN_SECONDS) {
      throw new Error(
        `Too many requests. Please wait ${Math.ceil(
          OTP_COOLDOWN_SECONDS - secondsSinceLastRequest
        )} seconds before requesting another OTP.`
      );
    }
  }

  const otp = generateOtp(6);

  const hashedOtp = await bcrypt.hash(otp, 10);

  await Otp.findOneAndUpdate(
    { phone },
    {
      otp: hashedOtp,
      requestedAt: new Date(),
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
    },
    { upsert: true, new: true }
  );

  return otp;
};
