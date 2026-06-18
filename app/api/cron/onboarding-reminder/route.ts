import { createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { onboardingReminderEmailHtml } from "@/lib/emails";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createServiceClient();

  // Fotografen die 5+ dagen geleden zijn aangemeld, nog niet gepubliceerd,
  // nog geen reminder ontvangen, en 0 foto's hebben
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

  const { data: photographers, error } = await supabase
    .from("photographers")
    .select("id, email, contact_name, business_name, portfolio_by_category, onboarding_reminder_sent_at")
    .eq("is_published", false)
    .is("onboarding_reminder_sent_at", null)
    .lt("created_at", fiveDaysAgo.toISOString());

  if (error) {
    console.error("Cron onboarding-reminder error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  let sent = 0;

  for (const photographer of photographers || []) {
    // Controleer of ze écht 0 foto's hebben
    const totalPhotos = Object.values(photographer.portfolio_by_category || {})
      .reduce((sum: number, imgs: unknown) => sum + (Array.isArray(imgs) ? imgs.length : 0), 0);

    if (totalPhotos > 0) continue;
    if (!photographer.email) continue;

    const firstName = photographer.contact_name?.split(" ")[0]
      || photographer.business_name?.split(" ")[0]
      || "daar";

    const { error: emailError } = await resend.emails.send({
      from: "LensLab <noreply@lenslab.nl>",
      to: photographer.email,
      subject: `Bijna daar, ${firstName}! Je profiel staat nog niet live`,
      html: onboardingReminderEmailHtml(firstName),
    });

    if (!emailError) {
      await supabase
        .from("photographers")
        .update({ onboarding_reminder_sent_at: new Date().toISOString() })
        .eq("id", photographer.id);
      sent++;
    }
  }

  return NextResponse.json({ sent, total: photographers?.length ?? 0 });
}
