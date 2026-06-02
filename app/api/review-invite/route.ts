import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const { photographerId, clientEmail, clientName, personalMessage } = await request.json();

    if (!photographerId || !clientEmail) {
      return NextResponse.json({ error: "Vul alle velden in" }, { status: 400 });
    }

    const supabase = await createClient();

    // Controleer dat de ingelogde user de eigenaar is van dit profiel
    const { data: { user } } = await supabase.auth.getUser();
    const { data: photographer } = await supabase
      .from("photographers")
      .select("business_name, slug, contact_name")
      .eq("id", photographerId)
      .single();

    if (!photographer) {
      return NextResponse.json({ error: "Fotograaf niet gevonden" }, { status: 404 });
    }

    const reviewUrl = `https://lenslab.nl/review/${photographer.slug}`;

    const resend = new Resend(process.env.RESEND_API_KEY);

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #FCFAFF; padding: 40px 32px; border-radius: 16px;">
        <img src="https://lenslab.nl/logo.png" alt="LensLab" style="height: 32px; margin-bottom: 32px;" />

        <h2 style="color: #111; font-size: 22px; margin-bottom: 8px;">
          ${clientName ? `Hoi ${clientName},` : "Hoi,"}
        </h2>

        <p style="color: #555; line-height: 1.6; margin-bottom: 16px;">
          ${photographer.contact_name || photographer.business_name} vraagt je om een review te schrijven voor <strong>${photographer.business_name}</strong> op LensLab.
        </p>

        ${personalMessage ? `
        <div style="background: white; border-left: 3px solid #E9E7F0; padding: 16px; border-radius: 8px; margin-bottom: 24px; color: #444; font-style: italic;">
          "${personalMessage}"
        </div>
        ` : ""}

        <p style="color: #555; line-height: 1.6; margin-bottom: 32px;">
          Het duurt slechts een minuutje en helpt anderen om de juiste fotograaf te vinden.
        </p>

        <a href="${reviewUrl}" style="display: inline-block; background: #111; color: white; text-decoration: none; padding: 14px 28px; border-radius: 100px; font-weight: 600; font-size: 15px;">
          Schrijf een review →
        </a>

        <p style="color: #aaa; font-size: 12px; margin-top: 40px;">
          Of kopieer deze link: <a href="${reviewUrl}" style="color: #aaa;">${reviewUrl}</a>
        </p>

        <hr style="border: 1px solid #E9E7F0; margin: 32px 0;" />
        <p style="color: #bbb; font-size: 12px;">
          Deze uitnodiging is verstuurd via <a href="https://lenslab.nl" style="color: #bbb;">LensLab.nl</a>
        </p>
      </div>
    `;

    await resend.emails.send({
      from: "LensLab <noreply@lenslab.nl>",
      to: clientEmail,
      subject: `${photographer.business_name} vraagt om jouw review`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Review invite error:", error);
    return NextResponse.json({ error: "Versturen mislukt" }, { status: 500 });
  }
}
