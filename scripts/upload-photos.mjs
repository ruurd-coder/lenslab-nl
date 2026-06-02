/**
 * LensLab — Foto upload script
 *
 * Gebruik:
 *   node scripts/upload-photos.mjs
 *
 * Mappenstructuur in scripts/fotos/:
 *   Jill van den Hoven/
 *     Avatar.jpg        → avatar_url
 *     Hero.jpg          → hero_image_url
 *     Familie-1.jpg     → portfolio_by_category["Familie"]
 *     Zwangerschap-1.jpg → portfolio_by_category["Zwangerschap"]
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { readdir } from "fs/promises";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = "https://xbvriaxprnupoakjpqnh.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PHOTOS_DIR = path.join(__dirname, "fotos");
const BUCKET = "photographer-assets";

if (!SUPABASE_SERVICE_KEY) {
  console.error("❌  Zet SUPABASE_SERVICE_ROLE_KEY als environment variabele");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Naam → slug (zelfde logica als import script)
function toSlug(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['']/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const map = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".heic": "image/heic" };
  return map[ext] || "image/jpeg";
}

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET);
  if (!exists) {
    await supabase.storage.createBucket(BUCKET, { public: true, fileSizeLimit: 20 * 1024 * 1024 });
    console.log(`✅  Bucket "${BUCKET}" aangemaakt`);
  }
}

async function uploadFile(slug, filename, buffer, mimeType) {
  const remotePath = `${slug}/${filename}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(remotePath, buffer, { contentType: mimeType, upsert: true });

  if (error) {
    console.warn(`    ⚠️  Upload mislukt: ${error.message}`);
    return null;
  }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(remotePath);
  return data.publicUrl;
}

// Haal categorie op uit bestandsnaam: "Familie-1.jpg" → "Familie"
function getCategoryFromFilename(filename) {
  const base = path.basename(filename, path.extname(filename));
  // Verwijder trailing cijfer/koppelteken: "Familie-1" → "Familie", "Bruiloft 2" → "Bruiloft"
  return base.replace(/[-_\s]+\d+$/, "").trim();
}

async function main() {
  console.log("🚀  Foto upload gestart\n");

  if (!fs.existsSync(PHOTOS_DIR)) {
    console.error(`❌  Map niet gevonden: ${PHOTOS_DIR}`);
    console.error("   Zet de 'fotos' map in scripts/fotos/");
    process.exit(1);
  }

  await ensureBucket();

  // Laad alle fotografen (slug + business_name + contact_name)
  const { data: photographers } = await supabase
    .from("photographers")
    .select("id, slug, business_name, contact_name");

  // Bouw opzoektabel: slug → photographer
  const bySlug = {};
  for (const p of photographers || []) {
    bySlug[p.slug] = p;
  }

  // Haal mappen op
  const folders = fs.readdirSync(PHOTOS_DIR).filter((f) => {
    return fs.statSync(path.join(PHOTOS_DIR, f)).isDirectory();
  });

  console.log(`📁  ${folders.length} mappen gevonden\n`);

  const results = { success: 0, notFound: [], errors: [] };

  for (const folderName of folders) {
    const slug = toSlug(folderName);

    // Zoek fotograaf — eerst exacte slug, dan fuzzy match op naam
    let photographer = bySlug[slug];
    if (!photographer) {
      // Probeer te matchen op business_name of contact_name
      photographer = photographers?.find((p) => {
        const pSlug = toSlug(p.business_name || "");
        const cSlug = toSlug(p.contact_name || "");
        return pSlug === slug || cSlug === slug ||
          p.business_name?.toLowerCase() === folderName.toLowerCase() ||
          p.contact_name?.toLowerCase() === folderName.toLowerCase();
      });
    }

    if (!photographer) {
      console.warn(`⚠️   Niet gevonden: "${folderName}" (slug: ${slug})`);
      results.notFound.push(folderName);
      continue;
    }

    console.log(`\n👤  ${folderName} → ${photographer.slug}`);

    const folderPath = path.join(PHOTOS_DIR, folderName);
    const files = fs.readdirSync(folderPath)
      .filter((f) => /\.(jpg|jpeg|png|webp|heic)$/i.test(f))
      .sort();

    let avatarUrl = null;
    let heroUrl = null;
    const portfolioByCategory = photographer.portfolio_by_category || {};

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const buffer = fs.readFileSync(filePath);
      const mimeType = getMimeType(file);
      const nameLower = file.toLowerCase();
      const base = path.basename(file, path.extname(file)).toLowerCase();

      if (base === "avatar") {
        avatarUrl = await uploadFile(photographer.slug, file, buffer, mimeType);
        console.log(`   👤  Avatar: ${file}`);
      } else if (base === "hero") {
        heroUrl = await uploadFile(photographer.slug, file, buffer, mimeType);
        console.log(`   🖼️   Hero: ${file}`);
      } else {
        // Categorie foto
        const category = getCategoryFromFilename(file);
        const url = await uploadFile(photographer.slug, file, buffer, mimeType);
        if (url) {
          if (!portfolioByCategory[category]) portfolioByCategory[category] = [];
          if (portfolioByCategory[category].length < 10) {
            portfolioByCategory[category].push(url);
            console.log(`   📸  ${category}: ${file}`);
          } else {
            console.warn(`   ⚠️  Max 10 bereikt voor ${category}, ${file} overgeslagen`);
          }
        }
      }
    }

    // Update database
    const updates = { portfolio_by_category: portfolioByCategory };
    if (avatarUrl) updates.avatar_url = avatarUrl;
    if (heroUrl) updates.hero_image_url = heroUrl;

    // Als geen hero maar wel avatar, gebruik avatar als hero
    if (!heroUrl && avatarUrl && !photographer.hero_image_url) {
      updates.hero_image_url = avatarUrl;
    }

    const { error } = await supabase
      .from("photographers")
      .update(updates)
      .eq("id", photographer.id);

    if (error) {
      console.error(`   ❌  DB update mislukt: ${error.message}`);
      results.errors.push(folderName);
    } else {
      console.log(`   ✅  Opgeslagen`);
      results.success++;
    }
  }

  console.log("\n─────────────────────────────────────");
  console.log(`✅  Geslaagd:      ${results.success}`);
  console.log(`❓  Niet gevonden: ${results.notFound.length}`);
  console.log(`❌  Fouten:        ${results.errors.length}`);

  if (results.notFound.length > 0) {
    console.log("\n⚠️   Niet gevonden mappen:");
    results.notFound.forEach((n) => console.log(`   - ${n}`));
  }

  console.log("\n🎉  Klaar!");
}

main().catch(console.error);
