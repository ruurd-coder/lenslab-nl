import Image from "next/image";
import Link from "next/link";
import SiteNav from "@/components/site-nav";

const BASE = "https://xbvriaxprnupoakjpqnh.supabase.co/storage/v1/object/public/photographer-assets/provincies";

const PROVINCES = [
  { name: "Noord-Holland", slug: "noord-holland", image: `${BASE}/Noord-Holland%20provincie.webp` },
  { name: "Zuid-Holland",  slug: "zuid-holland",  image: `${BASE}/Zuid-Holland%20provincie.webp` },
  { name: "Utrecht",       slug: "utrecht-provincie", image: `${BASE}/Utrecht%20provincie.webp` },
  { name: "Noord-Brabant", slug: "noord-brabant", image: `${BASE}/Brabant%20provincie.webp` },
  { name: "Gelderland",    slug: "gelderland",    image: `${BASE}/Gelderland%20provincie.webp` },
  { name: "Overijssel",    slug: "overijssel",    image: `${BASE}/Overrijsel%20provincie.webp` },
  { name: "Groningen",     slug: "groningen",     image: `${BASE}/Groningen%20provincie.webp` },
  { name: "Friesland",     slug: "friesland",     image: `${BASE}/Friesland%20provincie.webp` },
  { name: "Limburg",       slug: "limburg",       image: `${BASE}/Limburg%20provincie.webp` },
  { name: "Drenthe",       slug: "drenthe",       image: `${BASE}/Drenthe%20provincie.webp` },
  { name: "Flevoland",     slug: "flevoland",     image: `${BASE}/Flevoland%20provincie.webp` },
  { name: "Zeeland",       slug: "zeeland",       image: `${BASE}/Zeeland%20provincie.webp` },
];

import type { Metadata } from "next";
import { getPageSeoOverrides } from "@/lib/seo-overrides";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const ov = await getPageSeoOverrides('nl:locaties');
  return {
    title: ov?.meta_title || "Fotografen per provincie in Nederland | LensLab",
    description: ov?.meta_description || "Vind een professionele fotograaf of videograaf in jouw provincie. Bekijk aanbod per regio in alle 12 provincies van Nederland en neem direct contact op.",
    alternates: { canonical: "https://lenslab.nl/locaties" },
  };
}

export default function LocatiesPage() {
  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      <SiteNav />
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-16">
        <Link href="/beeldmakers" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Terug
        </Link>
        <h1 className="text-4xl font-black text-gray-900 mb-2">Alle provincies</h1>
        <p className="text-sm text-gray-400 mb-10">Vind een fotograaf in jouw provincie</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {PROVINCES.map((province) => (
            <Link key={province.slug} href={`/locatie/${province.slug}`} className="group">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#E9E7F0] mb-2">
                <Image src={province.image} alt={province.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <p className="text-sm font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                {province.name}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
