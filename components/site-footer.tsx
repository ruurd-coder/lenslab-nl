import Link from "next/link";
import Image from "next/image";

const COLUMNS = [
  {
    heading: "Opdrachtgevers",
    links: [
      { label: "Zo werkt LensLab", href: "/hoe-het-werkt" },
      { label: "Meest gestelde vragen", href: "/faq" },
    ],
  },
  {
    heading: "Beeldmakers",
    links: [
      { label: "Aanmelden", href: "/aanmelden" },
      { label: "Log in", href: "/login" },
      { label: "Memberships", href: "/memberships" },
      { label: "Zo werkt LensLab", href: "/hoe-het-werkt-beeldmakers" },
    ],
  },
  {
    heading: "Over LensLab",
    links: [
      { label: "Over ons", href: "/over-ons" },
      { label: "Blog", href: "/blog" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer style={{ backgroundColor: "#FCFAFF" }}>
      <div className="border-t border-black/[0.08]">
        <div className="max-w-[1400px] mx-auto w-full px-5 md:px-12 py-16 flex flex-col md:flex-row justify-between gap-12">

          {/* Logo + tagline + socials */}
          <div>
            <Image src="/logo.png" alt="LensLab" width={140} height={32} className="h-9 w-auto" />
            <p className="mt-4 mb-6 text-[16.1px]" style={{ color: "#030005", opacity: 0.7 }}>
              Freeze time, frame life
            </p>
            <div className="flex items-center gap-4">
              {/* Instagram */}
              <a href="https://www.instagram.com/lenslab.nl" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:opacity-70 transition-opacity" style={{ color: "#030005" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/company/lenslab" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:opacity-70 transition-opacity" style={{ color: "#030005" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
                </svg>
              </a>
              {/* WhatsApp */}
              <a href="https://wa.me/31702042750" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:opacity-70 transition-opacity" style={{ color: "#030005" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.67c2.2 0 4.27.86 5.82 2.42a8.2 8.2 0 0 1 2.42 5.82c0 4.54-3.7 8.24-8.25 8.24-1.5 0-2.97-.4-4.26-1.17l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.24-8.24zm-4.5 4.4c-.18 0-.47.07-.72.34-.25.27-.95.93-.95 2.27 0 1.34.97 2.63 1.11 2.81.14.18 1.92 2.93 4.65 4 .65.28 1.16.45 1.56.58.65.21 1.25.18 1.72.11.52-.08 1.61-.66 1.84-1.29.23-.63.23-1.18.16-1.29-.07-.11-.25-.18-.52-.32-.27-.14-1.61-.79-1.86-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.6-1.5-1.87-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.44-.46-.61-.46h-.5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Nav kolommen */}
          <div className="flex flex-wrap gap-10 md:gap-16">
            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <p className="text-[13.8px] font-semibold tracking-widest uppercase mb-5" style={{ color: "#030005" }}>
                  {col.heading}
                </p>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[16.1px] hover:opacity-70 transition-opacity"
                        style={{ color: "#030005" }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright bar */}
        <div className="border-t border-black/[0.08]">
          <div className="max-w-[1400px] mx-auto w-full px-5 md:px-12 py-6 flex flex-col md:flex-row justify-between gap-4 text-[14px]" style={{ color: "#030005", opacity: 0.7 }}>
            <span>Copyright © 2025 LensLab. All rights reserved.</span>
            <div className="flex items-center gap-8">
              <span>Lange Kleiweg 62, 2288GK Rijswijk</span>
              <Link href="/algemene-voorwaarden" className="hover:opacity-100 transition-opacity">Algemene voorwaarden</Link>
              <Link href="/privacy" className="hover:opacity-100 transition-opacity">Privacy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
