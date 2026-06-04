import { createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const EVENT_TYPES = [
  "impression",
  "profile_click",
  "website_click",
  "instagram_click",
  "linkedin_click",
  "contact_request",
] as const;

function getLast12Months(): string[] {
  const result: string[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return result;
}

type MonthAverage = {
  month: string;
  impression: number;
  profile_click: number;
  website_click: number;
  instagram_click: number;
  linkedin_click: number;
  contact_request: number;
};

async function getMonthlyAveragesForTier(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  tier: string,
  since: string,
  months: string[]
): Promise<MonthAverage[]> {
  const empty = months.map((month) => ({
    month,
    impression: 0,
    profile_click: 0,
    website_click: 0,
    instagram_click: 0,
    linkedin_click: 0,
    contact_request: 0,
  }));

  const { data: photographers } = await supabase
    .from("photographers")
    .select("id")
    .eq("membership_tier", tier)
    .eq("is_published", true);

  const ids = (photographers || []).map((p: { id: string }) => p.id);
  if (ids.length === 0) return empty;

  const { data: events } = await supabase
    .from("photographer_analytics")
    .select("event_type, created_at, photographer_id")
    .in("photographer_id", ids)
    .gte("created_at", since);

  // Sum per photographer per month
  const totals: Record<string, Record<string, Record<string, number>>> = {};
  ids.forEach((id: string) => {
    totals[id] = {};
    months.forEach((m) => {
      totals[id][m] = { impression: 0, profile_click: 0, website_click: 0, instagram_click: 0, linkedin_click: 0, contact_request: 0 };
    });
  });

  (events || []).forEach((e: { photographer_id: string; created_at: string; event_type: string }) => {
    const d = new Date(e.created_at);
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (totals[e.photographer_id]?.[month] && (EVENT_TYPES as readonly string[]).includes(e.event_type)) {
      totals[e.photographer_id][month][e.event_type]++;
    }
  });

  // Average across all photographers of this tier
  return months.map((month) => {
    const result: Record<string, number> = {};
    EVENT_TYPES.forEach((type) => {
      const sum = ids.reduce((s: number, id: string) => s + (totals[id][month][type] || 0), 0);
      result[type] = sum / ids.length;
    });
    return { month, ...result } as MonthAverage;
  });
}

export async function GET() {
  const supabase = await createServiceClient();
  const since = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString();
  const months = getLast12Months();

  const [plus, premium] = await Promise.all([
    getMonthlyAveragesForTier(supabase, "plus", since, months),
    getMonthlyAveragesForTier(supabase, "premium", since, months),
  ]);

  return NextResponse.json({ plus, premium });
}
