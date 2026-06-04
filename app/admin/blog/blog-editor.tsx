"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export type ContentBlock = {
  id: string;
  type: "h2" | "h3" | "paragraph" | "bulletList" | "image";
  content?: string;
  items?: string[];
  url?: string;
  alt?: string;
};

export type FaqItem = { q: string; a: string };

export type BlogPost = {
  id?: string;
  title: string;
  slug: string;
  category: string;
  intro: string;
  hero_image_url: string;
  reading_time_minutes: number;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_image_url: string;
  content_blocks: ContentBlock[];
  faq_items: FaqItem[];
  summary_items: string[];
  related_slugs: string[];
  is_published: boolean;
  published_at?: string;
  author: string;
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const BLOCK_TYPES: { value: ContentBlock["type"]; label: string }[] = [
  { value: "h2", label: "H2 — Sectietitel" },
  { value: "h3", label: "H3 — Subtitel" },
  { value: "paragraph", label: "Paragraaf" },
  { value: "bulletList", label: "Opsomming" },
  { value: "image", label: "Afbeelding" },
];

// ── Image upload helper ──────────────────────────────────────────────

async function uploadBlogImage(file: File): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `blog/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage
    .from("photographer-assets")
    .upload(path, file, { upsert: false });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from("photographer-assets").getPublicUrl(path);
  return data.publicUrl;
}

function ImageUploadButton({
  currentUrl,
  onUploaded,
  label = "Afbeelding uploaden",
}: {
  currentUrl?: string;
  onUploaded: (url: string) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Max 5MB per afbeelding."); return; }
    setUploading(true);
    try {
      const url = await uploadBlogImage(file);
      onUploaded(url);
    } catch (err) {
      alert("Upload mislukt: " + (err instanceof Error ? err.message : "onbekende fout"));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {currentUrl && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
          <Image src={currentUrl} alt="Preview" fill className="object-cover" />
        </div>
      )}
      <label className={`inline-flex items-center gap-2 cursor-pointer text-sm px-4 py-2 rounded-xl border transition-colors font-medium ${
        currentUrl
          ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
          : "border-gray-200 bg-[#FCFAFF] text-gray-700 hover:border-gray-400"
      }`}>
        {uploading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
            Uploaden...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
            {currentUrl ? "Andere afbeelding uploaden" : label}
          </>
        )}
        <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={handleFile} disabled={uploading} />
      </label>
    </div>
  );
}

// ── Blog editor ──────────────────────────────────────────────────────

export default function BlogEditor({ initial }: { initial: BlogPost }) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost>(initial);
  const [saving, setSaving] = useState(false);
  const [slugManual, setSlugManual] = useState(!!initial.id);
  const [activeTab, setActiveTab] = useState<"content" | "seo" | "faq" | "summary">("content");

  const set = (field: keyof BlogPost, value: unknown) => setPost((p) => ({ ...p, [field]: value }));

  // Auto-slug from title — always clean, no leading slashes or /blog/ prefix
  const cleanSlug = (s: string) => s.replace(/^\/+/, "").replace(/^blog\//, "");
  const handleTitleChange = (v: string) => {
    set("title", v);
    if (!slugManual) set("slug", slugify(v));
  };

  // ── Content blocks ──────────────────────────────────────────
  const addBlock = (type: ContentBlock["type"]) => {
    const block: ContentBlock = { id: uid(), type, content: "", items: type === "bulletList" ? [""] : undefined };
    set("content_blocks", [...post.content_blocks, block]);
  };

  const updateBlock = (id: string, changes: Partial<ContentBlock>) => {
    set("content_blocks", post.content_blocks.map((b) => b.id === id ? { ...b, ...changes } : b));
  };

  const removeBlock = (id: string) => {
    set("content_blocks", post.content_blocks.filter((b) => b.id !== id));
  };

  const moveBlock = (id: string, dir: -1 | 1) => {
    const blocks = [...post.content_blocks];
    const i = blocks.findIndex((b) => b.id === id);
    if (i + dir < 0 || i + dir >= blocks.length) return;
    [blocks[i], blocks[i + dir]] = [blocks[i + dir], blocks[i]];
    set("content_blocks", blocks);
  };

  const updateBulletItem = (blockId: string, idx: number, value: string) => {
    const block = post.content_blocks.find((b) => b.id === blockId)!;
    const items = [...(block.items || [])];
    items[idx] = value;
    updateBlock(blockId, { items });
  };

  const addBulletItem = (blockId: string) => {
    const block = post.content_blocks.find((b) => b.id === blockId)!;
    updateBlock(blockId, { items: [...(block.items || []), ""] });
  };

  const removeBulletItem = (blockId: string, idx: number) => {
    const block = post.content_blocks.find((b) => b.id === blockId)!;
    updateBlock(blockId, { items: (block.items || []).filter((_, i) => i !== idx) });
  };

  // ── FAQ ─────────────────────────────────────────────────────
  const addFaq = () => set("faq_items", [...post.faq_items, { q: "", a: "" }]);
  const updateFaq = (i: number, field: "q" | "a", val: string) => {
    const items = [...post.faq_items];
    items[i] = { ...items[i], [field]: val };
    set("faq_items", items);
  };
  const removeFaq = (i: number) => set("faq_items", post.faq_items.filter((_, idx) => idx !== i));

  // ── Summary ─────────────────────────────────────────────────
  const addSummary = () => set("summary_items", [...post.summary_items, ""]);
  const updateSummary = (i: number, val: string) => {
    const items = [...post.summary_items];
    items[i] = val;
    set("summary_items", items);
  };
  const removeSummary = (i: number) => set("summary_items", post.summary_items.filter((_, idx) => idx !== i));

  // ── Save ────────────────────────────────────────────────────
  const handleSave = async (publish?: boolean) => {
    setSaving(true);
    const payload = { ...post };
    if (publish !== undefined) payload.is_published = publish;
    if (publish && !payload.published_at) payload.published_at = new Date().toISOString();

    const res = await fetch("/api/admin/blog", {
      method: post.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      if (!post.id) router.push(`/admin/blog/${data.id}`);
      else router.refresh();
    } else {
      const body = await res.json().catch(() => ({}));
      alert("Opslaan mislukt: " + (body?.error || res.status));
    }
  };

  const tabs = [
    { id: "content" as const, label: "Inhoud" },
    { id: "seo" as const, label: "SEO" },
    { id: "faq" as const, label: `FAQ (${post.faq_items.length})` },
    { id: "summary" as const, label: `Samenvatting (${post.summary_items.length})` },
  ];

  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      <div className="max-w-4xl mx-auto px-5 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <a href="/admin/blog" className="text-sm text-gray-400 hover:text-gray-700 block mb-1">← Blog overzicht</a>
            <h1 className="text-xl font-black text-gray-900">{post.id ? "Artikel bewerken" : "Nieuw artikel"}</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleSave(false)} disabled={saving}
              className="text-sm border border-gray-200 text-gray-700 px-4 py-2 rounded-full hover:border-gray-400 transition-colors disabled:opacity-50">
              {saving ? "Opslaan..." : "Opslaan als concept"}
            </button>
            <button onClick={() => handleSave(true)} disabled={saving}
              className="text-sm bg-gray-900 text-white px-5 py-2 rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50 font-semibold">
              {post.is_published ? "Bijwerken" : "Publiceren"}
            </button>
          </div>
        </div>

        {/* Meta fields */}
        <div className="bg-white rounded-2xl border border-[#E9E7F0] p-6 mb-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Titel *</label>
            <input value={post.title} onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Productfoto's laten maken, slim geschaald met AI en de juiste creators"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF] font-medium" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Slug (URL)</label>
              <div className="flex items-center gap-2">
                <input value={post.slug}
                  onChange={(e) => {
                    setSlugManual(true);
                    set("slug", cleanSlug(e.target.value));
                  }}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF] font-mono" />
              </div>
              <p className="text-xs text-gray-400 mt-1">lenslab.nl/blog/{post.slug || "..."}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Categorie</label>
              <input value={post.category} onChange={(e) => set("category", e.target.value)}
                placeholder="bijv. Productfotografie"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF]" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Leestijd (minuten)</label>
              <input type="number" min={1} value={post.reading_time_minutes}
                onChange={(e) => set("reading_time_minutes", parseInt(e.target.value) || 5)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Auteur</label>
              <input value={post.author} onChange={(e) => set("author", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF]" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Intro tekst *</label>
            <textarea value={post.intro} onChange={(e) => set("intro", e.target.value)}
              rows={3} placeholder="Kort intro die direct onder de H1 staat..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF] resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Hero afbeelding</label>
            <ImageUploadButton
              currentUrl={post.hero_image_url}
              onUploaded={(url) => set("hero_image_url", url)}
              label="Hero afbeelding uploaden"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#E9E7F0] rounded-full p-1 mb-5 w-fit overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`text-sm px-4 py-2 rounded-full transition-colors font-medium shrink-0 ${activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab: Inhoud ── */}
        {activeTab === "content" && (
          <div className="space-y-3">
            {post.content_blocks.map((block, idx) => (
              <div key={block.id} className="bg-white rounded-2xl border border-[#E9E7F0] p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                    block.type === "h2" ? "bg-blue-100 text-blue-700" :
                    block.type === "h3" ? "bg-purple-100 text-purple-700" :
                    block.type === "bulletList" ? "bg-orange-100 text-orange-700" :
                    block.type === "image" ? "bg-green-100 text-green-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {BLOCK_TYPES.find(t => t.value === block.type)?.label}
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => moveBlock(block.id, -1)} disabled={idx === 0} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs disabled:opacity-30">↑</button>
                    <button onClick={() => moveBlock(block.id, 1)} disabled={idx === post.content_blocks.length - 1} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs disabled:opacity-30">↓</button>
                    <button onClick={() => removeBlock(block.id)} className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 text-xs">×</button>
                  </div>
                </div>

                {(block.type === "h2" || block.type === "h3" || block.type === "paragraph") && (
                  block.type === "paragraph" ? (
                    <textarea value={block.content} rows={4}
                      onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                      placeholder="Schrijf je paragraaf hier..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF] resize-none" />
                  ) : (
                    <input value={block.content}
                      onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                      placeholder={block.type === "h2" ? "Sectietitel..." : "Subtitel..."}
                      className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-gray-400 bg-[#FCFAFF] ${block.type === "h2" ? "text-lg font-bold" : "text-base font-semibold"}`} />
                  )
                )}

                {block.type === "bulletList" && (
                  <div className="space-y-2">
                    {(block.items || []).map((item, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-gray-400 mt-2.5 text-xs">•</span>
                        <input value={item}
                          onChange={(e) => updateBulletItem(block.id, i, e.target.value)}
                          placeholder={`Punt ${i + 1}...`}
                          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF]" />
                        <button onClick={() => removeBulletItem(block.id, i)} className="text-red-400 hover:text-red-600 text-xs px-2">×</button>
                      </div>
                    ))}
                    <button onClick={() => addBulletItem(block.id)} className="text-sm text-gray-400 hover:text-gray-700 underline">+ Punt toevoegen</button>
                  </div>
                )}

                {block.type === "image" && (
                  <div className="space-y-2">
                    <ImageUploadButton
                      currentUrl={block.url}
                      onUploaded={(url) => updateBlock(block.id, { url })}
                    />
                    <input value={block.alt || ""}
                      onChange={(e) => updateBlock(block.id, { alt: e.target.value })}
                      placeholder="Alt tekst (SEO — beschrijf de afbeelding)"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF]" />
                  </div>
                )}
              </div>
            ))}

            {/* Block toevoegen */}
            <div className="bg-white rounded-2xl border border-dashed border-[#E9E7F0] p-4">
              <p className="text-xs font-semibold text-gray-400 mb-3">BLOK TOEVOEGEN</p>
              <div className="flex flex-wrap gap-2">
                {BLOCK_TYPES.map((t) => (
                  <button key={t.value} onClick={() => addBlock(t.value)}
                    className="text-sm border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:border-gray-900 hover:text-gray-900 transition-colors">
                    + {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: SEO ── */}
        {activeTab === "seo" && (
          <div className="bg-white rounded-2xl border border-[#E9E7F0] p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Meta titel</label>
              <input value={post.meta_title} onChange={(e) => set("meta_title", e.target.value)}
                placeholder="Productfoto's laten maken | LensLab"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF]" />
              <p className="text-xs text-gray-400 mt-1">{post.meta_title?.length || 0}/60 tekens</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Meta omschrijving</label>
              <textarea value={post.meta_description} onChange={(e) => set("meta_description", e.target.value)}
                rows={3} placeholder="Korte omschrijving voor Google (max 160 tekens)..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF] resize-none" />
              <p className="text-xs text-gray-400 mt-1">{post.meta_description?.length || 0}/160 tekens</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Zoekwoorden</label>
              <input value={post.meta_keywords} onChange={(e) => set("meta_keywords", e.target.value)}
                placeholder="productfotografie, foto's laten maken, webshop fotograaf"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Social media afbeelding (OG image)
              </label>
              <p className="text-xs text-gray-400 mb-2">1200 × 630px · verhouding 1.91:1 · PNG, JPG of WEBP</p>
              <ImageUploadButton
                currentUrl={post.og_image_url}
                onUploaded={(url) => set("og_image_url", url)}
                label="Social media afbeelding uploaden"
              />
              {post.og_image_url && (
                <p className="text-xs text-gray-400 mt-2">
                  ✓ Wordt getoond bij delen op LinkedIn, Twitter, WhatsApp etc.
                  {!post.og_image_url && " (valt terug op hero afbeelding als leeg)"}
                </p>
              )}
              {!post.og_image_url && (
                <p className="text-xs text-gray-400 mt-2">
                  Niet ingevuld → hero afbeelding wordt gebruikt als fallback.
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Gerelateerde artikelen (slugs, komma-gescheiden)</label>
              <input
                value={post.related_slugs.join(", ")}
                onChange={(e) => set("related_slugs", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                placeholder="bruiloftsfotografie-tips, portretfoto-laten-maken"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF]" />
            </div>

            {/* Google preview */}
            {(post.meta_title || post.title) && (
              <div className="mt-6 p-4 bg-[#FCFAFF] rounded-xl border border-[#E9E7F0]">
                <p className="text-xs font-bold text-gray-400 uppercase mb-3">Google voorbeeld</p>
                <p className="text-[#1a0dab] text-lg hover:underline cursor-pointer">{post.meta_title || post.title}</p>
                <p className="text-xs text-green-700">https://lenslab.nl/blog/{post.slug}</p>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.meta_description || post.intro}</p>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: FAQ ── */}
        {activeTab === "faq" && (
          <div className="space-y-3">
            {post.faq_items.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E9E7F0] p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-400">VRAAG {i + 1}</span>
                  <button onClick={() => removeFaq(i)} className="text-xs text-red-400 hover:text-red-600">Verwijderen</button>
                </div>
                <input value={item.q} onChange={(e) => updateFaq(i, "q", e.target.value)}
                  placeholder="Hoe werkt het om productfoto's te laten maken via LensLab?"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF] mb-2 font-medium" />
                <textarea value={item.a} onChange={(e) => updateFaq(i, "a", e.target.value)}
                  rows={3} placeholder="Antwoord..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF] resize-none" />
              </div>
            ))}
            <button onClick={addFaq}
              className="w-full border border-dashed border-gray-200 rounded-2xl py-4 text-sm text-gray-400 hover:border-gray-400 hover:text-gray-700 transition-colors">
              + Vraag toevoegen
            </button>
          </div>
        )}

        {/* ── Tab: Samenvatting ── */}
        {activeTab === "summary" && (
          <div className="bg-white rounded-2xl border border-[#E9E7F0] p-6 space-y-3">
            <p className="text-sm text-gray-500 mb-4">De samenvatting verschijnt als een box aan het einde van het artikel.</p>
            {post.summary_items.map((item, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-gray-400 mt-2.5 text-xs">•</span>
                <input value={item} onChange={(e) => updateSummary(i, e.target.value)}
                  placeholder={`Punt ${i + 1}...`}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-[#FCFAFF]" />
                <button onClick={() => removeSummary(i)} className="text-red-400 hover:text-red-600 text-xs px-2">×</button>
              </div>
            ))}
            <button onClick={addSummary} className="text-sm text-gray-400 hover:text-gray-700 underline">+ Punt toevoegen</button>
          </div>
        )}

      </div>
    </div>
  );
}
