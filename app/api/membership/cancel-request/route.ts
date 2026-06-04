import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { reason, retentionChoice, feedback } = await request.json();

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "LensLab <noreply@lenslab.nl>",
    to: "hello@lenslab.nl",
    subject: `Opzegverzoek — ${user.email}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px;">
        <h2>Opzegverzoek membership</h2>
        <p><strong>Gebruiker:</strong> ${user.email}</p>
        <p><strong>Reden:</strong> ${reason}</p>
        ${retentionChoice ? `<p><strong>Retentie keuze:</strong> ${retentionChoice}</p>` : ""}
        ${feedback ? `<p><strong>Feedback:</strong> ${feedback}</p>` : ""}
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
