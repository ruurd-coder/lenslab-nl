"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface Photographer {
  id: string;
  slug: string;
  business_name: string;
  contact_name: string | null;
  email: string | null;
  city: string | null;
  membership_tier: string;
  is_published: boolean;
  rating: number;
  review_count: number;
  specialties: string[];
  created_at: string;
}

interface Props {
  photographers: Photographer[];
  analyticsMap: Record<string, Record<string, number>>;
  adminEmail: string;
}

const TIER_COLORS: Record<string, string> = {
  premium: "bg-yellow-100 text-yellow-700",
  plus: "bg-blue-100 text-blue-700",
  free: "bg-gray-100 text-gray-600",
};

export default function AdminClient({ photographers, analyticsMap, adminEmail }: Props) {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [publishFilter, setPublishFilter] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const supabase = createClient();

  const filtered = photographers.filter((p) => {
    if (search && !p.business_name?.toLowerCase().includes(search.toLowerCase()) &&
        !p.email?.toLowerCase().includes(search.toLowerCase()) &&
        !p.city?.toLowerCase().includes(search.toLowerCase())) return false;
    if (tierFilter && p.membership_tier !== tierFilter) return false;
    if (publishFilter === "published" && !p.is_published) return false;
    if (publishFilter === "unpublished" && p.is_published) return false;
    return true;
  });

  const handleTogglePublish = async (id: string, current: boolean) => {
    setUpdating(id);
    await supabase.from("photographers").update({ is_published: !current }).eq("id", id);
    setUpdating(null);
    window.location.reload();
  };

  const handleTierChange = async (id: string, tier: string) => {
    setUpdating(id);
    await supabase.from("photographers").update({ membership_tier: tier }).eq("id", id);
    setUpdating(null);
    window.location.reload();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  // Totale stats
  const totalImpressions = Object.values(analyticsMap).reduce((sum, a) => sum + (a.impression || 0), 0);
  const totalClicks = Object.values(analyticsMap).reduce((sum, a) => sum + (a.profile_click || 0), 0);
  const published = photographers.filter((p) => p.is_published).length;

  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      {/* Admin nav */}
      <div className="bg-white border-b border-[#E9E7F0] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image src="/logo.png" alt="LensLab" width={100} height={28} className="h-7 w-auto" />
            </Link>
            <span className="text-xs font-bold bg-gray-900 text-white px-2.5 py-1 rounded-full">ADMIN</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">{adminEmail}</span>
            <button onClick={handleSignOut} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
              Uitloggen
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats overzicht */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Totaal beeldmakers", value: photographers.length },
            { label: "Gepubliceerd", value: published },
            { label: "Totaal impressies", value: totalImpressions.toLocaleString() },
            { label: "Totaal profielclicks", value: totalClicks.toLocaleString() },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-[#E9E7F0] p-5">
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-[#E9E7F0] p-4 mb-6 flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Zoek op naam, email of stad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF]"
          />
          <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-[#FCFAFF] focus:outline-none cursor-pointer text-gray-700">
            <option value="">Alle tiers</option>
            <option value="premium">Premium</option>
            <option value="plus">Plus</option>
            <option value="free">Free</option>
          </select>
          <select value={publishFilter} onChange={(e) => setPublishFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-[#FCFAFF] focus:outline-none cursor-pointer text-gray-700">
            <option value="">Alle statussen</option>
            <option value="published">Gepubliceerd</option>
            <option value="unpublished">Niet gepubliceerd</option>
          </select>
          <span className="text-sm text-gray-400">{filtered.length} van {photographers.length}</span>
        </div>

        {/* Tabel */}
        <div className="bg-white rounded-2xl border border-[#E9E7F0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E9E7F0] bg-[#FCFAFF]">
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Beeldmaker</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Tier</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Impressies</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Profielclicks</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Mail</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Socials</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Website</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Acties</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {
                  const a = analyticsMap[p.id] || {};
                  return (
                    <tr key={p.id} className={`border-b border-[#E9E7F0] hover:bg-[#FCFAFF] transition-colors ${i % 2 === 0 ? "" : "bg-[#FDFCFF]"}`}>
                      <td className="px-5 py-3">
                        <div>
                          <Link href={`/beeldmakers/${p.slug}`} target="_blank"
                            className="font-semibold text-gray-900 hover:text-gray-600 transition-colors">
                            {p.business_name}
                          </Link>
                          <p className="text-xs text-gray-400">{p.email}</p>
                          {p.city && <p className="text-xs text-gray-400">{p.city}</p>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={p.membership_tier}
                          onChange={(e) => handleTierChange(p.id, e.target.value)}
                          disabled={updating === p.id}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer border-0 focus:outline-none ${TIER_COLORS[p.membership_tier] || TIER_COLORS.free}`}
                        >
                          <option value="free">Free</option>
                          <option value="plus">Plus</option>
                          <option value="premium">Premium</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-gray-700">{a.impression || 0}</td>
                      <td className="px-4 py-3 text-center font-mono text-gray-700">{a.profile_click || 0}</td>
                      <td className="px-4 py-3 text-center font-mono text-gray-700">{a.mail_click || 0}</td>
                      <td className="px-4 py-3 text-center font-mono text-gray-700">
                        {(a.instagram_click || 0) + (a.linkedin_click || 0) + (a.facebook_click || 0)}
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-gray-700">{a.website_click || 0}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${p.is_published ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                          {p.is_published ? "Live" : "Verborgen"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleTogglePublish(p.id, p.is_published)}
                            disabled={updating === p.id}
                            className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:border-gray-400 transition-colors disabled:opacity-50"
                          >
                            {p.is_published ? "Verbergen" : "Publiceren"}
                          </button>
                          <Link href={`/admin/photographer/${p.id}`}
                            className="text-xs border border-gray-900 bg-gray-900 text-white px-3 py-1.5 rounded-full hover:bg-gray-700 transition-colors">
                            Bewerk
                          </Link>
                          <Link href={`/beeldmakers/${p.slug}`} target="_blank"
                            className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:border-gray-400 transition-colors">
                            Bekijk →
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
