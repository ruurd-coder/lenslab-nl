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

    const firstName = photographer.contact_name?.split(" ")[0] || photographer.business_name;
    const subject = `🎉 Nieuwe aanvraag via LensLab van ${senderName}`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
        <p>Hi ${firstName},</p>
        <p>Goed nieuws! Je hebt een nieuwe aanvraag ontvangen via LensLab.</p>
        <hr style="border: 1px solid #E9E7F0; margin: 20px 0;" />
        <p><strong>Aanvrager</strong><br/>
        Naam: ${senderName}<br/>
        E-mail: <a href="mailto:${senderEmail}" style="color: #111;">${senderEmail}</a><br/>
        ${senderPhone ? `Telefoon: ${senderPhone}<br/>` : ""}
        </p>
        <hr style="border: 1px solid #E9E7F0; margin: 20px 0;" />
        <p><strong>Bericht</strong><br/>
        <span style="color: #444; line-height: 1.6; white-space: pre-wrap;">${message}</span></p>
        <hr style="border: 1px solid #E9E7F0; margin: 20px 0;" />
        <p>Je kunt direct reageren door een e-mail te sturen naar <a href="mailto:${senderEmail}" style="color: #111;">${senderEmail}</a>.</p>
        <p>Alle aanvragen vind je ook terug in het dashboard van je LensLab-profiel. Log eenvoudig in via <a href="https://www.lenslab.nl/login" style="color: #111;">deze link</a>.</p>
        <p>We hopen natuurlijk dat hier een mooie opdracht uit voortkomt.</p>
        <p>Heb je vragen? Stuur ons gerust een <a href="https://wa.me/31702042750" style="color: #111;">WhatsApp-bericht</a>, we helpen je graag verder.</p>
        <p>Succes!<br/><br/>Team LensLab</p>
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
      subject: `[KOPIE] Een nieuwe aanvraag via LensLab voor ${photographer.business_name}`,
      html,
    });

    // Stuur bevestiging aan afzender
    await resend.emails.send({
      from: "LensLab <noreply@lenslab.nl>",
      to: senderEmail,
      subject: `Je bericht aan ${photographer.business_name} is verstuurd 🙌`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
          <p>Hoi ${senderName},</p>
          <p>Goed nieuws! Je bericht is succesvol verstuurd naar <strong>${photographer.business_name}</strong>.</p>
          <p>De beeldmaker heeft je aanvraag ontvangen en zal binnenkort contact met je opnemen.</p>
          <hr style="border: 1px solid #E9E7F0; margin: 20px 0;" />
          <p><strong>Dit heb je verstuurd:</strong></p>
          <p style="color: #444; line-height: 1.6; white-space: pre-wrap; font-style: italic;">"${message}"</p>
          <hr style="border: 1px solid #E9E7F0; margin: 20px 0;" />
          <p>In de tussentijd kun je rustig achteroverleunen. Heb je toch nog een vraag? Dan staan we voor je klaar via <a href="https://wa.me/31702042750" style="color: #111;">WhatsApp</a>.</p>
          <p>Groet,<br/><br/>Team LensLab</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Versturen mislukt, probeer opnieuw" }, { status: 500 });
  }
}
