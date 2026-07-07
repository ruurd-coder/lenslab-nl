"use client";

import { useEffect, useRef, useState } from "react";

function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return { open, setOpen, ref };
}

// The Creators/Companies audience-split dropdown pair, shared between the
// full SiteNav and pages (like the "/" choice landing page) that only want
// these two buttons without the rest of the site navigation.
export default function AudienceCtas() {
  const creators = useDropdown();
  const companies = useDropdown();

  return (
    <div className="flex items-center gap-2.5">
      {/* Creators */}
      <div ref={creators.ref} className="relative">
        <button
          onClick={() => { const next = !creators.open; creators.setOpen(next); companies.setOpen(false); }}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-full px-4 py-2 hover:border-gray-500 transition-colors"
        >
          Creators
          <svg className={`w-3.5 h-3.5 transition-transform ${creators.open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {creators.open && (
          <div className="absolute top-full right-0 mt-3 bg-white rounded-2xl shadow-xl border border-[#E9E7F0] p-4 w-[220px] z-50 flex flex-col gap-2.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">For photographers &amp; creators</p>
            <a href="https://www.lenslab.nl/login" onClick={() => creators.setOpen(false)} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Login</a>
            <a href="https://www.lenslab.nl/aanmelden" onClick={() => creators.setOpen(false)} className="text-sm bg-gray-900 text-white text-center px-4 py-2 rounded-full hover:bg-gray-700 transition-colors font-medium">Create a profile</a>
          </div>
        )}
      </div>

      {/* Companies */}
      <div ref={companies.ref} className="relative">
        <button
          onClick={() => { const next = !companies.open; companies.setOpen(next); creators.setOpen(false); }}
          className="flex items-center gap-1.5 text-sm font-medium text-white bg-gray-900 rounded-full px-4 py-2 hover:bg-gray-700 transition-colors"
        >
          Companies
          <svg className={`w-3.5 h-3.5 transition-transform ${companies.open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {companies.open && (
          <div className="absolute top-full right-0 mt-3 bg-white rounded-2xl shadow-xl border border-[#E9E7F0] p-4 w-[220px] z-50 flex flex-col gap-2.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">For brands &amp; teams</p>
            <a href="https://lenslab.tech/login" onClick={() => companies.setOpen(false)} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Login</a>
            <a href="https://lenslab.tech/signup" onClick={() => companies.setOpen(false)} className="text-sm bg-gray-900 text-white text-center px-4 py-2 rounded-full hover:bg-gray-700 transition-colors font-medium">Get started</a>
          </div>
        )}
      </div>
    </div>
  );
}
