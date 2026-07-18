import { ApiStatusResponse } from "./types";

export const mockStatusData: ApiStatusResponse = {
  "status": true,
  "statusCode": 200,
  "author": "@cmnty.official",
  "result": {
    "ping": "pong",
    "uptime": {
      "seconds": 5089,
      "human": "1h 24m 49s"
    },
    "counters": {
      "total_requests": 225375,
      "total_visitors": 9170,
      "connected_websocket_clients": 2
    },
    "realtime_analytics_100req": {
      "sample_size": 100,
      "success_rate_percentage": 88,
      "average_latency_ms": 3236.78,
      "min_latency_ms": 1,
      "max_latency_ms": 16783,
      "active_unique_ips_count": 33,
      "active_countries_count": 4,
      "active_countries_list": [
        "FR",
        "US",
        "ID",
        "DE"
      ],
      "http_methods": {
        "GET": 86,
        "POST": 14,
        "PUT": 0,
        "DELETE": 0,
        "OTHER": 0
      },
      "status_codes": {
        "1xx": 0,
        "2xx": 88,
        "3xx": 0,
        "4xx": 11,
        "5xx": 1
      },
      "top_endpoints": {
        "/uploader/upload": 11,
        "/maker/bratnime-vermeil?text=itu%20gak%20rispek%20banget%20wok": 4,
        "/tools/spam-otp": 3,
        "/downloader/youtplay?q=monokrom": 2,
        "/downloader/ytmp3?url=https%3A%2F%2Fyoutube.com%2Fwatch%3Fv%3DNskf70DMR60": 2
      }
    },
    "visitor_now": {
      "online_count": 2,
      "recent_unique_visitors": [
        {
          "ip": "104.23.229.28",
          "country": "FR",
          "last_seen": "2026-07-18T10:28:07.052Z",
          "url": "/downloader/spotify-play?q=bye+bye+boy+bye"
        },
        {
          "ip": "172.71.154.81",
          "country": "US",
          "last_seen": "2026-07-18T10:27:06.164Z",
          "url": "/tools/spam-otp?nomer=6285814958064"
        },
        {
          "ip": "172.71.122.131",
          "country": "FR",
          "last_seen": "2026-07-18T10:27:01.600Z",
          "url": "/uploader/upload"
        },
        {
          "ip": "141.101.69.98",
          "country": "FR",
          "last_seen": "2026-07-18T10:26:21.429Z",
          "url": "/uploader/upload"
        },
        {
          "ip": "172.71.126.175",
          "country": "FR",
          "last_seen": "2026-07-18T10:25:34.951Z",
          "url": "/downloader/spotify-play?q=sigma+jungler+x+mama+muda"
        },
        {
          "ip": "172.71.131.46",
          "country": "FR",
          "last_seen": "2026-07-18T10:25:15.302Z",
          "url": "/downloader/spotify-play?q=remix+mahjong"
        },
        {
          "ip": "104.23.225.170",
          "country": "FR",
          "last_seen": "2026-07-18T10:25:00.068Z",
          "url": "/ai/gemini-tts?text=goodbye+baby"
        },
        {
          "ip": "172.71.124.184",
          "country": "ID",
          "last_seen": "2026-07-18T10:24:13.766Z",
          "url": "/downloader/spotify-play?q=$"
        },
        {
          "ip": "162.158.88.57",
          "country": "ID",
          "last_seen": "2026-07-18T10:23:49.287Z",
          "url": "/tools/spam-otp"
        },
        {
          "ip": "162.158.167.159",
          "country": "US",
          "last_seen": "2026-07-18T10:23:27.371Z",
          "url": "/tools/spam-otp?nomer=6285945094512"
        }
      ]
    },
    "process": {
      "pid": 10,
      "node_version": "v22.23.1",
      "node_env": "production",
      "cpu": {
        "user_seconds": 6.68,
        "system_seconds": 0.55
      },
      "memory": {
        "rss": "164.70 MB",
        "heapTotal": "45.57 MB",
        "heapUsed": "39.45 MB",
        "external": "4.94 MB",
        "arrayBuffers": "1.21 MB"
      }
    },
    "system": {
      "platform": "linux",
      "arch": "x64",
      "os_type": "Linux",
      "os_release": "6.18.15+deb13-cloud-amd64",
      "load_avg": [
        5.58,
        5.52,
        6.01
      ],
      "cpu_count": 48,
      "memory": {
        "total": "330437.63 MB",
        "free": "125920.87 MB",
        "used_percentage": "61.89%"
      }
    },
    "maintenance": {
      "/uploader/cdn": true
    },
    "client": {
      "ip": "100.64.0.14",
      "user_agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36"
    }
  },
  "message": "Real-time API & Server Status",
  "responseTimeMs": 2,
  "timestamp": {
    "utc": "2026-07-18T10:29:13.583Z",
    "local": "7/18/2026, 10:29:13 AM",
    "timezone": "UTC"
  }
};
