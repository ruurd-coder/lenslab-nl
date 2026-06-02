import { MOCK_PHOTOGRAPHERS } from "@/lib/mock-data";
import SiteNav from "@/components/site-nav";
import BeeldmakersClient from "./beeldmakers-client";

export const metadata = {
  title: "Vind een fotograaf of videograaf in Nederland",
  description:
    "Bekijk portfolio's van fotografen en videografen door heel Nederland. Filter op regio, type en specialiteit.",
};

export default function BeeldmakersPage() {
  const photographers = MOCK_PHOTOGRAPHERS;

  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      <SiteNav />
      <BeeldmakersClient photographers={photographers} />
    </div>
  );
}
