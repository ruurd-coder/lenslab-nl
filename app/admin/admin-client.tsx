"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface ContactMessage {
  id: string;
  photographer_id: string;
  sender_name: string;
  sender_email: string;
  sender_phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
  photographers: { business_name: string; slug: string } | null;
}

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
  messages: ContactMessage[];
}

const TIER_COLORS: Record<string, string> = {
  premium: "bg-yellow-100 text-yellow-700",
  plus: "bg-blue-100 text-blue-700",
  free: "bg-gray-100 text-gray-600",
};

export default function AdminClient({ photographers, analyticsMap, adminEmail, messages }: Props) {
  const [activeTab, setActiveTab] = useState<"fotografen" | "berichten">("fotografen");
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
  const unreadMessages = messages.filter((m) => !m.is_read).length;

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

        {/* Tabs */}
        <div className="flex gap-1 bg-[#E9E7F0] rounded-full p-1 mb-6 w-fit">
          {(["fotografen", "berichten"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm px-5 py-2 rounded-full transition-colors font-medium flex items-center gap-1.5 ${
                activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "fotografen" ? "Fotografen" : "Berichten"}
              {tab === "berichten" && unreadMessages > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {unreadMessages}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === "berichten" && (
          <AdminBerichtenTab messages={messages} supabase={supabase} />
        )}

        {activeTab === "fotografen" && <>
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
        </>}
      </div>
    </div>
  );
}

function AdminBerichtenTab({ messages, supabase }: {
  messages: ContactMessage[];
  supabase: ReturnType<typeof createClient>;
}) {
  const [localMessages, setLocalMessages] = useState(messages);
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = async (id: string, isRead: boolean) => {
    if (expanded === id) {
      setExpanded(null);
    } else {
      setExpanded(id);
      if (!isRead) {
        await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
        setLocalMessages((prev) => prev.map((m) => m.id === id ? { ...m, is_read: true } : m));
      }
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E9E7F0]">
      <div className="px-5 py-4 border-b border-[#E9E7F0] flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900">Alle contactberichten</h2>
        <span className="text-xs text-gray-400">{localMessages.length} totaal</span>
      </div>

      {localMessages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-3xl mb-2">📬</p>
          <p className="text-sm text-gray-500">Nog geen berichten ontvangen.</p>
        </div>
      ) : (
        <div>
          {localMessages.map((msg) => (
            <div key={msg.id} className={`border-b border-[#E9E7F0] last:border-0 ${msg.is_read ? "" : "bg-blue-50/40"}`}>
              <button
                onClick={() => toggle(msg.id, msg.is_read)}
                className="w-full text-left px-5 py-4 flex items-center gap-3 hover:bg-[#FCFAFF] transition-colors"
              >
                {!msg.is_read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                <div className="flex-1 min-w-0 grid grid-cols-[1fr_1fr_1fr_auto] gap-4 items-center">
                  <div>
                    <p className={`text-sm ${msg.is_read ? "font-medium text-gray-700" : "font-bold text-gray-900"}`}>
                      {msg.sender_name}
                    </p>
                    <p className="text-xs text-gray-400">{msg.sender_email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      {msg.photographers?.business_name || "—"}
                    </p>
                    <p className="text-xs text-gray-400">fotograaf</p>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{msg.message}</p>
                  <p className="text-xs text-gray-400 shrink-0">{formatDate(msg.created_at)}</p>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${expanded === msg.id ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {expanded === msg.id && (
                <div className="px-5 pb-5 pt-2 space-y-3 bg-[#FCFAFF] border-t border-[#E9E7F0]">
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                    <div><span className="text-gray-400">Van: </span>
                      <a href={`mailto:${msg.sender_email}`} className="text-gray-900 underline underline-offset-2">{msg.sender_email}</a>
                    </div>
                    {msg.sender_phone && (
                      <div><span className="text-gray-400">Tel: </span><span className="text-gray-900">{msg.sender_phone}</span></div>
                    )}
                    <div><span className="text-gray-400">Aan: </span>
                      {msg.photographers?.slug ? (
                        <Link href={`/beeldmakers/${msg.photographers.slug}`} target="_blank" className="text-gray-900 underline underline-offset-2">
                          {msg.photographers.business_name}
                        </Link>
                      ) : "—"}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                  <a
                    href={`mailto:${msg.sender_email}?subject=Re: jouw bericht via LensLab`}
                    className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-2 rounded-full hover:bg-gray-700 transition-colors"
                  >
                    Beantwoorden →
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
