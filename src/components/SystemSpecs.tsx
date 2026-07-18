import { Cpu, Server, HardDrive, Terminal } from "lucide-react";
import { ApiStatusResponse } from "../types";

interface SystemSpecsProps {
  data: ApiStatusResponse | null;
}

export default function SystemSpecs({ data }: SystemSpecsProps) {
  const processInfo = data?.result?.process;
  const systemInfo = data?.result?.system;

  if (!processInfo || !systemInfo) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-6 text-center text-slate-400 text-xs italic subtle-shadow">
        Telemetry specifications are temporarily unavailable
      </div>
    );
  }

  // Parse heap details
  const heapUsedStr = processInfo.memory.heapUsed;
  const heapTotalStr = processInfo.memory.heapTotal;

  // Convert string memory (e.g. "45.57 MB") to floats for ratio calculations
  const getMbFloat = (str: string) => {
    return parseFloat(str.replace(/[^0-9.]/g, "")) || 0;
  };

  const heapUsedNum = getMbFloat(heapUsedStr);
  const heapTotalNum = getMbFloat(heapTotalStr);
  const heapPercent = heapTotalNum > 0 ? Math.round((heapUsedNum / heapTotalNum) * 100) : 0;

  // System memory
  const sysTotalStr = systemInfo.memory.total;
  const sysFreeStr = systemInfo.memory.free;
  const sysUsedPercentage = parseFloat(systemInfo.memory.used_percentage.replace(/[^0-9.]/g, "")) || 0;

  // Load Averages
  const loadAvgs = systemInfo.load_avg || [0, 0, 0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* NODE.JS PROCESS RESOURCE METRICS */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 subtle-shadow flex flex-col justify-between">
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-5">
            <Terminal className="w-3.5 h-3.5 text-slate-500" /> V8 Execution Telemetry
          </h2>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100/50">
              <span className="text-[9px] text-slate-400 uppercase font-mono block tracking-wider">Engine Version</span>
              <span className="text-xs font-bold text-slate-800 font-mono mt-1 block">
                Node {processInfo.node_version}
              </span>
            </div>

            <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100/50">
              <span className="text-[9px] text-slate-400 uppercase font-mono block tracking-wider">Target Node Env</span>
              <span className="text-xs font-bold text-slate-800 font-mono mt-1 block capitalize">
                {processInfo.node_env}
              </span>
            </div>

            <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100/50">
              <span className="text-[9px] text-slate-400 uppercase font-mono block tracking-wider">Process ID (PID)</span>
              <span className="text-xs font-bold text-slate-800 font-mono mt-1 block">
                {processInfo.pid}
              </span>
            </div>

            <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100/50">
              <span className="text-[9px] text-slate-400 uppercase font-mono block tracking-wider">VCPU User Time</span>
              <span className="text-xs font-bold text-slate-800 font-mono mt-1 block">
                {processInfo.cpu.user_seconds}s
              </span>
            </div>
          </div>
        </div>

        {/* Process V8 Engine Heap gauge */}
        <div className="space-y-3 pt-3 border-t border-slate-50">
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-500 font-medium font-sans">V8 Memory Heap Allocation</span>
              <span className="font-mono text-slate-900 font-bold text-[11px]">
                {heapUsedStr} <span className="text-slate-300">/</span> {heapTotalStr} ({heapPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
              <div
                className="bg-slate-950 h-full rounded-full transition-all duration-1000"
                style={{ width: `${heapPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* OPERATING SYSTEM SPECIFICATIONS */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 subtle-shadow flex flex-col justify-between">
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-5">
            <Server className="w-3.5 h-3.5 text-slate-500" /> VM Host Environment
          </h2>

          {/* OS detail blocks */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100/50">
              <span className="text-[9px] text-slate-400 uppercase font-mono block tracking-wider">Kernel Platform</span>
              <span className="text-xs font-bold text-slate-800 font-mono mt-1 block capitalize">
                {systemInfo.os_type} ({systemInfo.arch})
              </span>
            </div>

            <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100/50" title={systemInfo.os_release}>
              <span className="text-[9px] text-slate-400 uppercase font-mono block tracking-wider">Kernel Version</span>
              <span className="text-xs font-bold text-slate-800 font-mono mt-1 block truncate">
                {systemInfo.os_release}
              </span>
            </div>

            <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100/50">
              <span className="text-[9px] text-slate-400 uppercase font-mono block tracking-wider">CPU Thread Units</span>
              <span className="text-xs font-bold text-slate-800 font-mono mt-1 block">
                {systemInfo.cpu_count} Core Threads
              </span>
            </div>

            <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100/50">
              <span className="text-[9px] text-slate-400 uppercase font-mono block tracking-wider">Host Load Avgs</span>
              <span className="text-xs font-bold text-slate-800 font-mono mt-1 block">
                {loadAvgs[0]}, {loadAvgs[1]}, {loadAvgs[2]}
              </span>
            </div>
          </div>
        </div>

        {/* Operating System Memory usage slider */}
        <div className="space-y-3 pt-3 border-t border-slate-50">
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-slate-400" /> Host System Memory
              </span>
              <span className="font-mono text-slate-900 font-bold text-[11px]">
                Used {sysUsedPercentage.toFixed(1)}% ({sysFreeStr} free)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
              <div
                className="bg-slate-950 h-full rounded-full transition-all duration-1000"
                style={{ width: `${sysUsedPercentage}%` }}
              />
            </div>
          </div>
          <p className="text-[9px] text-slate-400 font-mono text-right">
            Total capacity limit: {sysTotalStr}
          </p>
        </div>
      </div>
    </div>
  );
}
