import axios from "axios";

const BASE_URL = "https://www.easysendsms.app/api/v1/send/";

/**
 * ✅ Send SMS via EasySendSMS API
 * @param to Recipient phone number (e.g. 639171234567)
 * @param text Message body
 * @param senderid Optional sender ID (default: "MyApp")
 */
export async function sendSms(
  to: string,
  text: string,
  senderid = "GeoTech Alert"
) {
  try {
    const params = {
      user: process.env.NEXT_PUBLIC_EASYSENDSMS_USER,
      password: process.env.NEXT_PUBLIC_EASYSENDSMS_PASS,
      to,
      text,
      type: "text",
      senderid,
    };

    const res = await axios.get(BASE_URL, { params });

    // EasySendSMS returns plain text (e.g. "OK" or "ERROR: Invalid Number")
    return res.data;
  } catch (err: any) {
    console.error("❌ Error sending SMS:", err.message);
    throw new Error(err.response?.data || err.message);
  }
}
