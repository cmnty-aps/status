import { ShieldCheck, Globe, Percent, Network } from "lucide-react";
import { ApiStatusResponse } from "../types";

interface AnalyticsPanelProps {
  data: ApiStatusResponse | null;
}

export default function AnalyticsPanel({ data }: AnalyticsPanelProps) {
  const analytics = data?.result?.realtime_analytics_100req;

  if (!analytics) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center text-slate-400 text-xs italic subtle-shadow">
        No analytical indicators are available
      </div>
    );
  }

  const successRate = analytics.success_rate_percentage;
  const sampleSize = analytics.sample_size;

  // Modern soft status color
  const gaugeColor =
    successRate >= 95
      ? "stroke-slate-900 text-slate-900"
      : successRate >= 80
      ? "stroke-amber-600 text-amber-600"
      : "stroke-rose-600 text-rose-600";

  // HTTP Method data
  const methods = analytics.http_methods || { GET: 0, POST: 0, PUT: 0, DELETE: 0, OTHER: 0 };
  const totalMethods = Object.values(methods).reduce((a, b) => a + b, 0) || 1;

  // Status code data
  const statusCodes = analytics.status_codes || { "1xx": 0, "2xx": 0, "3xx": 0, "4xx": 0, "5xx": 0 };
  const totalStatusCodes = Object.values(statusCodes).reduce((a, b) => a + b, 0) || 1;

  // Helper for country names or display fallback
  const getCountryName = (code: string) => {
    const names: Record<string, string> = {
      ID: "Indonesia",
      US: "United States",
      FR: "France",
      DE: "Germany",
      SG: "Singapore",
      GB: "United Kingdom",
      JP: "Japan",
      CN: "China",
      NL: "Netherlands",
      AU: "Australia",
    };
    return names[code.toUpperCase()] || code;
  };

  const getCountryEmoji = (code: string) => {
    const lookup: Record<string, string> = {
      ID: "🇮🇩",
      US: "🇺🇸",
      FR: "🇫🇷",
      DE: "🇩🇪",
      SG: "🇸🇬",
      GB: "🇬🇧",
      JP: "🇯🇵",
      CN: "🇨🇳",
      NL: "🇳🇱",
      AU: "🇦🇺",
    };
    return lookup[code.toUpperCase()] || "🌐";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* SUCCESS RATE */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 subtle-shadow flex flex-col justify-between">
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Percent className="w-3.5 h-3.5 text-slate-500" /> Success Rate
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Sample size: last {sampleSize} requests</p>
        </div>

        {/* Circular Gauge */}
        <div className="relative flex items-center justify-center my-8">
          <svg className="w-28 h-28 transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="56"
              cy="56"
              r="48"
              className="stroke-slate-100"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Progress Circle */}
            <circle
              cx="56"
              cy="56"
              r="48"
              className={`transition-all duration-1000 ease-out ${gaugeColor}`}
              strokeWidth="6"
              strokeDasharray={2 * Math.PI * 48}
              strokeDashoffset={2 * Math.PI * 48 * (1 - successRate / 100)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-3xl font-extrabold text-slate-950 font-display tracking-tight">{successRate}%</span>
            <span className="block text-[8px] uppercase font-mono tracking-wider text-slate-400 mt-1">
              Passed
            </span>
          </div>
        </div>

        {/* Info card */}
        <div className="w-full bg-slate-50 rounded-xl p-3 border border-slate-100/60 text-center text-xs">
          <span className="text-slate-800 block font-medium">
            {successRate >= 95 ? (
              <span className="text-slate-900 font-semibold flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                Operational Quality
              </span>
            ) : successRate >= 85 ? (
              <span className="text-amber-800 font-semibold">Suboptimal Rate</span>
            ) : (
              <span className="text-rose-800 font-semibold">Critical Failures</span>
            )}
          </span>
          <p className="text-slate-400 text-[10px] mt-1 font-mono">
            {100 - successRate}% failing threshold
          </p>
        </div>
      </div>

      {/* HTTP METHOD DISTRIBUTION */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 subtle-shadow flex flex-col justify-between">
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" /> Method Spreads
          </h2>
          <p className="text-[11px] text-slate-400">Proportional routing activity</p>
        </div>

        <div className="space-y-3.5 my-4">
          {Object.entries(methods).map(([method, count]) => {
            const percentage = Math.round((count / totalMethods) * 100);
            let barColor = "bg-slate-900";
            let tagStyle = "text-slate-700 bg-slate-50 border-slate-100";

            if (method === "POST") {
              barColor = "bg-slate-600";
              tagStyle = "text-slate-600 bg-slate-50/50 border-slate-100/60";
            } else if (method === "PUT") {
              barColor = "bg-slate-500";
              tagStyle = "text-slate-500 bg-slate-50/30 border-slate-100/40";
            } else if (method === "DELETE") {
              barColor = "bg-slate-400";
              tagStyle = "text-slate-400 bg-slate-50/20 border-slate-100/30";
            } else if (method === "OTHER") {
              barColor = "bg-slate-300";
              tagStyle = "text-slate-400 bg-slate-50/10 border-slate-100/20";
            }

            return (
              <div key={method} className="group">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className={`px-1.5 py-0.5 font-bold font-mono text-[9px] rounded border ${tagStyle}`}>
                    {method}
                  </span>
                  <span className="font-mono text-slate-500 text-[11px]">
                    {count} <span className="text-slate-300">/</span> {percentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-100/75 rounded-full h-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-slate-50 pt-3 text-[10px] text-slate-400 text-center font-mono">
          Top method: <span className="text-slate-700 font-bold">
            {Object.entries(methods).sort((a, b) => b[1] - a[1])[0]?.[0]}
          </span>
        </div>
      </div>

      {/* HTTP STATUS CODES & LOCATIONS */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 subtle-shadow flex flex-col justify-between">
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-1">
            <Network className="w-3.5 h-3.5 text-slate-500" /> Response Codes
          </h2>
          <p className="text-[11px] text-slate-400">Class breakdowns (2xx/3xx/4xx)</p>
        </div>

        <div className="space-y-3.5 my-4">
          {Object.entries(statusCodes).map(([code, count]) => {
            const percentage = Math.round((count / totalStatusCodes) * 100);
            let barColor = "bg-slate-900";
            let labelColor = "text-slate-800";

            if (code.startsWith("4")) {
              barColor = "bg-amber-500";
              labelColor = "text-amber-600";
            } else if (code.startsWith("5")) {
              barColor = "bg-rose-500";
              labelColor = "text-rose-600";
            } else if (code.startsWith("3")) {
              barColor = "bg-slate-400";
              labelColor = "text-slate-500";
            } else if (code.startsWith("1")) {
              barColor = "bg-slate-300";
              labelColor = "text-slate-400";
            }

            return (
              <div key={code} className="flex items-center gap-3">
                <span className={`w-8 font-mono text-xs font-bold ${labelColor}`}>
                  {code}
                </span>
                <div className="flex-1 bg-slate-100/75 rounded-full h-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-slate-500 w-8 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>

        {/* Geographic Origin Indicators */}
        <div className="border-t border-slate-50 pt-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-2">
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-slate-400" />
              <span>Origins ({analytics.active_countries_count} regions)</span>
            </span>
            <span className="text-slate-500 font-semibold">{analytics.active_unique_ips_count} active IPs</span>
          </div>
          <div className="flex flex-wrap gap-1 max-h-[50px] overflow-y-auto scrollbar-thin">
            {analytics.active_countries_list?.map((code) => (
              <span
                key={code}
                className="bg-slate-50 hover:bg-slate-100 text-[10px] font-medium text-slate-600 px-2 py-0.5 rounded-lg border border-slate-100 flex items-center gap-1 cursor-default transition-colors"
                title={`${getCountryName(code)}`}
              >
                <span>{getCountryEmoji(code)}</span>
                <span className="font-mono text-[9px] text-slate-500 uppercase">{code}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
