"use client";

import { useState } from "react";
import Image from "next/image";

const BASE = "https://xbvriaxprnupoakjpqnh.supabase.co/storage/v1/object/public/photographer-assets/testimonials";

const TESTIMONIALS = [
  {
    logo: "/logo-spektre.svg",
    logoAlt: "Spektre",
    quote: "LensLab heeft mij last minute perfect geholpen met de juiste fotograaf. Snel en top geregeld!",
    name: "Thijs Visser",
    title: "CCO & Co-founder, Spektre",
    avatar: `${BASE}/thijs-visser.PNG`,
  },
  {
    logo: "/logo-selecta.svg",
    logoAlt: "Selecta",
    quote: "Via LensLab heb ik snel de juiste shoot geregeld. Het resultaat: sterke foto's. Zeer tevreden.",
    name: "Martine Beiten",
    title: "CEO / C-Suite Leader Driving Strategic Commercial",
    avatar: `${BASE}/martine-beiten.jpg`,
  },
  {
    logo: null,
    logoAlt: null,
    quote: "Met LensLab vinden klanten mij snel en word ik vaker op het juiste moment geboekt.",
    name: "Jill van den Hoven",
    title: "Fotograaf",
    avatar: `${BASE}/jill-van-den-hoven.jpg`,
  },
];

type Testimonial = typeof TESTIMONIALS[number];

export default function TestimonialCarousel({
  fullWidth = false,
  testimonials,
}: {
  fullWidth?: boolean;
  testimonials?: Testimonial[];
}) {
  const list = testimonials ?? TESTIMONIALS;
  const [index, setIndex] = useState(0);
  const t = list[index];

  return (
    <div className={`relative bg-[#FCFAFF] rounded-3xl border border-[#E9E7F0] px-16 py-12 text-center w-full`}>
      {/* Pijl links */}
      <button
        onClick={() => setIndex((i) => (i - 1 + list.length) % list.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Pijl rechts */}
      <button
        onClick={() => setIndex((i) => (i + 1) % list.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Logo of spacer */}
      <div className="h-10 flex items-center justify-center mb-5">
        {t.logo ? (
          <Image src={t.logo} alt={t.logoAlt!} width={120} height={40} className="h-8 w-auto object-contain" />
        ) : (
          <div className="h-8" />
        )}
      </div>

      {/* Quote */}
      <blockquote className="text-2xl md:text-[30px] font-bold text-gray-900 leading-snug mb-8">
        &ldquo;{t.quote}&rdquo;
      </blockquote>

      {/* Persoon */}
      <div className="flex items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-[#E9E7F0] shrink-0">
          <Image
            src={t.avatar}
            alt={t.name}
            width={40}
            height={40}
            className="object-cover w-full h-full"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-gray-900">{t.name}</p>
          <p className="text-xs text-gray-400 max-w-[220px] leading-tight">{t.title}</p>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {list.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${i === index ? "bg-gray-900" : "bg-gray-300"}`}
          />
        ))}
      </div>
    </div>
  );
}
