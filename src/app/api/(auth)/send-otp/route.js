import { generateAndSaveOtp } from "@/helpers/function";
import dbConnect from "@/lib/dbConnect";
import axios from "axios";
import { NextResponse } from "next/server";

const buildPayload = ({ phone, template_name, locale, otp }) => ({
  messaging_product: "whatsapp",
  recipient_type: "individual",
  to: phone,
  type: "template",
  template: {
    name: template_name,
    language: { code: locale },
    components: [
      {
        type: "body",
        parameters: [
          { type: "text", text: otp },
          { type: "text", text: "8178739633" },
        ],
      },
      {
        type: "button",
        sub_type: "url",
        index: "0",
        parameters: [{ type: "text", text: otp }],
      },
    ],
  },
});

export const POST = async (req) => {
  try {
    await dbConnect();

    const body = await req.json();
    const { phone } = body;
    const otp = await generateAndSaveOtp({ phone });

    console.log("otp", otp);

    if (!phone || !otp) {
      return NextResponse.json(
        { message: "Phone and OTP are required" },
        { status: 400 }
      );
    }

    const payload = buildPayload({
      phone,
      template_name: "foodsnap_otp_message",
      locale: "en_us",
      otp,
    });

    // const response = await axios.post(
    //   `${process.env.META_GRAPH_URL}/${process.env.META_WA_PHONE_NUMBER_ID}/messages`,
    //   payload,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${process.env.META_WA_ACCESS_TOKEN}`,
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    // console.log("WhatsApp API response:", response.data);

    // if (response.status === 200) {
    //   return NextResponse.json({ message: "OTP sent successfully", otp });
    // }

    // return NextResponse.json(
    //   { message: "Failed to send OTP" },
    //   { status: response.status }
    // );

    return NextResponse.json({});
  } catch (err) {
    console.error(
      "Error while sending OTP:",
      err.response?.data || err.message
    );
    return NextResponse.json(
      {
        message:
          err.response?.data?.error?.message ||
          err.message ||
          "Internal Server Error",
      },
      { status: err.response?.status || 500 }
    );
  }
};
