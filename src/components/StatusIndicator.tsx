import { Activity, CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";
import { ApiStatusResponse } from "../types";

interface StatusIndicatorProps {
  data: ApiStatusResponse | null;
  loading: boolean;
  onRefresh: () => void;
  refreshInterval: number;
  isUsingMockData: boolean;
  countdown: number;
}

export default function StatusIndicator({
  data,
  loading,
  onRefresh,
  refreshInterval,
  isUsingMockData,
  countdown,
}: StatusIndicatorProps) {
  const isOnline = data ? data.status : false;
  const lastUpdated = data ? new Date(data.timestamp.utc).toLocaleTimeString() : "N/A";
  const uptimeHuman = data?.result?.uptime?.human || "N/A";
  const ping = data?.result?.ping || "N/A";
  const responseTime = data?.responseTimeMs || 0;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 subtle-shadow relative overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Status indicator heading */}
        <div className="flex items-start sm:items-center gap-4">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all ${
              isOnline
                ? "bg-emerald-50/60 text-emerald-600 border-emerald-100/80"
                : "bg-rose-50/60 text-rose-600 border-rose-100/80"
            }`}
          >
            {isOnline ? (
              <CheckCircle2 className="w-5.5 h-5.5" />
            ) : (
              <XCircle className="w-5.5 h-5.5" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 font-display tracking-tight">
                CMNTY API Environment
              </h1>
              {isUsingMockData && (
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded-lg border border-amber-200/60">
                  <AlertTriangle className="w-3 h-3 text-amber-500" /> SIMULATED
                </span>
              )}
            </div>
            <p className="text-slate-400 text-xs mt-0.5">
              {isOnline ? "All critical platform routes are running and healthy." : "Routing service connection is disrupted"}
            </p>
          </div>
        </div>

        {/* Real-time configuration & stats */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Uptime Badge */}
          <div className="bg-slate-50 border border-slate-100/80 rounded-xl px-3 py-1.5 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <div>
              <div className="text-[8px] text-slate-400 uppercase font-mono tracking-wider leading-none">Uptime</div>
              <div className="text-[11px] font-bold text-slate-700 font-mono mt-0.5">
                {uptimeHuman}
              </div>
            </div>
          </div>

          {/* Response Latency Badge */}
          <div className="bg-slate-50 border border-slate-100/80 rounded-xl px-3 py-1.5 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-slate-400" />
            <div>
              <div className="text-[8px] text-slate-400 uppercase font-mono tracking-wider leading-none">Response</div>
              <div className="text-[11px] font-bold text-slate-700 font-mono mt-0.5">
                {responseTime} ms ({ping})
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
