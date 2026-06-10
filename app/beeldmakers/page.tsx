import { createClient } from "@/lib/supabase/server";
import SiteNav from "@/components/site-nav";
import BeeldmakersClient from "./beeldmakers-client";
import type { Photographer } from "@/lib/types";
import type { Metadata } from "next";
import { getPageSeoOverrides } from "@/lib/seo-overrides";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const ov = await getPageSeoOverrides('nl:beeldmakers');
  return {
    title: ov?.meta_title || "Vind een fotograaf of videograaf in Nederland | LensLab",
    description: ov?.meta_description || "Bekijk portfolio's van honderden fotografen en videografen door heel Nederland. Filter op regio, type en specialiteit en neem direct contact op.",
    alternates: { canonical: "https://lenslab.nl/beeldmakers" },
  };
}

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
