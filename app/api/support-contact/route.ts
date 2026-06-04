import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Vul alle velden in" }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "LensLab <noreply@lenslab.nl>",
      to: "hello@lenslab.nl",
      replyTo: email,
      subject: `Support bericht van ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2>Nieuw support bericht</h2>
          <table style="width:100%; border-collapse:collapse;">
            <tr><td style="padding:8px 0; color:#888; width:100px;">Naam</td><td style="padding:8px 0; font-weight:600;">${name}</td></tr>
            <tr><td style="padding:8px 0; color:#888;">E-mail</td><td style="padding:8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
          </table>
          <hr style="border:1px solid #E9E7F0; margin:16px 0;" />
          <h3>Bericht</h3>
          <p style="color:#444; line-height:1.6; white-space:pre-wrap;">${message}</p>
          <hr style="border:1px solid #E9E7F0; margin:16px 0;" />
          <p style="color:#bbb; font-size:12px;">Verstuurd via <a href="https://lenslab.nl/help-support">LensLab Help & Support</a></p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Versturen mislukt, probeer opnieuw" }, { status: 500 });
  }
}
