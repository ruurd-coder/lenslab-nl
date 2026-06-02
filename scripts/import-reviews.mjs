/**
 * LensLab — Reviews import script
 *
 * Gebruik:
 *   1. Zet reviews.csv in de scripts/ map
 *   2. node scripts/import-reviews.mjs
 *
 * Het script:
 *   - Koppelt reviews aan fotografen via e-mailadres
 *   - Importeert alle reviews in de reviews tabel
 *   - Herberekent rating + review_count per fotograaf
 */

import { createClient } from "@supabase/supabase-js";
import { parse } from "csv-parse/sync";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = "https://xbvriaxprnupoakjpqnh.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CSV_PATH = path.join(__dirname, "reviews.csv");

if (!SUPABASE_SERVICE_KEY) {
  console.error("❌  Zet SUPABASE_SERVICE_ROLE_KEY als environment variabele");
  process.exit(1);
}

if (!fs.existsSync(CSV_PATH)) {
  console.error(`❌  reviews.csv niet gevonden in scripts/`);
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
  console.log("🚀  Reviews import gestart\n");

  // Laad alle fotografen op (email → id mapping)
  const { data: photographers, error: pgError } = await supabase
    .from("photographers")
    .select("id, email, business_name");

  if (pgError) throw new Error(`Fotografen ophalen mislukt: ${pgError.message}`);

  const emailToPhotographer = {};
  for (const p of photographers) {
    if (p.email) emailToPhotographer[p.email.toLowerCase().trim()] = p;
  }

  console.log(`📋  ${photographers.length} fotografen geladen\n`);

  // CSV inlezen
  const csvContent = fs.readFileSync(CSV_PATH, "utf-8");
  const rows = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  });

  console.log(`📄  ${rows.length} reviews gevonden in CSV\n`);

  const results = { success: 0, skipped: 0, errors: [] };
  const photographerReviews = {}; // email → array of ratings

  for (const row of rows) {
    const email = (row["Review voor fotograaf:"] || "").toLowerCase().trim();
    const reviewerName = (row["Review geschreven door"] || "").trim();
    const reviewText = (row["Review tekst"] || "").trim();
    const ratingRaw = (row["Sterren uit 5"] || "5").trim();
    const dateRaw = (row["Review datum"] || "").trim();
    const source = (row["Source"] || "").trim();

    if (!email) {
      results.skipped++;
      continue;
    }

    const photographer = emailToPhotographer[email];
    if (!photographer) {
      console.warn(`  ⚠️  NIET GEVONDEN: ${email}`);
      if (!results.missingEmails) results.missingEmails = new Set();
      results.missingEmails.add(email);
      results.skipped++;
      continue;
    }

    const rating = parseInt(ratingRaw) || 5;
    const reviewDate = dateRaw ? dateRaw : null;

    // Bijhouden voor herberekening
    if (!photographerReviews[email]) photographerReviews[email] = [];
    photographerReviews[email].push(rating);

    const { error } = await supabase.from("reviews").insert({
      photographer_id: photographer.id,
      reviewer_name: reviewerName || "Anoniem",
      rating,
      review_text: reviewText || null,
      review_date: reviewDate,
      source: source || null,
      is_published: true,
    });

    if (error) {
      console.error(`  ❌  ${photographer.business_name}: ${error.message}`);
      results.errors.push({ email, error: error.message });
    } else {
      console.log(`  ✅  ${photographer.business_name} — "${reviewerName}" (${rating}⭐)`);
      results.success++;
    }
  }

  // Herbereken rating + review_count per fotograaf
  console.log("\n📊  Ratings herberekenen...");

  for (const [email, ratings] of Object.entries(photographerReviews)) {
    const photographer = emailToPhotographer[email];
    if (!photographer) continue;

    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    const rounded = Math.round(avg * 10) / 10;

    const { error } = await supabase
      .from("photographers")
      .update({
        rating: rounded,
        review_count: ratings.length,
      })
      .eq("id", photographer.id);

    if (error) {
      console.warn(`  ⚠️  Rating update mislukt voor ${photographer.business_name}: ${error.message}`);
    } else {
      console.log(`  ⭐  ${photographer.business_name}: ${rounded}/5 (${ratings.length} reviews)`);
    }
  }

  console.log("\n─────────────────────────────────────");
  console.log(`✅  Geslaagd:    ${results.success}`);
  console.log(`⏭️   Overgeslagen: ${results.skipped}`);
  console.log(`❌  Fouten:      ${results.errors.length}`);
  if (results.missingEmails?.size > 0) {
    console.log("\n⚠️  Niet gevonden e-mails:");
    for (const email of results.missingEmails) {
      console.log(`   - ${email}`);
    }
  }
  console.log("\n🎉  Reviews import klaar!");
}

main().catch(console.error);
