import { createClient } from "@/lib/supabase/server";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import FotografenClient from "./fotografen-client";
import type { Photographer } from "@/lib/types";
import type { Metadata } from "next";
import { getPageSeoOverrides } from "@/lib/seo-overrides";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const ov = await getPageSeoOverrides('nl:fotografen');
  return {
    title: ov?.meta_title || "Alle fotografen en videografen in Nederland | LensLab",
    description: ov?.meta_description || "Bekijk alle professionele fotografen en videografen in Nederland. Zoek op naam, stad, specialiteit of type en vind de beeldmaker die perfect bij jouw opdracht past.",
    alternates: { canonical: "https://lenslab.nl/fotografen" },
  };
}

export default async function FotografenPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("photographers")
    .select("*")
    .eq("is_published", true)
    .order("membership_tier", { ascending: false })
    .order("rating", { ascending: false });

  const photographers = (data as Photographer[]) || [];

  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      <SiteNav />
      <FotografenClient photographers={photographers} />
      <SiteFooter />
    </div>
  );
}
