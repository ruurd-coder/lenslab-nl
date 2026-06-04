import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { photographer_id, event_type, page_context, session_id } = await request.json();

    if (!photographer_id || !event_type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Vercel automatically provides these geo headers on their network
    const city = request.headers.get("x-vercel-ip-city")
      ? decodeURIComponent(request.headers.get("x-vercel-ip-city")!)
      : null;
    const country = request.headers.get("x-vercel-ip-country") ?? null;

    const supabase = await createClient();
    await supabase.from("photographer_analytics").insert({
      photographer_id,
      event_type,
      page_context: page_context ?? null,
      session_id: session_id ?? null,
      city,
      country,
    });

    return NextResponse.json({ ok: true });
  } catch {
    // Analytics errors must never break UX
    return NextResponse.json({ ok: true });
  }
}
