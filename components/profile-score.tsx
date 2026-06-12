"use client";

import { useState, useRef, useEffect } from "react";
import type { Photographer } from "@/lib/types";
import { calcBreakdown, calcTips } from "@/lib/profile-score";

const CIRCUMFERENCE = 2 * Math.PI * 48;

export default function ProfileScore({ photographer }: { photographer: Photographer }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const bd = calcBreakdown(photographer);
  const tips = calcTips(bd);
  const offset = CIRCUMFERENCE - (bd.total / 100) * CIRCUMFERENCE;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
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
    <div className="bg-white rounded-3xl border border-[#E9E7F0] p-6">
      <div className="flex items-start justify-between gap-4">

        {/* Donut */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-28 h-28">
            <svg width="112" height="112" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="60" cy="60" r="48" fill="none" stroke="#E9E7F0" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="48" fill="none"
                stroke="#7F77DD" strokeWidth="10"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.6s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{bd.total}</span>
            </div>
          </div>
          <span className="text-xs text-gray-400">Profielscore</span>
        </div>

        {/* Breakdown */}
        <div className="flex-1 space-y-3 pt-1">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-32 shrink-0">{row.label}</span>
              <div className="flex-1 h-1.5 rounded-full bg-[#E9E7F0]">
                <div
                  className="h-1.5 rounded-full bg-[#7F77DD]"
                  style={{ width: `${(row.score / row.max) * 100}%`, transition: "width 0.6s ease" }}
                />
              </div>
              <span className="text-xs font-medium text-gray-700 w-12 text-right">
                {row.score}/{row.max}
              </span>
            </div>
          ))}
        </div>

        {/* Info button */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-gray-400 hover:text-gray-600 transition-colors mt-1"
            aria-label="Tips om je score te verbeteren"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </button>

          {open && (
            <div className="absolute right-0 top-7 z-20 w-72 bg-white border border-[#E9E7F0] rounded-2xl shadow-sm p-4">
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
    </div>
  );
}
