import { useState, useEffect } from "react";
import { Users, Compass, Clock } from "lucide-react";
import { ApiStatusResponse } from "../types";

interface VisitorsListProps {
  data: ApiStatusResponse | null;
}

export default function VisitorsList({ data }: VisitorsListProps) {
  const [now, setNow] = useState(new Date());

  const visitorNow = data?.result?.visitor_now;
  const onlineCount = visitorNow?.online_count ?? 0;
  const recentVisitors = visitorNow?.recent_unique_visitors || [];

  // Periodically update the "now" state to keep relative timers fresh
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // IP masking helper
  const maskIp = (ip: string) => {
    const parts = ip.split(".");
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.***.***`;
    }
    const ipv6Parts = ip.split(":");
    if (ipv6Parts.length > 2) {
      return `${ipv6Parts[0]}:${ipv6Parts[1]}:****:****`;
    }
    return ip;
  };

  // Human relative time helper
  const getRelativeTime = (isoString: string) => {
    try {
      const lastSeenDate = new Date(isoString);
      const diffMs = now.getTime() - lastSeenDate.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHrs = Math.floor(diffMins / 60);

      if (diffSecs < 10) return "Just now";
      if (diffSecs < 60) return `${diffSecs}s ago`;
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHrs < 24) return `${diffHrs}h ago`;
      return lastSeenDate.toLocaleDateString();
    } catch (e) {
      return "N/A";
    }
  };

  const getCountryEmoji = (code: string) => {
    const codeUpper = code.toUpperCase();
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
    return lookup[codeUpper] || "🌐";
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 subtle-shadow flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-slate-500" /> Active Session Logs
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Live routing telemetry
            </p>
          </div>

          {/* Active online pill */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1 flex items-center gap-2 text-[10px] font-bold text-emerald-700 font-mono tracking-wide">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{onlineCount} ACTIVE</span>
          </div>
        </div>

        {/* List of recent visitors */}
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
          {recentVisitors.map((visitor, idx) => {
            const countryEmoji = getCountryEmoji(visitor.country);
            const relativeTime = getRelativeTime(visitor.last_seen);

            return (
              <div
                key={idx}
                className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100/60 rounded-xl p-3.5 transition-colors flex flex-col gap-2.5 text-xs"
              >
                {/* Top: IP & relative time */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base" title={visitor.country}>
                      {countryEmoji}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-800 tracking-tight text-[11px]">
                        {maskIp(visitor.ip)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                    <Clock className="w-3 h-3 text-slate-300" />
                    <span>{relativeTime}</span>
                  </div>
                </div>

                {/* Bottom: Target URL Path */}
                <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100/40">
                  <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[10px] truncate max-w-[80%]" title={visitor.url}>
                    <Compass className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{visitor.url}</span>
                  </div>

                  <span className="text-[9px] font-bold text-slate-400 font-mono uppercase bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/40">
                    {visitor.country}
                  </span>
                </div>
              </div>
            );
          })}

          {recentVisitors.length === 0 && (
            <div className="text-center py-10 text-slate-400 italic text-xs">
              No active user sessions reported
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
