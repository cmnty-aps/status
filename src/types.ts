export interface Uptime {
  seconds: number;
  human: string;
}

export interface Counters {
  total_requests: number;
  total_visitors: number;
  connected_websocket_clients: number;
}

export interface HttpMethods {
  GET: number;
  POST: number;
  PUT: number;
  DELETE: number;
  OTHER: number;
}

export interface StatusCodes {
  "1xx": number;
  "2xx": number;
  "3xx": number;
  "4xx": number;
  "5xx": number;
}

export interface RealtimeAnalytics100Req {
  sample_size: number;
  success_rate_percentage: number;
  average_latency_ms: number;
  min_latency_ms: number;
  max_latency_ms: number;
  active_unique_ips_count: number;
  active_countries_count: number;
  active_countries_list: string[];
  http_methods: HttpMethods;
  status_codes: StatusCodes;
  top_endpoints: Record<string, number>;
}

export interface RecentVisitor {
  ip: string;
  country: string;
  last_seen: string;
  url: string;
}

export interface VisitorNow {
  online_count: number;
  recent_unique_visitors: RecentVisitor[];
}

export interface CpuUsage {
  user_seconds: number;
  system_seconds: number;
}

export interface MemoryUsage {
  rss: string;
  heapTotal: string;
  heapUsed: string;
  external: string;
  arrayBuffers: string;
}

export interface ProcessInfo {
  pid: number;
  node_version: string;
  node_env: string;
  cpu: CpuUsage;
  memory: MemoryUsage;
}

export interface SystemMemory {
  total: string;
  free: string;
  used_percentage: string;
}

export interface SystemInfo {
  platform: string;
  arch: string;
  os_type: string;
  os_release: string;
  load_avg: number[];
  cpu_count: number;
  memory: SystemMemory;
}

export interface MaintenanceStatus {
  [endpoint: string]: boolean;
}

export interface ClientInfo {
  ip: string;
  user_agent: string;
}

export interface ApiStatusResult {
  ping: string;
  uptime: Uptime;
  counters: Counters;
  realtime_analytics_100req: RealtimeAnalytics100Req;
  visitor_now: VisitorNow;
  process: ProcessInfo;
  system: SystemInfo;
  maintenance: MaintenanceStatus;
  client: ClientInfo;
}

export interface Timestamp {
  utc: string;
  local: string;
  timezone: string;
}

export interface ApiStatusResponse {
  status: boolean;
  statusCode: number;
  author: string;
  result: ApiStatusResult;
  message: string;
  responseTimeMs: number;
  timestamp: Timestamp;
}
