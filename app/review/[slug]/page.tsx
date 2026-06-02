import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ReviewForm from "./review-form";
import Image from "next/image";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ReviewPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: photographer } = await supabase
    .from("photographers")
    .select("id, slug, business_name, contact_name, avatar_url, city")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!photographer) notFound();

  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      {/* Nav */}
      <div className="bg-[#FCFAFF] border-b border-[#E9E7F0]">
        <div className="px-6 py-3.5 max-w-xl mx-auto">
          <Link href="/">
            <Image src="/logo.png" alt="LensLab" width={100} height={28} className="h-7 w-auto" />
          </Link>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 py-12">
        {/* Fotograaf info */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-[#E9E7F0] mx-auto mb-4">
            {photographer.avatar_url ? (
              <Image src={photographer.avatar_url} alt={photographer.business_name} width={64} height={64} className="object-cover w-full h-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-500">
                {photographer.business_name[0]}
              </div>
            )}
          </div>
          <p className="text-sm text-gray-400 mb-1">Schrijf een review voor</p>
          <h1 className="text-2xl font-black text-gray-900">{photographer.business_name}</h1>
          {photographer.city && <p className="text-sm text-gray-400 mt-1">{photographer.city}</p>}
        </div>

        <ReviewForm photographerId={photographer.id} photographerName={photographer.business_name} />
      </div>
    </div>
  );
}
