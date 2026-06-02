"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Photographer } from "@/lib/types";
import type { User } from "@supabase/supabase-js";
import TrustpilotBar from "@/components/trustpilot-bar";

const CATEGORIES = [
  "☁️ Drone / Lucht", "🌶️ Food & restaurant", "🌹 Afscheid", "👶🏼 Baby",
  "🎤 Evenementen", "🏘️ Makelaars", "🏢 Bedrijf", "🐶 Huisdier",
  "👨‍👨‍👧‍👧 Familie", "👱‍♀️ Portret", "💋 Boudoir", "💍 Bruiloft",
  "🤰 Zwangerschap", "🥳 Feest",
];

const CAT_NAMES = CATEGORIES.map((c) => c.replace(/^[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}️\s]*/u, "").trim());

interface Props {
  photographer: Photographer;
  user: User;
}

type Tab = "profiel" | "portfolio" | "instellingen";

export default function DashboardClient({ photographer: initial, user }: Props) {
  const [photographer, setPhotographer] = useState(initial);
  const [activeTab, setActiveTab] = useState<Tab>("profiel");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    bio: photographer.bio || "",
    website_url: photographer.website_url || "",
    instagram_url: photographer.instagram_url || "",
    linkedin_url: photographer.linkedin_url || "",
    facebook_url: (photographer as any).facebook_url || "",
    phone: photographer.phone || "",
  });

  const supabase = createClient();

  const handleSave = async () => {
    setSaving(true);
    const { data, error } = await supabase
      .from("photographers")
      .update(form)
      .eq("id", photographer.id)
      .select()
      .single();

    if (!error && data) {
      setPhotographer(data as Photographer);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "profiel", label: "Profiel" },
    { id: "portfolio", label: "Portfolio" },
    { id: "instellingen", label: "Instellingen" },
  ];

  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      {/* Nav */}
      <div className="sticky top-0 z-50">
        <div className="bg-[#FCFAFF] border-b border-[#E9E7F0]">
          <nav className="px-6 py-3.5 flex items-center justify-between max-w-5xl mx-auto">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7">
                <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
                  <path d="M16 2 L30 26 L2 26 Z" fill="#111" />
                  <path d="M16 2 L30 26" stroke="#E55A2B" strokeWidth="3" />
                </svg>
              </div>
              <span className="font-bold text-base tracking-tight text-gray-900 uppercase">Lenslab</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href={`/beeldmakers/${photographer.slug}`}
                target="_blank"
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                Bekijk profiel →
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
              >
                Uitloggen
              </button>
            </div>
          </nav>
        </div>
        <TrustpilotBar />
      </div>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-[#E9E7F0] shrink-0">
            {photographer.avatar_url ? (
              <Image src={photographer.avatar_url} alt={photographer.business_name} width={56} height={56} className="object-cover w-full h-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-500">
                {photographer.business_name[0]}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900">{photographer.business_name}</h1>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
          <div className="ml-auto">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              photographer.membership_tier === "premium" ? "bg-yellow-100 text-yellow-700" :
              photographer.membership_tier === "plus" ? "bg-blue-100 text-blue-700" :
              "bg-gray-100 text-gray-600"
            }`}>
              {photographer.membership_tier?.toUpperCase() || "FREE"}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#E9E7F0] rounded-full p-1 mb-8 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-sm px-5 py-2 rounded-full transition-colors font-medium ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profiel tab */}
        {activeTab === "profiel" && (
          <div className="bg-white rounded-3xl border border-[#E9E7F0] p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-5">Profielinformatie</h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bio</label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={4}
                    placeholder="Vertel iets over jezelf en je werk..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Website</label>
                    <input
                      type="url"
                      value={form.website_url}
                      onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                      placeholder="https://jouwwebsite.nl"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Telefoonnummer</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="06-12345678"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Instagram</label>
                    <input
                      type="url"
                      value={form.instagram_url}
                      onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
                      placeholder="https://instagram.com/..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">LinkedIn</label>
                    <input
                      type="url"
                      value={form.linkedin_url}
                      onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Facebook</label>
                    <input
                      type="url"
                      value={form.facebook_url}
                      onChange={(e) => setForm({ ...form, facebook_url: e.target.value })}
                      placeholder="https://facebook.com/..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-gray-900 text-white text-sm px-6 py-2.5 rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50 font-medium"
              >
                {saving ? "Opslaan..." : "Wijzigingen opslaan"}
              </button>
              {saved && <span className="text-sm text-green-600 font-medium">✓ Opgeslagen</span>}
            </div>
          </div>
        )}

        {/* Portfolio tab */}
        {activeTab === "portfolio" && (
          <div className="bg-white rounded-3xl border border-[#E9E7F0] p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Portfolio</h2>
            <p className="text-sm text-gray-500 mb-6">
              Upload maximaal 10 foto&apos;s per specialiteit. Gebruik heldere, professionele beelden.
            </p>

            <div className="space-y-6">
              {photographer.specialties.map((specialty) => (
                <SpecialtyUploader
                  key={specialty}
                  specialty={specialty}
                  photographerId={photographer.id}
                  existingImages={photographer.portfolio_by_category?.[specialty] || []}
                  onUpdate={(images) => {
                    setPhotographer((prev) => ({
                      ...prev,
                      portfolio_by_category: {
                        ...prev.portfolio_by_category,
                        [specialty]: images,
                      },
                    }));
                  }}
                />
              ))}

              {photographer.specialties.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-8">
                  Je hebt nog geen specialiteiten ingesteld. Neem contact op met LensLab.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Instellingen tab */}
        {activeTab === "instellingen" && (
          <div className="bg-white rounded-3xl border border-[#E9E7F0] p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Instellingen</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#FCFAFF] rounded-2xl border border-[#E9E7F0]">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Membership</p>
                  <p className="text-xs text-gray-400 mt-0.5">Huidig abonnement</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  photographer.membership_tier === "premium" ? "bg-yellow-100 text-yellow-700" :
                  photographer.membership_tier === "plus" ? "bg-blue-100 text-blue-700" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {photographer.membership_tier?.toUpperCase() || "FREE"}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#FCFAFF] rounded-2xl border border-[#E9E7F0]">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Upgraden naar Plus of Premium</p>
                  <p className="text-xs text-gray-400 mt-0.5">Meer zichtbaarheid, meer portfolio&apos;s</p>
                </div>
                <a
                  href="mailto:info@lenslab.nl?subject=Upgrade membership"
                  className="text-sm bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-colors"
                >
                  Contact
                </a>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#FCFAFF] rounded-2xl border border-[#E9E7F0]">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Uitloggen</p>
                  <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-sm border border-gray-200 text-gray-700 px-4 py-2 rounded-full hover:border-gray-400 transition-colors"
                >
                  Uitloggen
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ── Portfolio uploader per specialiteit ──────────────────────────────

const STORAGE_BUCKET = "photographer-assets";
const MAX_IMAGES = 10;

function SpecialtyUploader({
  specialty,
  photographerId,
  existingImages,
  onUpdate,
}: {
  specialty: string;
  photographerId: string;
  existingImages: string[];
  onUpdate: (images: string[]) => void;
}) {
  const [images, setImages] = useState<string[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const available = MAX_IMAGES - images.length;
    const toUpload = files.slice(0, available);

    setUploading(true);

    const newUrls: string[] = [];
    for (const file of toUpload) {
      const ext = file.name.split(".").pop();
      const path = `${photographerId}/${specialty.replace(/\s+/g, "-").toLowerCase()}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, file, { upsert: false });

      if (!error) {
        const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
        newUrls.push(data.publicUrl);
      }
    }

    const updated = [...images, ...newUrls];
    setImages(updated);

    // Sla op in database
    const { data: current } = await supabase
      .from("photographers")
      .select("portfolio_by_category")
      .eq("id", photographerId)
      .single();

    const updatedCategory = {
      ...(current?.portfolio_by_category || {}),
      [specialty]: updated,
    };

    await supabase
      .from("photographers")
      .update({ portfolio_by_category: updatedCategory })
      .eq("id", photographerId);

    onUpdate(updated);
    setUploading(false);
    e.target.value = "";
  };

  const handleDelete = async (url: string) => {
    const updated = images.filter((i) => i !== url);
    setImages(updated);

    const { data: current } = await supabase
      .from("photographers")
      .select("portfolio_by_category")
      .eq("id", photographerId)
      .single();

    await supabase
      .from("photographers")
      .update({
        portfolio_by_category: {
          ...(current?.portfolio_by_category || {}),
          [specialty]: updated,
        },
      })
      .eq("id", photographerId);

    onUpdate(updated);
  };

  return (
    <div className="border border-[#E9E7F0] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">{specialty}</h3>
        <span className="text-xs text-gray-400">{images.length}/{MAX_IMAGES} foto&apos;s</span>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-3">
        {images.map((url, i) => (
          <div key={i} className="relative aspect-square group">
            <Image src={url} alt={`${specialty} ${i + 1}`} fill className="object-cover" />
            <button
              onClick={() => handleDelete(url)}
              className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}

        {images.length < MAX_IMAGES && (
          <label className="aspect-square border-2 border-dashed border-gray-200 rounded-sm flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors bg-[#FCFAFF]">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
            {uploading ? (
              <span className="text-xs text-gray-400">...</span>
            ) : (
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </label>
        )}
      </div>
    </div>
  );
}
