"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface MonthData {
  month: string;
  label: string;
  impression: number;
  profile_click: number;
  website_click: number;
  instagram_click: number;
  linkedin_click: number;
  contact_request: number;
}

interface BenchmarkMonth {
  month: string;
  impression: number;
  profile_click: number;
  website_click: number;
  instagram_click: number;
  linkedin_click: number;
  contact_request: number;
}

interface BenchmarkLine {
  label: string;
  color: string;
  data: BenchmarkMonth[];
}

const GROUPS = [
  {
    label: "Impressies",
    channels: [
      { key: "impression", label: "Impressies", color: "#6366f1" },
    ],
  },
  {
    label: "Clicks",
    channels: [
      { key: "profile_click",   label: "Profielclicks", color: "#0ea5e9" },
      { key: "website_click",   label: "Website",       color: "#f59e0b" },
      { key: "instagram_click", label: "Instagram",     color: "#ec4899" },
      { key: "linkedin_click",  label: "LinkedIn",      color: "#3b82f6" },
    ],
  },
  {
    label: "Aanvragen ontvangen",
    channels: [
      { key: "contact_request", label: "Aanvragen", color: "#10b981" },
    ],
  },
];

const ALL_CHANNELS = GROUPS.flatMap((g) => g.channels);

function getLast12Months(): { month: string; label: string }[] {
  const result = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("nl-NL", { month: "short", year: "2-digit" });
    result.push({ month, label });
  }
  return result;
}

function LineChart({
  data,
  months,
  channels,
  benchmarks = [],
}: {
  data: MonthData[];
  months: { month: string; label: string }[];
  channels: { key: string; label: string; color: string }[];
  benchmarks?: BenchmarkLine[];
}) {
  const W = 600;
  const H = 160;
  const PAD = { top: 16, right: 16, bottom: 36, left: 36 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const ownValues = data.flatMap((d) => channels.map((ch) => (d as any)[ch.key] as number));
  const benchmarkValues = benchmarks.flatMap((b) =>
    b.data.flatMap((d) => channels.map((ch) => (d as any)[ch.key] as number))
  );
  const maxVal = Math.max(...ownValues, ...benchmarkValues, 1);

  const x = (i: number) => PAD.left + (i / (months.length - 1)) * chartW;
  const y = (v: number) => PAD.top + chartH - (v / maxVal) * chartH;

  const hasAnyData = ownValues.some((v) => v > 0);

  if (!hasAnyData && benchmarks.length === 0) {
    return (
      <div className="h-32 flex flex-col items-center justify-center text-center">
        <p className="text-sm text-gray-400">Nog geen data</p>
      </div>
    );
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {[0, 0.5, 1].map((t) => (
        <g key={t}>
          <line
            x1={PAD.left} x2={W - PAD.right}
            y1={PAD.top + chartH * (1 - t)} y2={PAD.top + chartH * (1 - t)}
            stroke="#E9E7F0" strokeWidth="1"
          />
          <text x={PAD.left - 5} y={PAD.top + chartH * (1 - t) + 4} textAnchor="end" fontSize="10" fill="#9ca3af">
            {Math.round(maxVal * t)}
          </text>
        </g>
      ))}

      {/* Benchmark stippellijnen */}
      {benchmarks.map((bm) =>
        channels.map((ch) => {
          const points = months
            .map((m, i) => {
              const d = bm.data.find((d) => d.month === m.month);
              return `${x(i)},${y((d as any)?.[ch.key] || 0)}`;
            })
            .join(" ");
          return (
            <polyline
              key={`${bm.label}-${ch.key}`}
              points={points}
              fill="none"
              stroke={bm.color}
              strokeWidth="2"
              strokeDasharray="6,5"
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity="0.7"
            />
          );
        })
      )}

      {/* Eigen data lijnen */}
      {channels.map((ch) => {
        const points = months
          .map((m, i) => {
            const d = data.find((d) => d.month === m.month);
            return `${x(i)},${y((d as any)?.[ch.key] || 0)}`;
          })
          .join(" ");

        return (
          <g key={ch.key}>
            <polyline points={points} fill="none" stroke={ch.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            {months.map((m, i) => {
              const d = data.find((d) => d.month === m.month);
              const val = (d as any)?.[ch.key] || 0;
              return val > 0 ? <circle key={i} cx={x(i)} cy={y(val)} r="3.5" fill={ch.color} /> : null;
            })}
          </g>
        );
      })}

      {months.map((m, i) =>
        i % 2 === 0 ? (
          <text key={m.month} x={x(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="#9ca3af">
            {m.label}
          </text>
        ) : null
      )}
    </svg>
  );
}

type GeoEntry = { label: string; count: number };

export default function StatsDashboard({
  photographerId,
  membershipTier,
}: {
  photographerId: string;
  membershipTier: string;
}) {
  const [data, setData] = useState<MonthData[]>([]);
  const [topCities, setTopCities] = useState<GeoEntry[]>([]);
  const [topCountries, setTopCountries] = useState<GeoEntry[]>([]);
  const [benchmarks, setBenchmarks] = useState<{ plus: BenchmarkMonth[]; premium: BenchmarkMonth[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const months = getLast12Months();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const since = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString();

      const [{ data: events }, benchmarkRes] = await Promise.all([
        supabase
          .from("photographer_analytics")
          .select("event_type, created_at, city, country")
          .eq("photographer_id", photographerId)
          .gte("created_at", since),
        fetch("/api/tier-benchmarks").then((r) => r.json()).catch(() => null),
      ]);

      const byMonth: Record<string, MonthData> = {};
      months.forEach(({ month, label }) => {
        byMonth[month] = { month, label, impression: 0, profile_click: 0, website_click: 0, instagram_click: 0, linkedin_click: 0, contact_request: 0 };
      });

      const cityCount: Record<string, number> = {};
      const countryCount: Record<string, number> = {};

      (events || []).forEach((e) => {
        const d = new Date(e.created_at);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (byMonth[key] && e.event_type in byMonth[key]) {
          (byMonth[key] as any)[e.event_type]++;
        }
        if (e.event_type === "impression") {
          if (e.city) cityCount[e.city] = (cityCount[e.city] || 0) + 1;
          if (e.country) countryCount[e.country] = (countryCount[e.country] || 0) + 1;
        }
      });

      setData(Object.values(byMonth));
      setTopCities(
        Object.entries(cityCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([label, count]) => ({ label, count }))
      );
      setTopCountries(
        Object.entries(countryCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([label, count]) => ({ label, count }))
      );
      if (benchmarkRes) setBenchmarks(benchmarkRes);
      setLoading(false);
    }
    load();
  }, [photographerId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return <div className="bg-white rounded-3xl border border-[#E9E7F0] p-8 text-center text-sm text-gray-400">Statistieken laden...</div>;
  }

  const hasData = data.some((d) => ALL_CHANNELS.some((ch) => (d as any)[ch.key] > 0));

  // Bepaal welke benchmarklijnen zichtbaar zijn op basis van tier
  // Premium eerst (groen), Plus daarna (paars)
  const visibleBenchmarks: BenchmarkLine[] = [];
  if (membershipTier === "free" || !membershipTier) {
    if (benchmarks?.premium) visibleBenchmarks.push({ label: "Gemiddelde Premium", color: "#86EFAC", data: benchmarks.premium });
    if (benchmarks?.plus)    visibleBenchmarks.push({ label: "Gemiddelde Plus",    color: "#DDD6FE", data: benchmarks.plus });
  } else if (membershipTier === "plus") {
    if (benchmarks?.premium) visibleBenchmarks.push({ label: "Gemiddelde Premium", color: "#86EFAC", data: benchmarks.premium });
  }

  return (
    <div className="space-y-5">
      {/* Totaalkaartjes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {GROUPS.map((group) => {
          const total = group.channels.reduce(
            (sum, ch) => sum + data.reduce((s, d) => s + ((d as any)[ch.key] || 0), 0),
            0
          );
          return (
            <div key={group.label} className="bg-white rounded-2xl border border-[#E9E7F0] p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: group.channels[0].color }} />
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{group.label}</p>
              </div>
              <p className="text-3xl font-black text-gray-900">{total}</p>
              {group.channels.length > 1 && (
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                  {group.channels.map((ch) => {
                    const chTotal = data.reduce((s, d) => s + ((d as any)[ch.key] || 0), 0);
                    return (
                      <span key={ch.key} className="text-xs text-gray-400">
                        {ch.label}: <span className="font-semibold text-gray-600">{chTotal}</span>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Drie losse grafieken */}
      {GROUPS.map((group) => (
        <div key={group.label}>
          <div className="bg-white rounded-3xl border border-[#E9E7F0] p-6">
            <div className="mb-4">
              {/* Grafiek titel + kanaallegenda */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: group.channels[0].color }} />
                <h3 className="text-sm font-bold text-gray-900">{group.label}</h3>
                {group.channels.length > 1 && (
                  <div className="flex gap-3 ml-2">
                    {group.channels.map((ch) => (
                      <span key={ch.key} className="flex items-center gap-1 text-xs text-gray-400">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ch.color }} />
                        {ch.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {/* Benchmark legenda — verticaal gestapeld */}
              {visibleBenchmarks.length > 0 && (
                <div className="flex flex-col gap-1 mt-2 ml-[18px]">
                  {visibleBenchmarks.map((bm) => (
                    <span key={bm.label} className="flex items-center gap-2 text-xs text-gray-400">
                      <svg width="20" height="8" viewBox="0 0 20 8" className="shrink-0">
                        <line x1="0" y1="4" x2="20" y2="4" stroke={bm.color} strokeWidth="2" strokeDasharray="5,4" />
                      </svg>
                      {bm.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <LineChart
              data={data}
              months={months}
              channels={group.channels}
              benchmarks={visibleBenchmarks}
            />
          </div>

          {/* Geo — direct onder de Impressies grafiek */}
          {group.label === "Impressies" && (topCities.length > 0 || topCountries.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {topCities.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#E9E7F0] p-5">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Bezoekers per stad</h3>
                  <div className="space-y-2.5">
                    {topCities.map(({ label, count }) => {
                      const max = topCities[0].count;
                      return (
                        <div key={label} className="flex items-center gap-3">
                          <span className="text-sm text-gray-700 w-28 shrink-0 truncate">{label}</span>
                          <div className="flex-1 h-2 bg-[#E9E7F0] rounded-full overflow-hidden">
                            <div className="h-full bg-[#6366f1] rounded-full" style={{ width: `${(count / max) * 100}%` }} />
                          </div>
                          <span className="text-xs font-mono text-gray-500 w-6 text-right shrink-0">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {topCountries.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#E9E7F0] p-5">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Bezoekers per land</h3>
                  <div className="space-y-2.5">
                    {topCountries.map(({ label, count }) => {
                      const max = topCountries[0].count;
                      return (
                        <div key={label} className="flex items-center gap-3">
                          <span className="text-sm text-gray-700 w-28 shrink-0 truncate">{label}</span>
                          <div className="flex-1 h-2 bg-[#E9E7F0] rounded-full overflow-hidden">
                            <div className="h-full bg-[#10b981] rounded-full" style={{ width: `${(count / max) * 100}%` }} />
                          </div>
                          <span className="text-xs font-mono text-gray-500 w-6 text-right shrink-0">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Maand tabel */}
      {hasData && (
        <div className="bg-white rounded-3xl border border-[#E9E7F0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E9E7F0]">
            <h3 className="text-sm font-bold text-gray-900">Per maand</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FCFAFF] border-b border-[#E9E7F0]">
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase">Maand</th>
                  {ALL_CHANNELS.map((ch) => (
                    <th key={ch.key} className="text-center px-3 py-3 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">
                      {ch.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...data].reverse().map((d) => (
                  <tr key={d.month} className="border-b border-[#E9E7F0] hover:bg-[#FCFAFF]">
                    <td className="px-5 py-3 text-gray-700 font-medium capitalize">{d.label}</td>
                    {ALL_CHANNELS.map((ch) => (
                      <td key={ch.key} className="px-3 py-3 text-center font-mono text-gray-600">
                        {(d as any)[ch.key] || 0}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
