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
      { key: "profile_click",   label: "Profielclicks",  color: "#0ea5e9" },
      { key: "website_click",   label: "Website",        color: "#f59e0b" },
      { key: "instagram_click", label: "Instagram",      color: "#ec4899" },
      { key: "linkedin_click",  label: "LinkedIn",       color: "#3b82f6" },
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

// Simpele SVG lijnengrafiek
function LineChart({ data, months, activeChannels, allChannels }: {
  data: MonthData[];
  months: { month: string; label: string }[];
  activeChannels: string[];
  allChannels: { key: string; label: string; color: string }[];
}) {
  const W = 600;
  const H = 200;
  const PAD = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const allValues = data.flatMap((d) =>
    activeChannels.map((ch) => (d as any)[ch] as number)
  );
  const maxVal = Math.max(...allValues, 1);

  const x = (i: number) => PAD.left + (i / (months.length - 1)) * chartW;
  const y = (v: number) => PAD.top + chartH - (v / maxVal) * chartH;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <g key={t}>
          <line x1={PAD.left} x2={W - PAD.right} y1={PAD.top + chartH * (1 - t)} y2={PAD.top + chartH * (1 - t)}
            stroke="#E9E7F0" strokeWidth="1" />
          <text x={PAD.left - 5} y={PAD.top + chartH * (1 - t) + 4} textAnchor="end"
            fontSize="10" fill="#9ca3af">
            {Math.round(maxVal * t)}
          </text>
        </g>
      ))}

      {/* Lijnen per kanaal */}
      {allChannels.filter((ch) => activeChannels.includes(ch.key)).map((ch) => {
        const points = months.map((m, i) => {
          const d = data.find((d) => d.month === m.month);
          return `${x(i)},${y((d as any)?.[ch.key] || 0)}`;
        }).join(" ");

        return (
          <g key={ch.key}>
            <polyline points={points} fill="none" stroke={ch.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            {months.map((m, i) => {
              const d = data.find((d) => d.month === m.month);
              const val = (d as any)?.[ch.key] || 0;
              return val > 0 ? (
                <circle key={i} cx={x(i)} cy={y(val)} r="3.5" fill={ch.color} />
              ) : null;
            })}
          </g>
        );
      })}

      {/* X-as labels */}
      {months.map((m, i) => (
        i % 2 === 0 ? (
          <text key={m.month} x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="#9ca3af">
            {m.label}
          </text>
        ) : null
      ))}
    </svg>
  );
}

export default function StatsDashboard({ photographerId }: { photographerId: string }) {
  const [data, setData] = useState<MonthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChannels, setActiveChannels] = useState(["impression", "profile_click", "contact_request"]);
  const months = getLast12Months();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: events } = await supabase
        .from("photographer_analytics")
        .select("event_type, created_at")
        .eq("photographer_id", photographerId)
        .gte("created_at", new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString());

      // Groepeer per maand
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

  const toggleChannel = (key: string) => {
    setActiveChannels((prev) =>
      prev.includes(key) ? (prev.length > 1 ? prev.filter((k) => k !== key) : prev) : [...prev, key]
    );
  };

  if (loading) {
    return <div className="bg-white rounded-3xl border border-[#E9E7F0] p-8 text-center text-sm text-gray-400">Statistieken laden...</div>;
  }

  const hasData = data.some((d) => ALL_CHANNELS.some((ch) => (d as any)[ch.key] > 0));

  return (
    <div className="space-y-5">
      {/* Totaalkaartjes per groep */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {GROUPS.map((group) => {
          const total = group.channels.reduce(
            (sum, ch) => sum + data.reduce((s, d) => s + ((d as any)[ch.key] || 0), 0),
            0
          );
          const mainChannel = group.channels[0];
          return (
            <div key={group.label} className="bg-white rounded-2xl border border-[#E9E7F0] p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: mainChannel.color }} />
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{group.label}</p>
              </div>
              <p className="text-3xl font-black text-gray-900 mb-1">{total}</p>
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

      {/* Grafiek */}
      <div className="bg-white rounded-3xl border border-[#E9E7F0] p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-gray-900">Afgelopen 12 maanden</h3>
        </div>

        {/* Kanaal toggles gegroepeerd */}
        <div className="flex flex-wrap gap-x-6 gap-y-3 mb-5">
          {GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-1.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{group.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {group.channels.map((ch) => (
                  <button
                    key={ch.key}
                    onClick={() => toggleChannel(ch.key)}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      activeChannels.includes(ch.key)
                        ? "border-transparent text-white"
                        : "border-[#E9E7F0] text-gray-400 bg-[#FCFAFF]"
                    }`}
                    style={activeChannels.includes(ch.key) ? { backgroundColor: ch.color, borderColor: ch.color } : {}}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeChannels.includes(ch.key) ? "white" : ch.color }} />
                    {ch.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {hasData ? (
          <LineChart data={data} months={months} activeChannels={activeChannels} allChannels={ALL_CHANNELS} />
        ) : (
          <div className="h-48 flex flex-col items-center justify-center text-center">
            <p className="text-3xl mb-3">📊</p>
            <p className="text-sm text-gray-500 font-medium">Nog geen data beschikbaar</p>
            <p className="text-xs text-gray-400 mt-1">Statistieken verschijnen zodra bezoekers jouw profiel bekijken.</p>
          </div>
        )}
      </div>

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
