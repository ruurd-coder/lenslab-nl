import { createClient, createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const { photographerId, senderName, senderEmail, senderPhone, message } = await request.json();

    if (!photographerId || !senderName || !senderEmail || !message) {
      return NextResponse.json({ error: "Vul alle verplichte velden in" }, { status: 400 });
    }

    // Haal fotografen email op — server-side, nooit exposed aan frontend
    const supabase = await createClient();
    const { data: photographer } = await supabase
      .from("photographers")
      .select("email, business_name, contact_name")
      .eq("id", photographerId)
      .single();

    if (!photographer?.email) {
      return NextResponse.json({ error: "Fotograaf niet gevonden" }, { status: 404 });
    }

    // Sla bericht op in database
    const serviceSupabase = await createServiceClient();
    await serviceSupabase.from("contact_messages").insert({
      photographer_id: photographerId,
      sender_name: senderName,
      sender_email: senderEmail,
      sender_phone: senderPhone || null,
      message,
    });

    const resend = new Resend(process.env.RESEND_API_KEY);

    const subject = `Nieuw bericht via LensLab — ${photographer.business_name}`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #111;">Nieuw contactbericht via LensLab</h2>
        <p>Je hebt een nieuw bericht ontvangen van <strong>${senderName}</strong> via je LensLab profiel.</p>
        <hr style="border: 1px solid #E9E7F0; margin: 20px 0;" />
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #888; width: 120px;">Naam</td><td style="padding: 8px 0; font-weight: 600;">${senderName}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">E-mail</td><td style="padding: 8px 0;"><a href="mailto:${senderEmail}" style="color: #111;">${senderEmail}</a></td></tr>
          ${senderPhone ? `<tr><td style="padding: 8px 0; color: #888;">Telefoon</td><td style="padding: 8px 0;">${senderPhone}</td></tr>` : ""}
        </table>
        <hr style="border: 1px solid #E9E7F0; margin: 20px 0;" />
        <h3 style="color: #111; margin-bottom: 8px;">Bericht</h3>
        <p style="color: #444; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        <hr style="border: 1px solid #E9E7F0; margin: 20px 0;" />
        <p style="color: #888; font-size: 13px;">Beantwoord dit bericht door direct te mailen naar <a href="mailto:${senderEmail}">${senderEmail}</a></p>
        <p style="color: #bbb; font-size: 12px;">Verstuurd via <a href="https://lenslab.nl" style="color: #bbb;">LensLab.nl</a></p>
      </div>
    `;

    // Stuur naar fotograaf
    await resend.emails.send({
      from: "LensLab <noreply@lenslab.nl>",
      to: photographer.email,
      replyTo: senderEmail,
      subject,
      html,
    });

    // Stuur kopie naar LensLab
    await resend.emails.send({
      from: "LensLab <noreply@lenslab.nl>",
      to: "hello@lenslab.nl",
      replyTo: senderEmail,
      subject: `[KOPIE] ${subject}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Versturen mislukt, probeer opnieuw" }, { status: 500 });
  }
}
