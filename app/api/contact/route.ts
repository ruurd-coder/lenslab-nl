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
    const subject = `Een nieuwe aanvraag via LensLab voor ${photographer.business_name}`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
        <p>Hi ${firstName},</p>
        <p>Je hebt een nieuwe aanvraag binnen gekregen van <strong>${senderName}</strong> via LensLab.</p>
        <p>
          <strong>Naam:</strong> ${senderName}<br/>
          <strong>Email:</strong> <a href="mailto:${senderEmail}" style="color: #111;">${senderEmail}</a><br/>
          ${senderPhone ? `<strong>Telefoon:</strong> ${senderPhone}<br/>` : ""}
        </p>
        <p><strong>Bericht</strong></p>
        <p style="color: #444; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        <p>Je kunt dit bericht direct beantwoorden door te mailen naar <a href="mailto:${senderEmail}" style="color: #111;">${senderEmail}</a>. Al je aanvragen kun je ook gemakkelijk terugvinden in het Dashboard van je LensLab profiel, log eenvoudig in via <a href="https://www.lenslab.nl/login" style="color: #111;">deze link</a>.</p>
        <p>Mocht je vragen hebben dan horen we het graag. Chat direct met ons via <a href="https://wa.me/31702042750" style="color: #111;">WhatsApp</a>.</p>
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
