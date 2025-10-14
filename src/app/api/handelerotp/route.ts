import { NextResponse } from "next/server";
import Mailjet from "node-mailjet";

export async function POST(req: Request) {
  try {
    const { email, otp, academicId } = await req.json();
    console.log("email:", email, "otp:", otp);

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Missing email or otp" },
        { status: 400 }
      );
    }

    const subject = "Your HTI Year 4 Verification Code";
    const textPart = `Hello ${academicId || "User"},\n\nYour verification code (OTP) is: ${otp}\n\nPlease use this code to complete your registration.`;
    const htmlPart = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <p>Hello ${academicId || "User"},</p>
          <p>Your verification code (OTP) is: <b style="font-size: 18px;">${otp}</b></p>
          <p>Please use this code to complete your registration.</p>
          <p>Regards,<br>HTI Year 4 Team</p>
        </body>
      </html>
    `;

    const mailjet = Mailjet.apiConnect(
      process.env.MAILJET_API_KEY!,
      process.env.MAILJET_SECRET_KEY!
    );

    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: { Email: "hti.year4@gmail.com", Name: "HTI Year 4" },
          To: [{ Email: email }],
          Subject: subject,
          TextPart: textPart,
          HTMLPart: htmlPart,
        },
      ],
    });

    const result = await request;
    console.log("Mailjet response:", result.body);

    return NextResponse.json(
      { success: true, message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in handelerotp:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
