import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { to, subject, content, attachmentUrl } = await req.json();

    const msg: any = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject,
      text: content,
      html: `<p>${content}</p>`,
    };

    // Voeg bijlage toe indien aanwezig
    if (attachmentUrl) {
      const res = await fetch(attachmentUrl);
      if (!res.ok) throw new Error("Fout bij ophalen bijlage");
      const buffer = await res.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");

      msg.attachments = [
        {
          content: base64,
          filename: attachmentUrl.split("/").pop() || "bijlage",
          type: res.headers.get("content-type") || "application/octet-stream",
          disposition: "attachment",
        },
      ];
    }

    await sgMail.send(msg);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("SendGrid fout:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
