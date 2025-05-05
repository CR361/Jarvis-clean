import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Ontvangen body:", body);

    const { to, subject, content, contractId } = body;

    if (!to || !subject || !content || !contractId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const signUrl = `http://192.168.56.1:3000/contracts/sign/${contractId}`;
    const htmlContent = `
      <p>${content.replace(/\n/g, "<br>")}</p>
      <br>
      <p><strong>Onderteken dit contract via de volgende link:</strong></p>
      <p><a href="${signUrl}" target="_blank">${signUrl}</a></p>
    `;

    const msg = {
      to,
      from: "creadifitycontact@gmail.com",
      subject,
      text: `${content}\n\nOnderteken dit contract: ${signUrl}`,
      html: htmlContent,
    };

    await sgMail.send(msg);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("SendGrid error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

