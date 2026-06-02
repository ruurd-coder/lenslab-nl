"use client";

import { useState } from "react";
import Image from "next/image";

const TESTIMONIALS = [
  {
    company: "Spektre",
    quote: "LensLab heeft mij last minute perfect geholpen met de juiste fotograaf. Snel en top geregeld!",
    name: "Thijs Visser",
    title: "CCO & Co-Founder, Spektre",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop",
  },
  {
    company: "Studio Noord",
    quote: "Binnen een dag de perfecte fotograaf gevonden voor ons teamportret. Geweldige kwaliteit!",
    name: "Laura de Vries",
    title: "Marketing Manager, Studio Noord",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop",
  },
  {
    company: "Bloom Agency",
    quote: "Via LensLab vinden wij consistent topfotografen voor al onze klanten. Aanrader!",
    name: "Mark Janssen",
    title: "Creative Director, Bloom Agency",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop",
  },
];

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const t = TESTIMONIALS[index];

  return (
    <div className="relative bg-white rounded-3xl border border-[#E9E7F0] px-16 py-12 text-center max-w-3xl mx-auto">
      {/* Pijl links */}
      <button
        onClick={() => setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Pijl rechts */}
      <button
        onClick={() => setIndex((i) => (i + 1) % TESTIMONIALS.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Bedrijfsnaam */}
      <p className="text-sm font-semibold text-gray-400 mb-5 tracking-wide">{t.company}</p>

      {/* Quote */}
      <blockquote className="text-xl md:text-2xl font-bold text-gray-900 leading-snug mb-8">
        &ldquo;{t.quote}&rdquo;
      </blockquote>

      {/* Persoon */}
      <div className="flex items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
          <Image src={t.avatar} alt={t.name} width={40} height={40} className="object-cover" />
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-gray-900">{t.name}</p>
          <p className="text-xs text-gray-400">{t.title}</p>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {TESTIMONIALS.map((_, i) => (
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
