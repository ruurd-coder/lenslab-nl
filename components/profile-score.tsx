"use client";

import { useState, useRef, useEffect } from "react";
import type { Photographer } from "@/lib/types";
import { calcBreakdown, calcTips } from "@/lib/profile-score";

const R = 32;
const CIRCUMFERENCE = 2 * Math.PI * R;

export default function ProfileScore({ photographer }: { photographer: Photographer }) {
  const [open, setOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const bd = calcBreakdown(photographer);
  const tips = calcTips(bd);
  const pct = bd.totalMax > 0 ? bd.total / bd.totalMax : 0;
  const offset = CIRCUMFERENCE - pct * CIRCUMFERENCE;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const rows: { label: string; score: number; max: number }[] = [
    { label: "Portfolio", score: bd.portfolio.score, max: bd.portfolio.max },
    { label: "Reviews", score: bd.reviews.score, max: bd.reviews.max },
    { label: "Profiel links", score: bd.links.score, max: bd.links.max },
    { label: "Recente activiteit", score: bd.recency.score, max: bd.recency.max },
  ];

  return (
    <div className="bg-white rounded-3xl border border-[#E9E7F0] p-5">
      <div className="flex items-center gap-5">

        {/* Donut + label */}
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <div className="relative w-16 h-16">
            <svg width="64" height="64" viewBox="0 0 80 80" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="40" cy="40" r={R} fill="none" stroke="#E9E7F0" strokeWidth="8" />
              <circle
                cx="40" cy="40" r={R} fill="none"
                stroke="#7F77DD" strokeWidth="8"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.6s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-base font-bold text-gray-900">{bd.total}</span>
            </div>
          </div>

          {/* Label + info button */}
          <div className="relative flex items-center gap-1" ref={tooltipRef}>
            <span className="text-xs text-gray-400">Profielscore</span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="text-green-500 hover:text-green-600 transition-colors leading-none"
              aria-label="Tips om je score te verbeteren"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            </button>

            {open && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-30 w-72 bg-white border border-[#E9E7F0] rounded-2xl p-4">
                <p className="text-sm font-semibold text-gray-900 mb-3">Verbeter je score</p>
                {tips.length === 0 ? (
                  <p className="text-xs text-gray-400">Je profiel is volledig ingevuld!</p>
                ) : (
                  <div className="space-y-2">
                    {tips.map((tip, i) => (
                      <div key={i} className="flex items-start justify-between gap-3">
                        <span className="text-xs text-gray-600 leading-relaxed">{tip.text}</span>
                        <span className="text-xs font-semibold text-[#7F77DD] bg-[#EEEDFE] px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                          +{tip.pts}pt
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Breakdown bars */}
        <div className="flex-1 space-y-2">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-32 shrink-0">{row.label}</span>
              <div className="flex-1 h-1.5 rounded-full bg-[#E9E7F0]">
                <div
                  className="h-1.5 rounded-full bg-[#7F77DD]"
                  style={{
                    width: row.max > 0 ? `${(row.score / row.max) * 100}%` : "0%",
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
              <span className="text-xs font-medium text-gray-700 w-12 text-right">
                {row.score}/{row.max}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
