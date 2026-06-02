import { createClient } from "@/lib/supabase/server";
import SiteNav from "@/components/site-nav";
import BeeldmakersClient from "./beeldmakers-client";
import type { Photographer } from "@/lib/types";

export const metadata = {
  title: "Vind een fotograaf of videograaf in Nederland",
  description:
    "Bekijk portfolio's van fotografen en videografen door heel Nederland. Filter op regio, type en specialiteit.",
};

export const revalidate = 3600; // 1 uur cache

export default async function BeeldmakersPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("photographers")
    .select("*")
    .eq("is_published", true)
    .order("membership_tier", { ascending: false }) // premium eerst
    .order("rating", { ascending: false });

  const photographers = (data as Photographer[]) || [];

  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      <SiteNav />
      <BeeldmakersClient photographers={photographers} />
    </div>
  );
}
