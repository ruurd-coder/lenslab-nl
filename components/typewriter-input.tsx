"use client";

import { useState, useEffect, useRef } from "react";

const TEXTS = [
  "Geef een categorie door",
  "Geef de locatie van je shoot door",
  "Zoek je een foto of videograaf",
  "Zoek op naam van jouw beeldmaker",
];

const TYPE_SPEED = 55;
const DELETE_SPEED = 30;
const PAUSE_AFTER_TYPE = 1800;
const PAUSE_AFTER_DELETE = 400;

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}

export default function TypewriterInput({ value, onChange, onSubmit }: Props) {
  const [placeholder, setPlaceholder] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const currentText = TEXTS[textIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typen
        if (charIndex < currentText.length) {
          setPlaceholder(currentText.slice(0, charIndex + 1));
          setCharIndex((c) => c + 1);
        } else {
          // Volledig getypt — pauzeer dan verwijder
          setTimeout(() => setIsDeleting(true), PAUSE_AFTER_TYPE);
        }
      } else {
        // Verwijderen
        if (charIndex > 0) {
          setPlaceholder(currentText.slice(0, charIndex - 1));
          setCharIndex((c) => c - 1);
        } else {
          // Volledig verwijderd — ga naar volgende tekst
          setIsDeleting(false);
          setTextIndex((i) => (i + 1) % TEXTS.length);
          setTimeout(() => {}, PAUSE_AFTER_DELETE);
        }
      }
    }, isDeleting ? DELETE_SPEED : TYPE_SPEED);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex]);

  return (
    <div className="relative max-w-xl mx-auto">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") onSubmit(); }}
        placeholder={placeholder}
        className="w-full bg-white border border-[#E9E7F0] rounded-full px-6 py-4 pr-14 text-sm text-gray-700 shadow-sm focus:outline-none focus:border-gray-300 placeholder:text-gray-400 transition-all"
      />
      <button
        type="button"
        onClick={onSubmit}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
