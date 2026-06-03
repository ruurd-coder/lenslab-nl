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
}: {
  data: MonthData[];
  months: { month: string; label: string }[];
  channels: { key: string; label: string; color: string }[];
}) {
  const W = 600;
  const H = 160;
  const PAD = { top: 16, right: 16, bottom: 36, left: 36 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const allValues = data.flatMap((d) => channels.map((ch) => (d as any)[ch.key] as number));
  const maxVal = Math.max(...allValues, 1);

  const x = (i: number) => PAD.left + (i / (months.length - 1)) * chartW;
  const y = (v: number) => PAD.top + chartH - (v / maxVal) * chartH;

  const hasAnyData = allValues.some((v) => v > 0);

  if (!hasAnyData) {
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

export default function StatsDashboard({ photographerId }: { photographerId: string }) {
  const [data, setData] = useState<MonthData[]>([]);
  const [loading, setLoading] = useState(true);
  const months = getLast12Months();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: events } = await supabase
        .from("photographer_analytics")
        .select("event_type, created_at")
        .eq("photographer_id", photographerId)
        .gte("created_at", new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString());

      const byMonth: Record<string, MonthData> = {};
      months.forEach(({ month, label }) => {
        byMonth[month] = { month, label, impression: 0, profile_click: 0, website_click: 0, instagram_click: 0, linkedin_click: 0, contact_request: 0 };
      });

      (events || []).forEach((e) => {
        const d = new Date(e.created_at);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (byMonth[key] && e.event_type in byMonth[key]) {
          (byMonth[key] as any)[e.event_type]++;
        }
      });

      setData(Object.values(byMonth));
      setLoading(false);
    }
    load();
  }, [photographerId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return <div className="bg-white rounded-3xl border border-[#E9E7F0] p-8 text-center text-sm text-gray-400">Statistieken laden...</div>;
  }

  const hasData = data.some((d) => ALL_CHANNELS.some((ch) => (d as any)[ch.key] > 0));

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
        <div key={group.label} className="bg-white rounded-3xl border border-[#E9E7F0] p-6">
          <div className="flex items-center gap-3 mb-4">
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
          <LineChart data={data} months={months} channels={group.channels} />
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
