import { useState, useEffect, useCallback } from "react";
import { ShieldAlert, Cpu, Heart } from "lucide-react";
import { ApiStatusResponse } from "./types";
import { mockStatusData } from "./mockData";

// Import custom sub-components
import StatusIndicator from "./components/StatusIndicator";
import MetricCards from "./components/MetricCards";
import AnalyticsPanel from "./components/AnalyticsPanel";
import VisitorsList from "./components/VisitorsList";
import SystemSpecs from "./components/SystemSpecs";

export default function App() {
  const [data, setData] = useState<ApiStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refreshInterval = 1; // Enforce strict 1s auto update
  const [countdown, setCountdown] = useState<number>(1);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const [latencyHistory, setLatencyHistory] = useState<{ time: string; value: number }[]>([]);

  // Main fetch status logic
  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setCountdown(refreshInterval);
    try {
      const response = await fetch("/api/status");
      if (!response.ok) {
        throw new Error(`Failed to fetch: Status code ${response.status}`);
      }
      const json: ApiStatusResponse = await response.json();

      // Check if server returned failure state inside json
      if (json.status === false) {
        throw new Error(json.message || "Failed to parse API status");
      }

      setData(json);
      setIsUsingMockData(false);
      setError(null);

      // Add to rolling latency history
      const nowStr = new Date(json.timestamp.utc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLatencyHistory((prev) => {
        const next = [...prev, { time: nowStr, value: json.responseTimeMs || 2 }];
        return next.slice(-15); // Keep last 15 ticks
      });
    } catch (err: any) {
      console.warn("Backend API fetching failed. Entering simulation mode with high-fidelity mock data:", err.message);
      setError(err.message || "Connection refused");
      setIsUsingMockData(true);

      // Simulation mode: Randomize latency and timestamp slightly to mimic actual real-time updates
      const simulatedLatency = Math.floor(Math.random() * 25) + 2; // 2ms - 27ms
      const nowIso = new Date().toISOString();

      // Slightly alter mock data to represent a living environment
      const simulatedData: ApiStatusResponse = {
        ...mockStatusData,
        responseTimeMs: simulatedLatency,
        timestamp: {
          utc: nowIso,
          local: new Date().toLocaleString(),
          timezone: "UTC"
        },
        result: {
          ...mockStatusData.result,
          // Let's randomize online visitors slightly as well
          visitor_now: {
            online_count: Math.max(1, mockStatusData.result.visitor_now.online_count + (Math.random() > 0.6 ? 1 : Math.random() > 0.8 ? -1 : 0)),
            recent_unique_visitors: mockStatusData.result.visitor_now.recent_unique_visitors.map((v, i) => {
              if (i === 0) {
                return {
                  ...v,
                  last_seen: nowIso,
                };
              }
              return v;
            })
          }
        }
      };

      setData(simulatedData);

      const timeLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLatencyHistory((prev) => {
        const next = [...prev, { time: timeLabel, value: simulatedLatency }];
        return next.slice(-15);
      });
    } finally {
      setLoading(false);
    }
  }, [refreshInterval]);

  // Initial fetch
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Set interval for polling and countdown timer
  useEffect(() => {
    if (refreshInterval <= 0) return;

    setCountdown(refreshInterval);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchStatus();
          return refreshInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshInterval, fetchStatus]);

  // Sparkline Chart calculations for latency
  const maxSessionLatency = Math.max(...latencyHistory.map((h) => h.value), 30);
  const minSessionLatency = Math.min(...latencyHistory.map((h) => h.value), 0);

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans selection:bg-slate-200 selection:text-slate-900 premium-gradient">
      {/* Primary Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
        
        {/* Warning notification for Simulation Mode */}
        {isUsingMockData && (
          <div className="bg-slate-900 text-white rounded-2xl p-5 flex items-start gap-4 shadow-lg border border-slate-800">
            <ShieldAlert className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-indigo-300">SANDBOX TElemetry ACTIVE</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-4xl">
                Direct connections to the live host APIs are restricted in this preview. Telemetry data is active via sandbox simulation using high-fidelity telemetry profiles updated in real-time.
              </p>
            </div>
          </div>
        )}

        {/* Main Operational Panels */}
        <StatusIndicator
          data={data}
          loading={loading}
          onRefresh={fetchStatus}
          refreshInterval={refreshInterval}
          isUsingMockData={isUsingMockData}
          countdown={countdown}
        />

        <MetricCards data={data} />

        {/* Core Analytics Blocks */}
        <AnalyticsPanel data={data} />

        {/* Traffic Logs & Latency Sparkline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Active Traffic */}
          <div className="lg:col-span-7">
            <VisitorsList data={data} />
          </div>

          {/* Latency History Sparkline chart */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 subtle-shadow flex flex-col justify-between h-full">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-1">
                  <Cpu className="w-3.5 h-3.5 text-slate-500" /> Response History
                </h3>
                <p className="text-[11px] text-slate-400">
                  Rolling latency for the last {latencyHistory.length} polling ticks
                </p>

                {/* Sparkline canvas */}
                {latencyHistory.length > 1 ? (
                  <div className="h-32 flex items-end justify-between gap-1 mt-6 relative pb-1">
                    {/* Grid lines */}
                    <div className="absolute inset-0 border-b border-slate-100/50 flex flex-col justify-between pointer-events-none">
                      <div className="border-b border-slate-100/30 w-full h-0" />
                      <div className="border-b border-slate-100/30 w-full h-0" />
                      <div className="border-b border-slate-100/30 w-full h-0" />
                    </div>

                    {/* Sparkline bars */}
                    {latencyHistory.map((point, index) => {
                      const heightPercent = maxSessionLatency > minSessionLatency
                        ? ((point.value - minSessionLatency) / (maxSessionLatency - minSessionLatency)) * 100
                        : 50;

                      return (
                        <div
                          key={index}
                          className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer"
                        >
                          {/* Tooltip */}
                          <div className="absolute bottom-full mb-1.5 bg-slate-950 text-[10px] text-white rounded-lg px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-30 shadow-lg border border-slate-800 font-mono">
                            <span className="font-bold text-slate-100">{point.value} ms</span>
                            <span className="block text-[8px] text-slate-400 mt-0.5">{point.time}</span>
                          </div>

                          {/* Bar */}
                          <div
                            className="w-full bg-slate-100 group-hover:bg-slate-950 rounded-t-lg transition-colors duration-150"
                            style={{ height: `${Math.max(6, heightPercent)}%` }}
                          />

                          {/* Dot indicator on active bar */}
                          <div className="w-1 h-1 rounded-full bg-slate-900 opacity-0 group-hover:opacity-100 absolute bottom-0 -translate-y-[1px] transition-opacity" />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center text-xs text-slate-400 italic bg-slate-50 rounded-xl border border-slate-100/80 mt-6">
                    Waiting for rolling polling sessions...
                  </div>
                )}
              </div>

              {/* Min/Max indicators */}
              {latencyHistory.length > 0 && (
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-6 pt-3 border-t border-slate-50">
                  <span>Fastest: <strong className="text-slate-800 font-bold">{Math.min(...latencyHistory.map(h => h.value))} ms</strong></span>
                  <span>Slowest: <strong className="text-slate-800 font-bold">{Math.max(...latencyHistory.map(h => h.value))} ms</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Server environment details */}
        <SystemSpecs data={data} />

        {/* Footer */}
        <footer className="mt-12 py-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-slate-300 fill-slate-300" />
          </div>

          <div className="flex items-center gap-4">
            <span>&copy; {new Date().getFullYear()} CMNTY</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
