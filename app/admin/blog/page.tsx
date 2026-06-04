import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) redirect("/login");

  const service = await createServiceClient();
  const { data: posts } = await service
    .from("blog_posts")
    .select("id, title, slug, category, is_published, published_at, reading_time_minutes, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#FCFAFF]">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-700 mb-2 block">← Admin</Link>
            <h1 className="text-2xl font-black text-gray-900">Blog beheer</h1>
          </div>
          <Link href="/admin/blog/new" className="bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gray-700 transition-colors">
            + Nieuw artikel
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-[#E9E7F0] overflow-hidden">
          {!posts?.length ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-3xl mb-3">📝</p>
              <p className="font-medium">Nog geen artikelen</p>
              <Link href="/admin/blog/new" className="text-sm text-gray-500 underline mt-2 block">Schrijf je eerste artikel</Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FCFAFF] border-b border-[#E9E7F0] text-left">
                  <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Titel</th>
                  <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Categorie</th>
                  <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                  <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase">Datum</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-[#E9E7F0] hover:bg-[#FCFAFF]">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900 truncate max-w-xs">{post.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">/blog/{post.slug}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{post.category || "—"}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        post.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {post.is_published ? "Gepubliceerd" : "Concept"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">
                      {new Date(post.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link href={`/admin/blog/${post.id}`} className="text-sm text-gray-500 hover:text-gray-900 underline">
                        Bewerken
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
