import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Zoek fotograaf op basis van ingelogd e-mailadres
  const { data: photographer } = await supabase
    .from("photographers")
    .select("*")
    .eq("email", user.email)
    .single();

  if (!photographer) {
    return (
      <div className="min-h-screen bg-[#FCFAFF] flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl border border-[#E9E7F0] p-8 max-w-md w-full text-center">
          <p className="text-3xl mb-4">🔍</p>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Geen profiel gevonden</h1>
          <p className="text-sm text-gray-500 mb-6">
            Er is geen beeldmakersprofiel gekoppeld aan <strong>{user.email}</strong>.
            Neem contact op via info@lenslab.nl.
          </p>
          <a href="mailto:info@lenslab.nl" className="inline-block bg-gray-900 text-white text-sm px-5 py-2.5 rounded-full hover:bg-gray-700 transition-colors">
            Contact opnemen
          </a>
        </div>
      </div>
    );
  }

  // Koppel user_id als dat nog niet gedaan is
  if (!photographer.user_id) {
    await supabase
      .from("photographers")
      .update({ user_id: user.id })
      .eq("id", photographer.id);
  }

  return <DashboardClient photographer={photographer} user={user} />;
}
