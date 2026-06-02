"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

const STORAGE_BUCKET = "photographer-assets";
const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

export function SpecialtyUploader({
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
      setSizeError(`${oversized.length} bestand(en) zijn groter dan 1MB.`);
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
        <p className="text-xs text-gray-400">📁 JPG, PNG, WEBP · 📏 Max 1MB · ↕️ Sleep · ⭐ Hero</p>
      </div>
      {sizeError && <p className="text-xs text-red-500 bg-red-50 rounded-xl px-3 py-2 mb-3">{sizeError}</p>}

      <div className="grid grid-cols-5 gap-2">
        {images.map((url, i) => (
          <div key={url} draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDragEnd={handleDragEnd}
            className={`relative aspect-square group cursor-grab ${dragIndex === i ? "opacity-50 ring-2 ring-blue-400" : ""} ${i === 0 ? "ring-2 ring-gray-300" : ""}`}>
            <Image src={url} alt={`${specialty} ${i + 1}`} fill className="object-cover" />
            {url === heroImage && (
              <div className="absolute bottom-1 left-1 bg-amber-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">HERO</div>
            )}
            {i === 0 && url !== heroImage && (
              <div className="absolute bottom-1 left-1 bg-gray-600 text-white text-[10px] px-1.5 py-0.5 rounded">#1</div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
              <button onClick={() => onSetHero(url)} title="Hero" className="w-7 h-7 bg-amber-400 text-white rounded-full text-sm flex items-center justify-center">⭐</button>
              <button onClick={() => handleDelete(url)} title="Verwijder" className="w-7 h-7 bg-red-500 text-white rounded-full text-sm flex items-center justify-center">×</button>
            </div>
          </div>
        ))}
        {images.length < MAX_IMAGES && (
          <label className="aspect-square border-2 border-dashed border-gray-200 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 bg-[#FCFAFF] gap-1">
            <input type="file" accept=".jpg,.jpeg,.png,.webp" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
            {uploading ? <span className="text-xs text-gray-400">...</span> : (
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
