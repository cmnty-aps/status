import { TrendingUp, Users, Radio, Zap } from "lucide-react";
import { ApiStatusResponse } from "../types";

interface MetricCardsProps {
  data: ApiStatusResponse | null;
}

export default function MetricCards({ data }: MetricCardsProps) {
  const counters = data?.result?.counters;
  const analytics = data?.result?.realtime_analytics_100req;

  const totalRequests = counters?.total_requests?.toLocaleString() ?? "N/A";
  const totalVisitors = counters?.total_visitors?.toLocaleString() ?? "N/A";
  const wsClients = counters?.connected_websocket_clients ?? 0;

  const avgLatency = analytics?.average_latency_ms ?? 0;
  const minLatency = analytics?.min_latency_ms ?? 0;
  const maxLatency = analytics?.max_latency_ms ?? 0;

  const stats = [
    {
      id: "total-requests",
      title: "Total Requests",
      value: totalRequests,
      icon: TrendingUp,
      accentColor: "border-slate-200/60 bg-slate-50 text-slate-800",
      iconColor: "text-slate-600",
      description: "Aggregated global hits",
    },
    {
      id: "total-visitors",
      title: "Total Visitors",
      value: totalVisitors,
      icon: Users,
      accentColor: "border-slate-200/60 bg-slate-50 text-slate-800",
      iconColor: "text-slate-600",
      description: "Unique audience count",
    },
    {
      id: "websocket-clients",
      title: "Live Sockets",
      value: wsClients,
      icon: Radio,
      accentColor: "border-emerald-100 bg-emerald-50/50 text-emerald-800",
      iconColor: "text-emerald-600",
      description: "Active server relays",
      badge: wsClients > 0 ? "ACTIVE" : "IDLE",
    },
    {
      id: "avg-latency",
      title: "Avg Latency (100 req)",
      value: `${avgLatency.toFixed(1)} ms`,
      icon: Zap,
      accentColor: "border-indigo-100 bg-indigo-50/50 text-indigo-800",
      iconColor: "text-indigo-600",
      description: `Min ${minLatency}ms | Max ${maxLatency}ms`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className="bg-white border border-slate-100 rounded-xl p-5 subtle-shadow card-hover flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-sans">
                  {item.title}
                </p>
                <p className="text-3xl font-extrabold text-slate-900 font-display mt-2 tracking-tight">
                  {item.value}
                </p>
              </div>

              <div className={`p-2.5 rounded-lg border ${item.accentColor}`}>
                <Icon className={`w-4 h-4 ${item.iconColor}`} />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between text-xs text-slate-400 border-t border-slate-50 pt-3">
              <span className="truncate font-sans text-slate-400">{item.description}</span>
              {item.badge && (
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono tracking-wider border ${
                    item.badge === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-50 text-slate-500 border-slate-200"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
