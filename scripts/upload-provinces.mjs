/**
 * Upload provincie afbeeldingen naar Supabase Storage
 * en update automatisch de URLs in de code.
 *
 * Gebruik:
 *   node scripts/upload-provinces.mjs
 *
 * Mappenstructuur:
 *   scripts/fotos/Provincies/
 *     Noord-Holland.jpg
 *     Groningen.jpg
 *     Utrecht.jpg
 *     Noord-Brabant.jpg
 *     Friesland.jpg
 *     Limburg.jpg
 *     etc.
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = "https://xbvriaxprnupoakjpqnh.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PROVINCES_DIR = path.join(__dirname, "fotos", "Provincies");
const BUCKET = "photographer-assets";

// Mapping van bestandsnaam → slug
const SLUG_MAP = {
  "noord-holland": "noord-holland",
  "zuid-holland": "zuid-holland",
  "noord-brabant": "noord-brabant",
  "utrecht": "utrecht-provincie",
  "gelderland": "gelderland",
  "overijssel": "overijssel",
  "limburg": "limburg",
  "groningen": "groningen",
  "friesland": "friesland",
  "flevoland": "flevoland",
  "zeeland": "zeeland",
  "drenthe": "drenthe",
};

if (!SUPABASE_SERVICE_KEY) {
  console.error("❌  Zet SUPABASE_SERVICE_ROLE_KEY als environment variabele");
  process.exit(1);
}

if (!fs.existsSync(PROVINCES_DIR)) {
  console.error(`❌  Map niet gevonden: ${PROVINCES_DIR}`);
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const map = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
  return map[ext] || "image/jpeg";
}

function toSlugKey(filename) {
  return path.basename(filename, path.extname(filename))
    .toLowerCase()
    .replace(/\s*provincie\s*/gi, "") // verwijder " provincie"
    .trim()
    .replace(/\s+/g, "-");
}

async function main() {
  console.log("🚀  Provincie foto upload gestart\n");

  const files = fs.readdirSync(PROVINCES_DIR)
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));

  console.log(`📁  ${files.length} foto's gevonden\n`);

  const results = {};

  for (const file of files) {
    const slugKey = toSlugKey(file);
    const remotePath = `provincies/${file}`;
    const buffer = fs.readFileSync(path.join(PROVINCES_DIR, file));
    const mimeType = getMimeType(file);

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(remotePath, buffer, { contentType: mimeType, upsert: true });

    if (error) {
      console.error(`❌  ${file}: ${error.message}`);
      continue;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(remotePath);
    results[slugKey] = data.publicUrl;
    console.log(`✅  ${file} → ${data.publicUrl}`);
  }

  console.log("\n─────────────────────────────────────");
  console.log("📋  Kopieer deze URLs naar beeldmakers-client.tsx:\n");
  console.log("const PROVINCES = [");
  for (const [key, url] of Object.entries(results)) {
    const slug = SLUG_MAP[key] || key;
    const name = key.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("-");
    console.log(`  { name: "${name}", slug: "${slug}", image: "${url}" },`);
  }
  console.log("];");
}

main().catch(console.error);
