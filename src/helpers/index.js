import axios from "axios";

export const registerUser = async ({ phone }) => {
  try {
    if (!phone) throw new Error("Phone number is required");

    const { data } = await axios.post("/api/send-otp", { phone });

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.error("Error registering user:", err.response?.data || err.message);
    return {
      success: false,
      error:
        err.response?.data?.message ||
        err.message ||
        "Failed to send OTP. Please try again.",
    };
  }
};

export const verifyOtp = async ({ name, phone, otp }) => {
  try {
    if (!phone || !otp || !name)
      throw new Error("Phone, OTP and Name are required");

    console.log("OTP verification request:", { name, phone, otp });

    const { data } = await axios.post("/api/verify-otp", { name, phone, otp });

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.error(
      "OTP verification failed:",
      err.response?.data || err.message
    );
    return {
      success: false,
      error:
        err.response?.data?.message ||
        err.message ||
        "OTP verification failed. Please try again.",
    };
  }
};

export const getUser = async () => {};

export const fetchSubscriptions = async () => {
  try {
    const { data } = await axios.get("/api/subscription");
    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (err) {
    console.error(
      "Error fetching subscriptions:",
      err.response?.data || err.message
    );
    return {
      success: false,
      error:
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch subscriptions. Please try again.",
    };
  }
};
