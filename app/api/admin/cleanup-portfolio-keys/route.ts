import { createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const CANONICAL_CATEGORIES = [
  "Drone / Lucht", "Food & restaurant", "Afscheid", "Baby",
  "Evenementen", "Makelaars", "Bedrijf", "Huisdier",
  "Familie", "Portret", "Boudoir", "Bruiloft", "Zwangerschap", "Feest",
];

function normalizeCat(cat: string): string {
  return CANONICAL_CATEGORIES.find((c) => c.toLowerCase() === cat.toLowerCase()) ?? cat;
}

export async function POST() {
  const supabase = await createServiceClient();

  const { data: photographers, error } = await supabase
    .from("photographers")
    .select("id, portfolio_by_category")
    .not("portfolio_by_category", "is", null);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let fixed = 0;

  for (const p of photographers || []) {
    const portfolio = p.portfolio_by_category as Record<string, string[]>;
    const cleaned: Record<string, string[]> = {};

    for (const [key, images] of Object.entries(portfolio)) {
      const normalized = normalizeCat(key);
      cleaned[normalized] = [...(cleaned[normalized] ?? []), ...(images as string[])];
    }

    // Deduplicate URLs within each category
    for (const key of Object.keys(cleaned)) {
      cleaned[key] = [...new Set(cleaned[key])];
    }

    const hasChanged = JSON.stringify(portfolio) !== JSON.stringify(cleaned);
    if (hasChanged) {
      await supabase
        .from("photographers")
        .update({ portfolio_by_category: cleaned })
        .eq("id", p.id);
      fixed++;
    }
  }

  return NextResponse.json({ photographers: photographers?.length ?? 0, fixed });
}
