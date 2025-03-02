// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//   if (request.nextUrl.pathname.startsWith('/api/voice')) {
//     const upgrade = request.headers.get('upgrade');
//     if (upgrade?.toLowerCase() === 'websocket') {
//       return NextResponse.next({
//         headers: {
//           'Upgrade': 'websocket',
//           'Connection': 'Upgrade',
//           'Sec-WebSocket-Protocol': 'realtime'
//         }
//       });
//     }
//   }
//   return NextResponse.next();
// }

// export const config = {
//   matcher: '/api/voice'
// };
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Parse proxy URL components
const PROXY_HOST = "http://cdn.smatrip.com:39210";
const PROXY_USERNAME = "Jungp2jf5I";
const PROXY_PASSWORD = "866OI8O8nZ";
const PROXY_AUTH = `Basic ${Buffer.from(
  `${PROXY_USERNAME}:${PROXY_PASSWORD}`
).toString("base64")}`;

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/voice")) {
    const upgrade = request.headers.get("upgrade");
    if (upgrade?.toLowerCase() === "websocket") {
      // More visible logging format
      const logMessage = `
🔵 VOICE API REQUEST LOG
------------------------
📅 Time: ${new Date().toISOString()}
🌐 IP: ${request.ip}
🔗 URL: ${request.url}
📍 Proxy: ${PROXY_HOST}
------------------------`;

      console.warn(logMessage);
      const headers = new Headers({
        Upgrade: "websocket",
        Connection: "Upgrade",
        "Sec-WebSocket-Protocol": "realtime",
        "X-Forwarded-Host": request.headers.get("host") || "",
        "Proxy-Authorization": PROXY_AUTH,
        "X-Proxy-Host": PROXY_HOST,
        "X-Forwarded-Proto": "https",
        "X-Original-IP": request.ip || "unknown", // Store original IP for comparison
      });

      // Log final proxy configuration
      console.warn("=== Proxy Configuration ===");
      console.warn(
        `Headers: ${JSON.stringify(Object.fromEntries(headers), null, 2)}`
      );
      console.warn("========================");

      request.headers.forEach((value, key) => {
        if (!headers.has(key)) {
          headers.set(key, value);
        }
      });

      return NextResponse.next({
        headers,
      });
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/api/voice",
};
