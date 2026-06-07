import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import AdminClient from "./admin-client";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) redirect("/login");

  // Haal alle fotografen op
  const { data: photographers } = await supabase
    .from("photographers")
    .select("id, slug, business_name, contact_name, email, city, membership_tier, is_published, rating, review_count, specialties, created_at")
    .order("created_at", { ascending: false });

  // Analytics per fotograaf (gesommeerd)
  const { data: analytics } = await supabase
    .from("photographer_analytics")
    .select("photographer_id, event_type");

  // Bouw analytics map
  const analyticsMap: Record<string, Record<string, number>> = {};
  for (const event of analytics || []) {
    if (!analyticsMap[event.photographer_id]) {
      analyticsMap[event.photographer_id] = {};
    }
    analyticsMap[event.photographer_id][event.event_type] =
      (analyticsMap[event.photographer_id][event.event_type] || 0) + 1;
  }

  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*, photographers(business_name, slug)")
    .order("created_at", { ascending: false });

  return (
    <AdminClient
      photographers={photographers || []}
      analyticsMap={analyticsMap}
      adminEmail={user.email!}
      messages={messages || []}
    />
  );
}
