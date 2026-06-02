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
    <div
      className="flex items-center gap-2 rounded-full pl-5 md:pl-7 pr-2 py-2 max-w-xl mx-auto"
      style={{ backgroundColor: "#EDEDF0" }}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") onSubmit(); }}
        placeholder={placeholder}
        className="flex-1 min-w-0 bg-transparent outline-none text-base md:text-lg py-3 placeholder:opacity-50"
        style={{ color: "#030005" }}
      />
      <button
        type="button"
        onClick={onSubmit}
        className="flex-shrink-0 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full transition-opacity hover:opacity-80"
        style={{ backgroundColor: "#000000" }}
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
