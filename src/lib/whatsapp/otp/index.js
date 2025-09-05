export const sendOtp = async (phone) => {
  try {
    const response = await axios.post("/api/send-otp", { phone });
    return response.data;
  } catch (err) {
    console.error(err);
  }
};
