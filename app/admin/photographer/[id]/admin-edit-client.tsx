"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { SpecialtyUploader } from "@/components/specialty-uploader";

const ALL_CATEGORIES = [
  "Drone / Lucht", "Food & restaurant", "Afscheid", "Baby",
  "Evenementen", "Makelaars", "Bedrijf", "Huisdier",
  "Familie", "Portret", "Boudoir", "Bruiloft", "Zwangerschap", "Feest",
];

const ALL_PROVINCES = [
  "Noord-Holland", "Zuid-Holland", "Utrecht", "Noord-Brabant",
  "Gelderland", "Overijssel", "Groningen", "Friesland",
  "Limburg", "Drenthe", "Flevoland", "Zeeland",
];

export default function AdminEditClient({ photographer: initial }: { photographer: any }) {
  const [p, setP] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  const update = (fields: Partial<typeof p>) => setP((prev: any) => ({ ...prev, ...fields }));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    const { error: err } = await supabase
      .from("photographers")
      .update({
        business_name: p.business_name,
        contact_name: p.contact_name,
        email: p.email,
        phone: p.phone,
        bio: p.bio,
        city: p.city,
        regions: p.regions,
        specialties: p.specialties,
        website_url: p.website_url,
        instagram_url: p.instagram_url,
        linkedin_url: p.linkedin_url,
        facebook_url: p.facebook_url,
        membership_tier: p.membership_tier,
        is_published: p.is_published,
        is_verified: p.is_verified,
        meta_title: p.meta_title,
        meta_description: p.meta_description,
      })
      .eq("id", p.id);

    if (err) setError(err.message);
    else { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    setSaving(false);
  };

  const toggleSpecialty = (cat: string) => {
    const current = p.specialties || [];
    update({ specialties: current.includes(cat) ? current.filter((c: string) => c !== cat) : [...current, cat] });
  };

  const toggleRegion = (region: string) => {
    const current = p.regions || [];
    update({ regions: current.includes(region) ? current.filter((r: string) => r !== region) : [...current, region] });
  };

  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      {/* Nav */}
      <div className="bg-white border-b border-[#E9E7F0] sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
              ← Admin
            </Link>
            <span className="text-gray-200">/</span>
            <span className="text-sm text-gray-700 font-medium">{p.business_name}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/beeldmakers/${p.slug}`} target="_blank" className="text-sm text-gray-400 hover:text-gray-700">
              Bekijk profiel →
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        {/* Basis info */}
        <div className="bg-white rounded-3xl border border-[#E9E7F0] p-8 space-y-5">
          <h2 className="text-lg font-bold text-gray-900">Basisinformatie</h2>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Bedrijfsnaam *" value={p.business_name} onChange={(v) => update({ business_name: v })} />
            <Field label="Contactnaam" value={p.contact_name || ""} onChange={(v) => update({ contact_name: v })} />
            <Field label="E-mailadres" value={p.email || ""} onChange={(v) => update({ email: v })} type="email" />
            <Field label="Telefoon" value={p.phone || ""} onChange={(v) => update({ phone: v })} />
            <Field label="Stad" value={p.city || ""} onChange={(v) => update({ city: v })} />
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Type</label>
              <select value={p.type} onChange={(e) => update({ type: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-[#FCFAFF] focus:outline-none">
                <option value="fotograaf">Fotograaf</option>
                <option value="videograaf">Videograaf</option>
                <option value="beide">Foto & video</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Bio</label>
            <textarea value={p.bio || ""} onChange={(e) => update({ bio: e.target.value })} rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-[#FCFAFF] focus:outline-none resize-none" />
          </div>
        </div>

        {/* Status & membership */}
        <div className="bg-white rounded-3xl border border-[#E9E7F0] p-8 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Status & Membership</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Membership</label>
              <select value={p.membership_tier} onChange={(e) => update({ membership_tier: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-[#FCFAFF] focus:outline-none">
                <option value="free">Free</option>
                <option value="plus">Plus</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <div className="flex flex-col justify-end gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={p.is_published} onChange={(e) => update({ is_published: e.target.checked })}
                  className="w-4 h-4 accent-gray-900" />
                <span className="text-sm text-gray-700">Gepubliceerd</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={p.is_verified} onChange={(e) => update({ is_verified: e.target.checked })}
                  className="w-4 h-4 accent-gray-900" />
                <span className="text-sm text-gray-700">Geverifieerd</span>
              </label>
            </div>
          </div>
        </div>

        {/* Socials */}
        <div className="bg-white rounded-3xl border border-[#E9E7F0] p-8 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Links & Socials</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Website" value={p.website_url || ""} onChange={(v) => update({ website_url: v })} placeholder="https://" />
            <Field label="Instagram" value={p.instagram_url || ""} onChange={(v) => update({ instagram_url: v })} placeholder="https://instagram.com/..." />
            <Field label="LinkedIn" value={p.linkedin_url || ""} onChange={(v) => update({ linkedin_url: v })} placeholder="https://linkedin.com/in/..." />
            <Field label="Facebook" value={p.facebook_url || ""} onChange={(v) => update({ facebook_url: v })} placeholder="https://facebook.com/..." />
          </div>
        </div>

        {/* Categorieën */}
        <div className="bg-white rounded-3xl border border-[#E9E7F0] p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Categorieën</h2>
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map((cat) => {
              const active = (p.specialties || []).includes(cat);
              return (
                <button key={cat} onClick={() => toggleSpecialty(cat)}
                  className={`text-sm px-4 py-2 rounded-full border transition-colors flex items-center gap-1.5 ${
                    active ? "bg-gray-900 text-white border-gray-900" : "bg-[#FCFAFF] text-gray-700 border-[#E9E7F0] hover:border-gray-400"
                  }`}>
                  {cat}{active && <span className="opacity-60 text-xs">×</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Locaties */}
        <div className="bg-white rounded-3xl border border-[#E9E7F0] p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Locaties (provincies)</h2>
          <div className="flex flex-wrap gap-2">
            {ALL_PROVINCES.map((region) => {
              const active = (p.regions || []).includes(region);
              return (
                <button key={region} onClick={() => toggleRegion(region)}
                  className={`text-sm px-4 py-2 rounded-full border transition-colors flex items-center gap-1.5 ${
                    active ? "bg-gray-900 text-white border-gray-900" : "bg-[#FCFAFF] text-gray-700 border-[#E9E7F0] hover:border-gray-400"
                  }`}>
                  {region}{active && <span className="opacity-60 text-xs">×</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Portfolio */}
        {(p.specialties || []).length > 0 && (
          <div className="bg-white rounded-3xl border border-[#E9E7F0] p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Portfolio</h2>
            <p className="text-sm text-gray-500 mb-6">Upload en beheer foto&apos;s per categorie namens de beeldmaker.</p>
            <div className="space-y-5">
              {(p.specialties || []).map((specialty: string) => (
                <SpecialtyUploader
                  key={specialty}
                  specialty={specialty}
                  photographerId={p.id}
                  existingImages={Object.entries(p.portfolio_by_category || {}).find(([k]) => k.toLowerCase() === specialty.toLowerCase())?.[1] as string[] || []}
                  heroImage={p.hero_image_url}
                  onUpdate={(images) => setP((prev: any) => ({
                    ...prev,
                    portfolio_by_category: { ...(prev.portfolio_by_category || {}), [specialty]: images },
                  }))}
                  onSetHero={async (url) => {
                    await supabase.from("photographers").update({ hero_image_url: url }).eq("id", p.id);
                    setP((prev: any) => ({ ...prev, hero_image_url: url }));
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* SEO */}
        <div className="bg-white rounded-3xl border border-[#E9E7F0] p-8 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">SEO</h2>
          <Field label="Meta title" value={p.meta_title || ""} onChange={(v) => update({ meta_title: v })} placeholder={`${p.business_name} — Beeldmaker op LensLab`} />
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Meta description</label>
            <textarea value={p.meta_description || ""} onChange={(e) => update({ meta_description: e.target.value })} rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-[#FCFAFF] focus:outline-none resize-none"
              placeholder="Korte beschrijving voor Google..." />
          </div>
        </div>

        {/* Opslaan */}
        <div className="flex items-center gap-4 pb-8">
          <button onClick={handleSave} disabled={saving}
            className="bg-gray-900 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50">
            {saving ? "Opslaan..." : "Wijzigingen opslaan"}
          </button>
          {saved && <span className="text-sm text-green-600 font-medium">✓ Opgeslagen</span>}
          {error && <span className="text-sm text-red-500">{error}</span>}
          <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-700 ml-auto">
            Terug naar overzicht
          </Link>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-[#FCFAFF] focus:outline-none focus:border-gray-400" />
    </div>
  );
}
