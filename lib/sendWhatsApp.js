import twilio from "twilio";

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH;
const whatsappFrom = process.env.TWILIO_WHATSAPP_NUMBER;

const client = twilio(accountSid, authToken);

/**
 * Send a WhatsApp message to a number.
 * @param {string} to - Recipient phone number in WhatsApp format e.g. whatsapp:+91xxxxxxxxxx
 * @param {string} message - The message to send
 */
export default async function sendWhatsApp(to, message) {
  try {
    const response = await client.messages.create({
      from: whatsappFrom, // e.g. 'whatsapp:+14155238886'
      to: `whatsapp:+91${to}`, // You can pass full or just number if formatted
      body: message,
    });

    console.log("✅ WhatsApp message sent:", response.sid);
    return response.sid;
  } catch (error) {
    console.error("❌ Failed to send WhatsApp:", error);
    throw new Error("Failed to send WhatsApp message");
  }
}