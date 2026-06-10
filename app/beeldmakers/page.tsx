import { createClient } from "@/lib/supabase/server";
import SiteNav from "@/components/site-nav";
import BeeldmakersClient from "./beeldmakers-client";
import type { Photographer } from "@/lib/types";

export const metadata = {
  title: "Vind een fotograaf of videograaf in Nederland | LensLab",
  description: "Bekijk portfolio's van honderden fotografen en videografen door heel Nederland. Filter op regio, type en specialiteit en neem direct contact op.",
  alternates: { canonical: "https://lenslab.nl/beeldmakers" },
};

export const revalidate = 3600;

const FEATURED_SLUGS = [
  "jill-van-den-hoven",
  "jip-schaap",
  "dulce-gusdorff",
  "milou-noordermeer",
];

export default async function BeeldmakersPage() {
  const supabase = await createClient();

  // Alle fotografen (voor zoekresultaten)
  const { data } = await supabase
    .from("photographers")
    .select("*")
    .eq("is_published", true)
    .order("membership_tier", { ascending: false })
    .order("rating", { ascending: false });

  const photographers = (data as Photographer[]) || [];

  // Uitgelichte fotografen in vaste volgorde
  const featured = FEATURED_SLUGS
    .map((slug) => photographers.find((p) => p.slug === slug))
    .filter(Boolean) as Photographer[];

  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      <SiteNav />
      <BeeldmakersClient photographers={photographers} featured={featured} />
    </div>
  );
}
