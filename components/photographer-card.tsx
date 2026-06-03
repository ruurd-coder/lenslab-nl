"use client";

import Image from "next/image";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import type { Photographer } from "@/lib/types";

interface Props {
  photographer: Photographer;
  pageContext?: string;
}

export default function PhotographerCard({ photographer, pageContext }: Props) {
  const totalPhotos = Object.values(photographer.portfolio_by_category ?? {}).flat().length
    || photographer.portfolio_images.length;

  const handleClick = () => {
    trackEvent(photographer.id, "profile_click", pageContext);
  };

  const initials = photographer.contact_name
    ? photographer.contact_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : photographer.business_name[0].toUpperCase();

  return (
    <Link
      href={`/beeldmakers/${photographer.slug}`}
      onClick={handleClick}
      className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* Foto */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {photographer.hero_image_url ? (
          <Image
            src={photographer.hero_image_url}
            alt={photographer.business_name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#E9E7F0]">
            <span className="text-3xl text-gray-400">{photographer.business_name[0]}</span>
          </div>
        )}

        {/* Foto teller */}
        {totalPhotos > 0 && (
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-lg flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {totalPhotos}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base mb-1.5 leading-tight">
          {photographer.business_name}
        </h3>

        {photographer.bio && (
          <p className="text-sm text-gray-500 leading-relaxed mb-3 line-clamp-2">
            {photographer.bio}{" "}
            <span className="font-semibold text-gray-700">lees meer</span>
          </p>
        )}

        {/* Tags */}
        {photographer.specialties.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-400 mb-1.5">Te boeken voor:</p>
            <div className="flex flex-wrap gap-1.5">
              {photographer.specialties.slice(0, 3).map((s) => (
                <span key={s} className="text-xs bg-[#E9E7F0] text-gray-700 rounded-full px-2.5 py-0.5">
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </span>
              ))}
            </div>
          </div>
        )}

        <hr className="border-gray-100 mb-3" />

        {/* Contact persoon */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 shrink-0">
            {photographer.avatar_url ? (
              <Image src={photographer.avatar_url} alt={photographer.contact_name ?? ""} width={32} height={32} className="object-cover w-full h-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">{initials}</div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400 leading-none mb-0.5">Bekijk het profiel van:</p>
            <p className="text-xs font-semibold text-gray-900 truncate">{photographer.contact_name ?? photographer.business_name}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
