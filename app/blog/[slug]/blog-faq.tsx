"use client";

import { useState } from "react";

type FaqItem = { q: string; a: string };

export default function BlogFaq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1.8fr] gap-8 md:gap-12">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-3">
          Veelgestelde vragen
        </h2>
        <p className="text-sm text-gray-500">Alles wat je moet weten.</p>
      </div>
      <div>
        {items.map((item, i) => (
          <div key={i} className="border-b border-[#E9E7F0]">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-start justify-between py-4 text-left gap-4"
            >
              <span className="flex items-start gap-3">
                <span className="text-xs font-mono text-gray-400 mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[15px] text-gray-900 font-medium">{item.q}</span>
              </span>
              <svg
                className={`w-4 h-4 shrink-0 text-gray-400 transition-transform mt-0.5 ${open === i ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {open === i && (
              <p className="text-sm text-gray-500 leading-relaxed pb-4 pl-7">{item.a}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
