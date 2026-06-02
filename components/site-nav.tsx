import Link from "next/link";
import TrustpilotBar from "@/components/trustpilot-bar";

export default function SiteNav() {
  return (
    <div className="sticky top-0 z-50">
      {/* Nav */}
      <div className="bg-[#FCFAFF] border-b border-[#E9E7F0]">
        <nav className="px-6 py-3.5 flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7">
              <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
                <path d="M16 2 L30 26 L2 26 Z" fill="#111" />
                <path d="M16 2 L30 26" stroke="#E55A2B" strokeWidth="3" />
              </svg>
            </div>
            <span className="font-bold text-base tracking-tight text-gray-900 uppercase">Lenslab</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/beeldmakers" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Beeldmakers
            </Link>
            <Link href="/regio" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Regio&apos;s
            </Link>
            <Link href="/types" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Specialiteiten
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Login</Link>
            <Link href="/aanmelden" className="text-sm bg-gray-900 text-white px-5 py-2 rounded-full hover:bg-gray-700 transition-colors font-medium">
              Get Started
            </Link>
          </div>
        </nav>
      </div>

      {/* Trustpilot bar — onder de nav, ook sticky */}
      <TrustpilotBar />
    </div>
  );
}
