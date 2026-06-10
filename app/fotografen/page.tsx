import { createClient } from "@/lib/supabase/server";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";
import FotografenClient from "./fotografen-client";
import type { Photographer } from "@/lib/types";

export const metadata = {
  title: "Alle fotografen en videografen in Nederland | LensLab",
  description: "Bekijk alle professionele fotografen en videografen in Nederland. Zoek op naam, stad, specialiteit of type en vind de beeldmaker die perfect bij jouw opdracht past.",
  alternates: { canonical: "https://lenslab.nl/fotografen" },
};

export const revalidate = 3600;

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
