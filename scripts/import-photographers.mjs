/**
 * LensLab — Fotograaf import script
 *
 * Gebruik:
 *   1. Zet fotografen.csv in de scripts/ map
 *   2. node scripts/import-photographers.mjs
 *
 * Het script:
 *   - Leest de CSV
 *   - Genereert slugs automatisch
 *   - Schont data op (emojis, types, whitespace)
 *   - Upload foto's uit scripts/fotos/<slug>/ naar Supabase Storage
 *   - Voegt fotografen in in de database
 */

import { createClient } from "@supabase/supabase-js";
import { parse } from "csv-parse/sync";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { readdir } from "fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Config ──────────────────────────────────────────────────────────
const SUPABASE_URL = "https://xbvriaxprnupoakjpqnh.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PHOTOS_DIR = path.join(__dirname, "fotos");
const CSV_PATH = path.join(__dirname, "fotografen.csv");
const STORAGE_BUCKET = "photographer-assets";

if (!SUPABASE_SERVICE_KEY) {
  console.error("❌  Zet SUPABASE_SERVICE_ROLE_KEY als environment variabele");
  console.error("   Gebruik: SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/import-photographers.mjs");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ── Helpers ─────────────────────────────────────────────────────────

function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // accenten verwijderen
    .replace(/['']/g, "")            // apostrofs
    .replace(/[^a-z0-9\s-]/g, "")   // niet-alfanumeriek
    .trim()
    .replace(/\s+/g, "-")            // spaties → koppelteken
    .replace(/-+/g, "-");            // dubbele koppeltekens
}

function cleanSpecialties(raw) {
  if (!raw) return [];
  return raw
    .split(/[,\n]/)
    .map((s) =>
      s
        .replace(/[\u{1F000}-\u{1FFFF}]/gu, "") // emojis verwijderen
        .replace(/[☀-⟿]/g, "")         // meer emojis
        .replace(/️/g, "")                  // variatie selector
        .trim()
    )
    .filter(Boolean);
}

function cleanRegions(raw) {
  if (!raw) return [];
  return raw
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean);
}

function normalizeType(raw) {
  const t = (raw || "").toLowerCase().trim();
  if (t.includes("video") && t.includes("foto")) return "beide";
  if (t.includes("video")) return "videograaf";
  return "fotograaf";
}

function ensureHttps(url) {
  if (!url) return null;
  url = url.trim();
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `https://${url}`;
}

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === STORAGE_BUCKET);
  if (!exists) {
    const { error } = await supabase.storage.createBucket(STORAGE_BUCKET, {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024, // 10MB
    });
    if (error) throw new Error(`Bucket aanmaken mislukt: ${error.message}`);
    console.log(`✅  Bucket "${STORAGE_BUCKET}" aangemaakt`);
  }
}

async function uploadPhoto(slug, filename, fileBuffer, mimeType) {
  const ext = path.extname(filename).toLowerCase();
  const remotePath = `${slug}/${filename}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(remotePath, fileBuffer, {
      contentType: mimeType || "image/jpeg",
      upsert: true,
    });

  if (error) {
    console.warn(`  ⚠️  Upload mislukt voor ${remotePath}: ${error.message}`);
    return null;
  }

  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(remotePath);

  return data.publicUrl;
}

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const map = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
  return map[ext] || "image/jpeg";
}

async function processPhotos(slug) {
  const folderPath = path.join(PHOTOS_DIR, slug);

  if (!fs.existsSync(folderPath)) {
    return { heroUrl: null, avatarUrl: null, portfolioUrls: [] };
  }

  const files = (await readdir(folderPath))
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort();

  let heroUrl = null;
  let avatarUrl = null;
  const portfolioUrls = [];

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const buffer = fs.readFileSync(filePath);
    const mimeType = getMimeType(file);
    const nameLower = file.toLowerCase();

    if (nameLower.startsWith("hero")) {
      heroUrl = await uploadPhoto(slug, file, buffer, mimeType);
      console.log(`  📸  Hero geüpload: ${file}`);
    } else if (nameLower.startsWith("avatar")) {
      avatarUrl = await uploadPhoto(slug, file, buffer, mimeType);
      console.log(`  👤  Avatar geüpload: ${file}`);
    } else {
      const url = await uploadPhoto(slug, file, buffer, mimeType);
      if (url) {
        portfolioUrls.push(url);
        console.log(`  🖼️   Portfolio geüpload: ${file}`);
      }
    }
  }

  return { heroUrl, avatarUrl, portfolioUrls };
}

// ── Slug uniqueness ──────────────────────────────────────────────────

async function getExistingSlugs() {
  const { data } = await supabase.from("photographers").select("slug");
  return new Set((data || []).map((r) => r.slug));
}

function makeUniqueSlug(base, existingSlugs) {
  if (!existingSlugs.has(base)) return base;
  let i = 2;
  while (existingSlugs.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

// ── Hoofd import ─────────────────────────────────────────────────────

async function main() {
  console.log("🚀  LensLab fotograaf import gestart\n");

  if (!fs.existsSync(CSV_PATH)) {
    console.error(`❌  CSV niet gevonden: ${CSV_PATH}`);
    console.error("   Zet fotografen.csv in de scripts/ map");
    process.exit(1);
  }

  await ensureBucket();

  const csvContent = fs.readFileSync(CSV_PATH, "utf-8");
  const rows = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  console.log(`📋  ${rows.length} fotografen gevonden in CSV\n`);

  const existingSlugs = await getExistingSlugs();
  const results = { success: 0, skipped: 0, errors: [] };

  for (const row of rows) {
    const businessName = (row.business_name || row.contact_name || "").trim();
    if (!businessName) {
      console.warn("⚠️   Rij overgeslagen: geen business_name");
      results.skipped++;
      continue;
    }

    const baseSlug = row.slug?.trim() || generateSlug(businessName);
    const slug = makeUniqueSlug(baseSlug, existingSlugs);
    existingSlugs.add(slug);

    console.log(`\n👤  ${businessName} (${slug})`);

    // Foto's uploaden
    const { heroUrl, avatarUrl, portfolioUrls } = await processPhotos(slug);

    // Data opbouwen
    const photographer = {
      slug,
      business_name: businessName,
      contact_name: row.contact_name?.trim() || businessName,
      type: normalizeType(row.type),
      bio: row.bio?.trim() || null,
      city: row.city?.trim() || null,
      regions: cleanRegions(row.regions),
      specialties: cleanSpecialties(row.specialties),
      membership_tier: row.membership_tier?.trim() || "free",
      email: row.email?.trim() || null,
      phone: row.phone?.trim() || null,
      website_url: ensureHttps(row.website_url),
      instagram_url: ensureHttps(row.instagram_url),
      facebook_url: ensureHttps(row.facebook_url),
      youtube_url: ensureHttps(row.youtube_url),
      linkedin_url: ensureHttps(row.linkedin_url),
      hero_image_url: heroUrl,
      avatar_url: avatarUrl,
      portfolio_images: portfolioUrls,
      portfolio_by_category: {},
      is_published: true,
      is_verified: false,
      is_b2b: false,
      rating: parseFloat(row.rating) || 0,
      review_count: parseInt(row.review_count) || 0,
    };

    const { error } = await supabase
      .from("photographers")
      .upsert(photographer, { onConflict: "slug" });

    if (error) {
      console.error(`  ❌  Fout: ${error.message}`);
      results.errors.push({ name: businessName, error: error.message });
    } else {
      console.log(`  ✅  Opgeslagen`);
      results.success++;
    }
  }

  console.log("\n─────────────────────────────────────");
  console.log(`✅  Geslaagd:    ${results.success}`);
  console.log(`⏭️   Overgeslagen: ${results.skipped}`);
  console.log(`❌  Fouten:      ${results.errors.length}`);
  if (results.errors.length > 0) {
    console.log("\nFouten:");
    results.errors.forEach((e) => console.log(`  - ${e.name}: ${e.error}`));
  }
  console.log("\n🎉  Import klaar!");
}

main().catch(console.error);
