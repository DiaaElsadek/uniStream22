import { NextApiRequest, NextApiResponse } from "next";
import Mailjet from "node-mailjet";

type Data = { success: boolean; message?: string; error?: string };

export async function POST(req: Request) {
    try {
        // console.log("handelerotp called");
        // console.log("MAILJET_API_KEY:", process.env.MAILJET_API_KEY ? "defined" : "undefined");
        // console.log("MAILJET_SECRET_KEY:", process.env.MAILJET_SECRET_KEY ? "defined" : "undefined");

        const { email, otp, academicId } = await req.json();
        console.log("email:", email, "otp:", otp);

        // Email TEMP Form
        const subject = "Your HTI Year 4 Verification Code";
        const textPart = `Hello ${academicId || "User"},\n\nYour verification code (OTP) is: ${otp}\n\nPlease use this code to complete your registration.\n\nIf you didn't request this, just ignore this email.\n\nRegards,\nHTI Year 4 Team`;

        const htmlPart = `
  <html>
    <body style="font-family: Arial, sans-serif; color: #333;">
      <p>Hello ${academicId || "User"},</p>
      <p>Thank you for signing up at <strong>HTI Year 4 Portal</strong>.</p>
      <p>Your verification code (OTP) is: <b style="font-size: 18px;">${otp}</b></p>
      <p>Please use this code to complete your registration.</p>
      <p>If you did not request this code, you can safely ignore this email.</p>
      <br>
      <p>Regards,<br>HTI Year 4 Team</p>
      <hr style="border:none;border-top:1px solid #eee;">
      <p style="font-size:12px; color:#888;">You received this email because you registered at HTI Year 4 Portal.</p>
    </body>
  </html>
        `;

        // اتصال Mailjet
        const mailjet = Mailjet.apiConnect(
            process.env.MAILJET_API_KEY!,
            process.env.MAILJET_SECRET_KEY!
        );

        await mailjet.post("send", { version: "v3.1" }).request({
            Messages: [
                {
                    From: { Email: "diaadido1246@gmail.com", Name: "HTI Year 4" },
                    To: [{ Email: email }],
                    Subject: subject,
                    TextPart: textPart,
                    HTMLPart: htmlPart,
                },
            ],
        });

        return new Response(JSON.stringify({ success: true, message: "OTP sent" }), { status: 200 });
    } catch (err: any) {
        console.error("handelerotp error:", err);
        return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
    }
}
