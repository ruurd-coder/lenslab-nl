import Link from "next/link";

// Trustpilot groen: #00B67A
export default function TrustpilotBar() {
  return (
    <Link
      href="https://nl.trustpilot.com/review/lenslab.nl"
      target="_blank"
      rel="noopener noreferrer"
      className="bg-[#FCFAFF] border-b border-[#E9E7F0] py-2.5 flex items-center justify-center gap-2 text-sm hover:bg-[#F0EEF8] transition-colors">
      {/* Trustpilot ster-icoon */}
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="#00B67A">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>

      <span className="font-semibold text-gray-900">Trustpilot</span>
      <span className="text-gray-500">Our customers say it&apos;s</span>
      <span className="font-bold text-gray-900">Excellent</span>

      {/* 4 volle sterren */}
      <div className="flex items-center gap-0.5 ml-1">
        {[1, 2, 3, 4].map((i) => (
          <svg key={i} className="w-4 h-4" viewBox="0 0 20 20" fill="#00B67A">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}

        {/* Halve ster via clip-path */}
        <svg className="w-4 h-4" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="halfGreen">
              <stop offset="50%" stopColor="#00B67A" />
              <stop offset="50%" stopColor="#D1D5DB" />
            </linearGradient>
          </defs>
          <path
            fill="url(#halfGreen)"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      </div>
    </Link>
  );
}
