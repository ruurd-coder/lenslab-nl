"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Photographer } from "@/lib/types";
import { getMembership } from "@/lib/membership";
import StatsDashboard from "@/components/stats-dashboard";
import type { User } from "@supabase/supabase-js";
import TrustpilotBar from "@/components/trustpilot-bar";

const ALL_CATEGORIES = [
  "Drone / Lucht", "Food & restaurant", "Afscheid", "Baby",
  "Evenementen", "Makelaars", "Bedrijf", "Huisdier",
  "Familie", "Portret", "Boudoir", "Bruiloft", "Zwangerschap", "Feest",
];

const TIER_LIMITS: Record<string, number> = { free: 1, plus: 4, premium: 8 };
const TIER_LABELS: Record<string, string> = { free: "Free", plus: "Plus", premium: "Premium" };

interface Props {
  photographer: Photographer;
  user: User;
}

type Tab = "profiel" | "portfolio" | "reviews" | "statistieken" | "instellingen";

export default function DashboardClient({ photographer: initial, user }: Props) {
  const [photographer, setPhotographer] = useState(initial);
  const [activeTab, setActiveTab] = useState<Tab>("profiel");
  const [saving, setSaving] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(!initial.is_published);
  const [showPortfolioPrompt, setShowPortfolioPrompt] = useState(false);
  const maxCategories = TIER_LIMITS[photographer.membership_tier] || 1;
  // Normaliseer naar canonieke casing uit ALL_CATEGORIES (case-insensitive match)
  const normalizeCategory = (cat: string) =>
    ALL_CATEGORIES.find((c) => c.toLowerCase() === cat.toLowerCase()) ?? cat;

  // Actieve portfolio-categorieën: uit specialties OF uit portfolio_by_category keys
  const [activeCategories, setActiveCategories] = useState<string[]>(() => {
    const fromPortfolio = Object.keys(photographer.portfolio_by_category || {}).map(normalizeCategory);
    const fromSpecialties = (photographer.specialties || []).map(normalizeCategory);
    const combined = [...new Set([...fromPortfolio, ...fromSpecialties])];
    return combined.slice(0, maxCategories);
  });
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    business_name: photographer.business_name || "",
    contact_name: photographer.contact_name || "",
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
    { id: "reviews", label: "Reviews" },
    { id: "statistieken", label: "Statistieken" },
    { id: "instellingen", label: "Instellingen" },
  ];

  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      {/* Nav */}
      <div className="sticky top-0 z-50">
        <div className="bg-[#FCFAFF] border-b border-[#E9E7F0]">
          <nav className="px-6 py-3.5 flex items-center justify-between max-w-5xl mx-auto">
            <Link href="/">
              <Image src="/logo.png" alt="LensLab" width={100} height={28} className="h-7 w-auto" />
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
        <div className="flex gap-1 bg-[#E9E7F0] rounded-full p-1 mb-8 overflow-x-auto max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-sm px-4 py-2 rounded-full transition-colors font-medium shrink-0 ${
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

              {/* Avatar upload */}
              <div className="flex items-center gap-5 mb-6 pb-6 border-b border-[#E9E7F0]">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-[#E9E7F0] shrink-0">
                  {photographer.avatar_url ? (
                    <Image src={photographer.avatar_url} alt="Avatar" width={80} height={80} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                      {photographer.business_name?.[0] || "?"}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">Profielfoto</p>
                  <p className="text-xs text-gray-400 mb-3">JPG, PNG of WEBP · max 1MB · wordt weergegeven als ronde foto</p>
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-[#E9E7F0] text-gray-700 text-sm px-4 py-2 rounded-full hover:bg-gray-200 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Foto uploaden
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 1 * 1024 * 1024) {
                          alert("Bestand is groter dan 1MB. Kies een kleiner bestand.");
                          return;
                        }
                        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
                        const path = `${photographer.id}/avatar/avatar-${Date.now()}.${ext}`;
                        const { error } = await supabase.storage
                          .from("photographer-assets")
                          .upload(path, file, { upsert: true });
                        if (!error) {
                          const { data } = supabase.storage.from("photographer-assets").getPublicUrl(path);
                          await supabase.from("photographers").update({ avatar_url: data.publicUrl }).eq("id", photographer.id);
                          setPhotographer((prev) => ({ ...prev, avatar_url: data.publicUrl }));
                        }
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bedrijfsnaam</label>
                    <input
                      type="text"
                      value={form.business_name}
                      onChange={(e) => setForm({ ...form, business_name: e.target.value })}
                      placeholder="Jouw bedrijfsnaam"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contactnaam</label>
                    <input
                      type="text"
                      value={form.contact_name}
                      onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
                      placeholder="Jouw naam"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF]"
                    />
                  </div>
                </div>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <PortfolioTab
            photographer={photographer}
            maxCategories={maxCategories}
            activeCategories={activeCategories}
            setActiveCategories={setActiveCategories}
            setPhotographer={setPhotographer}
            onUpgradeClick={() => setActiveTab("instellingen")}
          />
        )}

        {/* Statistieken tab */}
        {activeTab === "statistieken" && (
          <StatsDashboard photographerId={photographer.id} />
        )}

        {/* Reviews tab */}
        {activeTab === "reviews" && (
          <ReviewInviteTab photographerId={photographer.id} photographerSlug={photographer.slug} />
        )}

        {/* Instellingen tab */}
        {activeTab === "instellingen" && (
          <div className="space-y-6">
            {/* Membership kaarten */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MembershipCard
                name="Free"
                price="Gratis"
                description="Maak een vliegende start en word gevonden door potentiële klanten."
                billing="Geen creditcard nodig."
                features={FREE_FEATURES}
                isCurrent={!photographer.membership_tier || photographer.membership_tier === "free"}
                featured={false}
                cta={<div className="rounded-xl py-3 text-center text-sm font-semibold bg-gray-100 text-gray-400 cursor-default">
                  {(!photographer.membership_tier || photographer.membership_tier === "free") ? "Jouw huidige membership" : "Free"}
                </div>}
              />
              <MembershipCard
                name="Plus"
                price="€7"
                period="/maand"
                description="Bereik meer potentiële klanten met extra zichtbaarheid en meer locaties."
                billing="Jaarlijks gefactureerd."
                features={PLUS_FEATURES}
                isCurrent={photographer.membership_tier === "plus"}
                featured={true}
                cta={photographer.membership_tier === "plus"
                  ? <ManageBillingButton compact />
                  : <UpgradeButton tier="plus" label="Upgrade naar Plus" compact />
                }
              />
              <MembershipCard
                name="Premium"
                price="€14"
                period="/maand"
                description="Voor professionals die maximale zichtbaarheid en groei nastreven."
                billing="Jaarlijks gefactureerd."
                features={PREMIUM_FEATURES}
                isCurrent={photographer.membership_tier === "premium"}
                featured={false}
                cta={photographer.membership_tier === "premium"
                  ? <ManageBillingButton compact />
                  : <UpgradeButton tier="premium" label="Upgrade naar Premium" compact />
                }
              />
            </div>

            {/* Uitloggen */}
            <div className="bg-white rounded-3xl border border-[#E9E7F0] p-5 flex items-center justify-between">
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
        )}
      </main>

      {showOnboarding && (
        <OnboardingModal
          photographer={photographer}
          onComplete={(updated) => {
            setPhotographer(updated);
            setForm((f) => ({
              ...f,
              business_name: updated.business_name || "",
              contact_name: updated.contact_name || "",
              bio: updated.bio || "",
            }));
            setShowOnboarding(false);
            setShowPortfolioPrompt(true);
          }}
        />
      )}

      {showPortfolioPrompt && (
        <PortfolioPromptModal
          onClose={() => { setShowPortfolioPrompt(false); setActiveTab("portfolio"); }}
          onDismiss={() => setShowPortfolioPrompt(false)}
        />
      )}
    </div>
  );
}

// ── Portfolio tab ────────────────────────────────────────────────────

const ALL_PROVINCES = [
  "Noord-Holland", "Zuid-Holland", "Utrecht", "Noord-Brabant",
  "Gelderland", "Overijssel", "Groningen", "Friesland",
  "Limburg", "Drenthe", "Flevoland", "Zeeland",
];

function PortfolioTab({ photographer, maxCategories, activeCategories, setActiveCategories, setPhotographer, onUpgradeClick }: {
  photographer: Photographer;
  maxCategories: number;
  activeCategories: string[];
  setActiveCategories: React.Dispatch<React.SetStateAction<string[]>>;
  setPhotographer: React.Dispatch<React.SetStateAction<Photographer>>;
  onUpgradeClick: () => void;
}) {
  const supabase = createClient();
  const membership = getMembership(photographer.membership_tier as any);
  const maxLoc = membership.maxLocations ?? 999;

  const [activeRegions, setActiveRegions] = useState<string[]>(photographer.regions || []);
  const [savingRegions, setSavingRegions] = useState(false);
  const [savedRegions, setSavedRegions] = useState(false);
  const [savingCats, setSavingCats] = useState(false);
  const [savedCats, setSavedCats] = useState(false);

  const toggleCategory = (cat: string) => {
    setActiveCategories((prev) => {
      if (prev.includes(cat)) return prev.filter((c) => c !== cat);
      if (prev.length >= maxCategories) return prev; // stil negeren als limiet bereikt
      return [...prev, cat];
    });
  };

  const toggleRegion = (region: string) => {
    setActiveRegions((prev) => {
      if (prev.includes(region)) return prev.filter((r) => r !== region);
      if (prev.length >= maxLoc) return prev;
      return [...prev, region];
    });
  };

  const saveRegions = async () => {
    setSavingRegions(true);
    await supabase.from("photographers").update({ regions: activeRegions }).eq("id", photographer.id);
    setPhotographer((prev) => ({ ...prev, regions: activeRegions }));
    setSavedRegions(true);
    setTimeout(() => setSavedRegions(false), 2000);
    setSavingRegions(false);
  };

  return (
    <div className="space-y-6">
      {/* Categorieën */}
      <div className="bg-white rounded-3xl border border-[#E9E7F0] p-8">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-gray-900">Jouw categorieën</h2>
          <span className="text-xs text-gray-400">{activeCategories.length}/{maxCategories} geselecteerd</span>
        </div>
        <p className="text-sm text-gray-500 mb-5">
          Selecteer de categorieën waarvoor je geboekt wilt worden. Sleep om de volgorde aan te passen — de eerste staat bovenaan je profiel.
          {maxCategories < 8 && <> Wil je meer? <button onClick={onUpgradeClick} className="underline">Upgrade je account</button>.</>}
        </p>

        {/* Geselecteerde categorieën — sleepbaar */}
        {activeCategories.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Geselecteerd — sleep om volgorde aan te passen</p>
            <div className="flex flex-wrap gap-2">
              {activeCategories.map((cat, i) => (
                <div
                  key={cat}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", String(i))}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const from = parseInt(e.dataTransfer.getData("text/plain"));
                    if (from === i) return;
                    const updated = [...activeCategories];
                    const [moved] = updated.splice(from, 1);
                    updated.splice(i, 0, moved);
                    setActiveCategories(updated);
                  }}
                  className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-full border bg-gray-900 text-white border-gray-900 cursor-grab active:cursor-grabbing select-none"
                >
                  <span className="opacity-40 text-xs">⠿</span>
                  {i === 0 && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full leading-none">1e</span>}
                  {cat}
                  <button
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className="opacity-50 hover:opacity-100 text-xs leading-none ml-0.5"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Beschikbare categorieën — klik om toe te voegen */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Toevoegen</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {ALL_CATEGORIES.filter((cat) => !activeCategories.includes(cat)).map((cat) => {
              const isDisabled = activeCategories.length >= maxCategories;
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  disabled={isDisabled}
                  className={`text-sm px-4 py-2 rounded-full border transition-colors ${
                    isDisabled
                      ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                      : "bg-[#FCFAFF] text-gray-700 border-[#E9E7F0] hover:border-gray-400"
                  }`}
                >
                  + {cat}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={async () => {
              setSavingCats(true);
              await supabase.from("photographers").update({ specialties: activeCategories }).eq("id", photographer.id);
              setPhotographer((prev) => ({ ...prev, specialties: activeCategories }));
              setSavedCats(true);
              setTimeout(() => setSavedCats(false), 2000);
              setSavingCats(false);
            }}
            disabled={savingCats}
            className="bg-gray-900 text-white text-sm px-5 py-2.5 rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50 font-medium"
          >
            {savingCats ? "Opslaan..." : "Categorieën opslaan"}
          </button>
          {savedCats && <span className="text-sm text-green-600 font-medium">✓ Opgeslagen</span>}
        </div>
      </div>

      {/* Locaties */}
      <div className="bg-white rounded-3xl border border-[#E9E7F0] p-8">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-gray-900">Jouw locaties</h2>
          <span className="text-xs text-gray-400">
            {activeRegions.length}/{membership.maxLocations ?? "∞"} geselecteerd
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-5">
          Selecteer de provincies waar je actief bent. Je bent zichtbaar op alle stad- en provinciepagina&apos;s binnen je selectie.
          {membership.maxLocations !== null && membership.maxLocations < 12 && <> Wil je meer? <button onClick={onUpgradeClick} className="underline">Upgrade je account</button>.</>}
        </p>
        <div className="flex flex-wrap gap-2 mb-5">
          {ALL_PROVINCES.map((region) => {
            const isActive = activeRegions.includes(region);
            const isDisabled = !isActive && membership.maxLocations !== null && activeRegions.length >= membership.maxLocations;
            return (
              <button
                key={region}
                onClick={() => toggleRegion(region)}
                disabled={isDisabled}
                className={`text-sm px-4 py-2 rounded-full border transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? "bg-gray-900 text-white border-gray-900 hover:bg-gray-700"
                    : isDisabled
                    ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                    : "bg-[#FCFAFF] text-gray-700 border-[#E9E7F0] hover:border-gray-400"
                }`}
              >
                {region}
                {isActive && <span className="opacity-60 text-xs leading-none">×</span>}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={saveRegions}
            disabled={savingRegions}
            className="bg-gray-900 text-white text-sm px-5 py-2.5 rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50 font-medium"
          >
            {savingRegions ? "Opslaan..." : "Locaties opslaan"}
          </button>
          {savedRegions && <span className="text-sm text-green-600 font-medium">✓ Opgeslagen</span>}
        </div>
      </div>

      {/* Portfolio per categorie */}
      {activeCategories.length > 0 && (
        <div className="bg-white rounded-3xl border border-[#E9E7F0] p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Portfolio per categorie</h2>
          <p className="text-sm text-gray-500 mb-6">Upload maximaal 10 foto&apos;s per geselecteerde categorie.</p>
          <div className="space-y-6">
            {activeCategories.map((specialty) => (
              <SpecialtyUploader
                key={specialty}
                specialty={specialty}
                photographerId={photographer.id}
                existingImages={photographer.portfolio_by_category?.[specialty] || []}
                heroImage={photographer.hero_image_url}
                onUpdate={(images) => {
                  setPhotographer((prev) => ({
                    ...prev,
                    portfolio_by_category: { ...prev.portfolio_by_category, [specialty]: images },
                  }));
                }}
                onSetHero={async (url) => {
                  await supabase.from("photographers").update({ hero_image_url: url }).eq("id", photographer.id);
                  setPhotographer((prev) => ({ ...prev, hero_image_url: url }));
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Portfolio uploader per specialiteit ──────────────────────────────

const STORAGE_BUCKET = "photographer-assets";
const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

function SpecialtyUploader({
  specialty,
  photographerId,
  existingImages,
  heroImage,
  onUpdate,
  onSetHero,
}: {
  specialty: string;
  photographerId: string;
  existingImages: string[];
  heroImage: string | null;
  onUpdate: (images: string[]) => void;
  onSetHero: (url: string) => void;
}) {
  const [images, setImages] = useState<string[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const [sizeError, setSizeError] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const supabase = createClient();

  const saveImages = async (updated: string[]) => {
    const { data: current } = await supabase
      .from("photographers")
      .select("portfolio_by_category")
      .eq("id", photographerId)
      .single();
    await supabase
      .from("photographers")
      .update({ portfolio_by_category: { ...(current?.portfolio_by_category || {}), [specialty]: updated } })
      .eq("id", photographerId);
    onUpdate(updated);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setSizeError("");

    const oversized = files.filter((f) => f.size > MAX_FILE_SIZE);
    if (oversized.length > 0) {
      setSizeError(`${oversized.length} bestand(en) zijn groter dan 1MB. Comprimeer ze eerst.`);
      e.target.value = "";
      return;
    }

    const toUpload = files.slice(0, MAX_IMAGES - images.length);
    setUploading(true);
    const newUrls: string[] = [];

    for (const file of toUpload) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${photographerId}/${specialty.replace(/\s+/g, "-").toLowerCase()}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, { upsert: false });
      if (!error) {
        const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
        newUrls.push(data.publicUrl);
      }
    }

    const updated = [...images, ...newUrls];
    setImages(updated);
    await saveImages(updated);
    setUploading(false);
    e.target.value = "";
  };

  const handleDelete = async (url: string) => {
    const updated = images.filter((i) => i !== url);
    setImages(updated);
    await saveImages(updated);
  };

  // Drag-to-reorder
  const handleDragStart = (i: number) => setDragIndex(i);
  const handleDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === i) return;
    const reordered = [...images];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(i, 0, moved);
    setImages(reordered);
    setDragIndex(i);
  };
  const handleDragEnd = async () => {
    setDragIndex(null);
    await saveImages(images);
  };

  return (
    <div className="border border-[#E9E7F0] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900">{specialty}</h3>
        <span className="text-xs text-gray-400">{images.length}/{MAX_IMAGES} foto&apos;s</span>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
        <p className="text-xs text-gray-400">📁 JPG, PNG, WEBP</p>
        <p className="text-xs text-gray-400">📏 Max 1MB per foto</p>
        <p className="text-xs text-gray-400">↕️ Sleep om te hersorteren</p>
        <p className="text-xs text-gray-400">⭐ Hover → stel in als hero</p>
      </div>

      {sizeError && (
        <p className="text-xs text-red-500 bg-red-50 rounded-xl px-3 py-2 mb-3">{sizeError}</p>
      )}

      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-3">
        {images.map((url, i) => (
          <div
            key={url}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDragEnd={handleDragEnd}
            className={`relative aspect-square group cursor-grab active:cursor-grabbing ${
              dragIndex === i ? "opacity-50 ring-2 ring-blue-400" : ""
            } ${i === 0 ? "ring-2 ring-gray-300" : ""}`}
          >
            <Image src={url} alt={`${specialty} ${i + 1}`} fill className="object-cover" />

            {/* Hero badge */}
            {url === heroImage && (
              <div className="absolute bottom-1 left-1 bg-amber-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                HERO
              </div>
            )}
            {i === 0 && url !== heroImage && (
              <div className="absolute bottom-1 left-1 bg-gray-600 text-white text-[10px] px-1.5 py-0.5 rounded">
                #1
              </div>
            )}

            {/* Hover acties */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
              <button
                onClick={() => onSetHero(url)}
                title="Stel in als hero"
                className="w-7 h-7 bg-amber-400 text-white rounded-full text-sm flex items-center justify-center hover:bg-amber-500"
              >
                ⭐
              </button>
              <button
                onClick={() => handleDelete(url)}
                title="Verwijder"
                className="w-7 h-7 bg-red-500 text-white rounded-full text-sm flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
            </div>
          </div>
        ))}

        {images.length < MAX_IMAGES && (
          <label className="aspect-square border-2 border-dashed border-gray-200 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors bg-[#FCFAFF] gap-1">
            <input type="file" accept=".jpg,.jpeg,.png,.webp" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
            {uploading ? (
              <span className="text-xs text-gray-400">Uploaden...</span>
            ) : (
              <>
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-[10px] text-gray-300">Foto toevoegen</span>
              </>
            )}
          </label>
        )}
      </div>
    </div>
  );
}

// ── Review uitnodigings tab ──────────────────────────────────────────

function ReviewInviteTab({ photographerId, photographerSlug }: { photographerId: string; photographerSlug: string }) {
  const [email, setEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const reviewUrl = `https://lenslab.nl/review/${photographerSlug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(reviewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Vul een e-mailadres in"); return; }
    setSending(true);
    setError("");

    const res = await fetch("/api/review-invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photographerId, clientEmail: email.trim(), clientName: clientName.trim(), personalMessage: message.trim() }),
    });

    const data = await res.json();
    if (!res.ok) { setError(data.error || "Versturen mislukt"); }
    else { setSent(true); setEmail(""); setClientName(""); setMessage(""); }
    setSending(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E9E7F0] p-8 space-y-8">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Review uitnodigingen</h2>
        <p className="text-sm text-gray-500">Vraag klanten om een review te schrijven via een uitnodiging of een directe link.</p>
      </div>

      {/* Link kopiëren */}
      <div className="bg-[#FCFAFF] rounded-2xl border border-[#E9E7F0] p-5">
        <p className="text-sm font-semibold text-gray-800 mb-1">Kopieer je review link</p>
        <p className="text-xs text-gray-400 mb-3">Plak deze link in je eigen e-mail of app om klanten uit te nodigen.</p>
        <div className="flex gap-2">
          <div className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-500 truncate">
            {reviewUrl}
          </div>
          <button
            onClick={copyLink}
            className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              copied ? "bg-green-600 text-white" : "bg-gray-900 text-white hover:bg-gray-700"
            }`}
          >
            {copied ? "✓ Gekopieerd!" : "Kopieer link"}
          </button>
        </div>
      </div>

      {/* Email uitnodiging */}
      <div>
        <p className="text-sm font-semibold text-gray-800 mb-1">Stuur een uitnodiging per mail</p>
        <p className="text-xs text-gray-400 mb-4">We sturen namens jou een professionele uitnodiging met een link naar het reviewformulier.</p>

        {sent && (
          <div className="bg-green-50 text-green-700 text-sm rounded-xl px-4 py-3 mb-4">
            ✓ Uitnodiging verstuurd!
          </div>
        )}

        <form onSubmit={sendInvite} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Naam klant</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Jan de Vries"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">E-mailadres klant *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="klant@email.nl"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Persoonlijk bericht <span className="font-normal text-gray-400">(optioneel)</span></label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Fijn om samen met je gewerkt te hebben! Ik zou het heel fijn vinden als je een review wilt achterlaten..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF] resize-none"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={sending}
            className="bg-gray-900 text-white text-sm px-6 py-2.5 rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50 font-medium"
          >
            {sending ? "Versturen..." : "Stuur uitnodiging →"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Onboarding modal ─────────────────────────────────────────────────

function OnboardingModal({ photographer, onComplete }: {
  photographer: Photographer;
  onComplete: (updated: Photographer) => void;
}) {
  const supabase = createClient();
  const [form, setForm] = useState({
    business_name: photographer.business_name || "",
    contact_name: photographer.contact_name || "",
    bio: photographer.bio || "",
  });
  const [avatarUrl, setAvatarUrl] = useState(photographer.avatar_url || "");
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const isComplete = form.business_name.trim() && form.contact_name.trim() && form.bio.trim() && avatarUrl;

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1 * 1024 * 1024) { alert("Bestand is groter dan 1MB."); return; }
    setUploadingAvatar(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${photographer.id}/avatar/avatar-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("photographer-assets").upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from("photographer-assets").getPublicUrl(path);
      setAvatarUrl(data.publicUrl);
    }
    setUploadingAvatar(false);
    e.target.value = "";
  };

  const handleSave = async () => {
    if (!isComplete) return;
    setSaving(true);
    const { data } = await supabase
      .from("photographers")
      .update({
        business_name: form.business_name.trim(),
        contact_name: form.contact_name.trim(),
        bio: form.bio.trim(),
        avatar_url: avatarUrl,
        is_published: true,
      })
      .eq("id", photographer.id)
      .select()
      .single();
    setSaving(false);
    if (data) onComplete(data as Photographer);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-[#E9E7F0]">
          <div className="flex items-center gap-3 mb-2">
            <Image src="/logo.png" alt="LensLab" width={90} height={24} className="h-6 w-auto" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mt-3">Welkom bij LensLab! 👋</h2>
          <p className="text-sm text-gray-500 mt-1">
            Vul je basisprofiel in zodat merken jou kunnen vinden. Dit duurt minder dan 2 minuten.
          </p>
        </div>

        {/* Form */}
        <div className="px-8 py-6 space-y-5">
          {/* Profielfoto */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Profielfoto <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-[#E9E7F0] shrink-0 flex items-center justify-center">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="Avatar" width={64} height={64} className="object-cover w-full h-full" />
                ) : (
                  <span className="text-2xl text-gray-400">📷</span>
                )}
              </div>
              <label className={`cursor-pointer inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full transition-colors font-medium ${
                avatarUrl ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-900 text-white hover:bg-gray-700"
              }`}>
                {uploadingAvatar ? "Uploaden..." : avatarUrl ? "✓ Foto geüpload — wijzigen" : "Foto uploaden"}
                <input type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
              </label>
            </div>
          </div>

          {/* Bedrijfsnaam */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Bedrijfsnaam <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.business_name}
              onChange={(e) => setForm({ ...form, business_name: e.target.value })}
              placeholder="Jouw bedrijfsnaam"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF]"
            />
          </div>

          {/* Contactnaam */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Jouw naam <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.contact_name}
              onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
              placeholder="Voor- en achternaam"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF]"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Bio <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Vertel iets over jezelf, je stijl en wat je het liefst fotografeert..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF] resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8">
          <button
            onClick={handleSave}
            disabled={!isComplete || saving}
            className="w-full bg-gray-900 text-white py-3.5 rounded-full text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? "Profiel aanmaken..." : "Profiel aanmaken en publiceren →"}
          </button>
          {!isComplete && (
            <p className="text-xs text-gray-400 text-center mt-3">Vul alle velden in om door te gaan</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Portfolio prompt modal ────────────────────────────────────────────

function PortfolioPromptModal({ onClose, onDismiss }: {
  onClose: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md text-center overflow-hidden">
        <div className="px-8 pt-10 pb-8">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-black text-gray-900 mb-3">Je profiel staat live!</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-2">
            Je bent nu al vindbaar. Maar beeldmakers met een goed portfolio krijgen gemiddeld <strong>4x meer aanvragen</strong>.
          </p>
          <p className="text-sm text-gray-500 leading-relaxed mb-8">
            Upload je mooiste werk en laat zien wat je in huis hebt. Het duurt maar een paar minuten en het maakt écht het verschil. 📸
          </p>
          <button
            onClick={onClose}
            className="w-full bg-gray-900 text-white py-3.5 rounded-full text-sm font-semibold hover:bg-gray-700 transition-colors mb-3"
          >
            Portfolio invullen →
          </button>
          <button
            onClick={onDismiss}
            className="w-full text-sm text-gray-400 hover:text-gray-600 py-2 transition-colors"
          >
            Later doen
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Membership feature arrays ────────────────────────────────────────

type Feature = { prefix?: string; label: string; value?: string; included: boolean };

const FREE_FEATURES: Feature[] = [
  { label: "Zichtbaar op listing pagina's", included: true },
  { label: "Zichtbaar op de landingspagina's van", value: "1 provincie", included: true },
  { label: "Zichtbaar op", value: "1 categorie", included: true },
  { prefix: "Ontvang emails", label: "direct vanuit potentiële opdrachtgevers", included: true },
  { label: "Creëer meer vertrouwen met een", value: "Review-tool", included: true },
  { label: "Link naar website", included: false },
  { label: "Link naar socials", included: false },
];

const PLUS_FEATURES: Feature[] = [
  { label: "Zichtbaar boven Free op listing pagina's", included: true },
  { label: "Zichtbaar op de landingspagina's van", value: "3 provincies", included: true },
  { label: "Zichtbaar op", value: "4 categorieën", included: true },
  { prefix: "Ontvang emails", label: "direct vanuit potentiële opdrachtgevers", included: true },
  { label: "Creëer meer vertrouwen met een", value: "Review-tool", included: true },
  { label: "Link naar website", included: true },
  { label: "Link naar socials", included: true },
  { label: "Andere beeldmakers niet zichtbaar op jouw profiel", included: true },
];

const PREMIUM_FEATURES: Feature[] = [
  { label: "Zichtbaar boven Plus op listing pagina's", included: true },
  { label: "Zichtbaar op de landingspagina's van", value: "onbeperkt aantal provincies", included: true },
  { label: "Zichtbaar op", value: "8 categorieën", included: true },
  { prefix: "Ontvang emails", label: "direct vanuit potentiële opdrachtgevers", included: true },
  { label: "Creëer meer vertrouwen met een", value: "Review-tool", included: true },
  { label: "Link naar website", included: true },
  { label: "Link naar socials", included: true },
  { label: "Andere beeldmakers niet zichtbaar op jouw profiel", included: true },
  { label: "Uitgelicht op home / categorie pagina's", included: true },
];

function MembershipCheckIcon() {
  return (
    <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 12 2 2 4-4" /><circle cx="12" cy="12" r="10" />
    </svg>
  );
}
function MembershipCrossIcon() {
  return (
    <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" />
    </svg>
  );
}

function MembershipCard({ name, price, period, description, billing, features, isCurrent, featured, cta }: {
  name: string;
  price: string;
  period?: string;
  description: string;
  billing: string;
  features: Feature[];
  isCurrent: boolean;
  featured: boolean;
  cta: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col rounded-3xl p-6"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid rgba(3,0,5,0.10)",
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-lg font-bold" style={{ color: "#030005" }}>{name}</span>
        {isCurrent && (
          <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-white bg-gray-900">
            Huidig
          </span>
        )}
        {!isCurrent && featured && (
          <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-white bg-gray-900">
            Meest gekozen
          </span>
        )}
      </div>
      <p className="text-xs leading-snug mb-4 min-h-[32px]" style={{ color: "rgba(3,0,5,0.6)" }}>
        {description}
      </p>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-2xl font-bold" style={{ color: "#030005" }}>{price}</span>
        {period && <span className="text-xs" style={{ color: "rgba(3,0,5,0.5)" }}>{period}</span>}
      </div>
      <p className="text-xs mb-4" style={{ color: "rgba(3,0,5,0.5)" }}>{billing}</p>
      {cta}
      <ul className="flex flex-col gap-2.5 mt-5">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            {f.included ? <MembershipCheckIcon /> : <MembershipCrossIcon />}
            <span className="text-xs leading-snug" style={{ color: "#030005" }}>
              {f.prefix && <><strong>{f.prefix}</strong>{" "}</>}
              {f.label}
              {f.value && <><strong className="ml-1">{f.value}</strong></>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Stripe knoppen ───────────────────────────────────────────────────

function UpgradeButton({ tier, label, compact = false }: { tier: "plus" | "premium"; label: string; compact?: boolean }) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else { alert(data.error || "Er ging iets mis"); setLoading(false); }
  };

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className={`w-full bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50 font-medium ${compact ? "text-sm py-3" : "text-sm px-5 py-3 rounded-full"}`}
    >
      {loading ? "Doorsturen naar betaling..." : label}
    </button>
  );
}

function ManageBillingButton({ compact = false }: { compact?: boolean }) {
  const [loading, setLoading] = useState(false);

  const handlePortal = async () => {
    setLoading(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else { alert(data.error || "Er ging iets mis"); setLoading(false); }
  };

  if (compact) {
    return (
      <button
        onClick={handlePortal}
        disabled={loading}
        className="w-full border border-gray-200 text-gray-700 text-sm py-3 rounded-xl hover:border-gray-400 transition-colors disabled:opacity-50 font-medium"
      >
        {loading ? "Laden..." : "Beheer abonnement"}
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 bg-[#FCFAFF] rounded-2xl border border-[#E9E7F0]">
      <div>
        <p className="text-sm font-semibold text-gray-900">Membership beheren</p>
        <p className="text-xs text-gray-400 mt-0.5">Upgraden, downgraden of opzeggen</p>
      </div>
      <button
        onClick={handlePortal}
        disabled={loading}
        className="text-sm bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Laden..." : "Beheer abonnement"}
      </button>
    </div>
  );
}
