/**
 * Upload testimonial avatars naar Supabase Storage
 *
 * Zet foto's in scripts/fotos/Testimonials/:
 *   thijs-visser.jpg
 *   martine-beiten.jpg
 *   jill-van-den-hoven.jpg (optioneel, al in DB)
 *
 * Gebruik:
 *   node scripts/upload-testimonials.mjs
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(__dirname, "fotos", "Testimonials");
const SUPABASE_URL = "https://xbvriaxprnupoakjpqnh.supabase.co";
const BUCKET = "photographer-assets";

const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const files = fs.readdirSync(DIR).filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));

  for (const file of files) {
    const buffer = fs.readFileSync(path.join(DIR, file));
    const remotePath = `testimonials/${file}`;
    const ext = path.extname(file).toLowerCase();
    const mime = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";

    const { error } = await supabase.storage.from(BUCKET).upload(remotePath, buffer, { contentType: mime, upsert: true });
    if (error) { console.error(`❌ ${file}: ${error.message}`); continue; }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(remotePath);
    console.log(`✅ ${file}`);
    console.log(`   ${data.publicUrl}\n`);
  }
}

main().catch(console.error);
