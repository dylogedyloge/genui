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
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROXY_URL = 'http://Jungp2jf5I:866OI8O8nZ@cdn.smatrip.com:39210'; // e.g., 'https://your-proxy.com'
const PROXY_API_KEY = 'YOUR_PROXY_API_KEY'; // if required
  
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/voice')) {
    const upgrade = request.headers.get('upgrade');
    if (upgrade?.toLowerCase() === 'websocket') {
      const headers = new Headers({
        'Upgrade': 'websocket',
        'Connection': 'Upgrade',
        'Sec-WebSocket-Protocol': 'realtime',
        'X-Forwarded-Host': request.headers.get('host') || '',
        'X-Proxy-URL': PROXY_URL,
        'X-Proxy-API-Key': PROXY_API_KEY,
      });

      // Clone the request headers
      request.headers.forEach((value, key) => {
        if (!headers.has(key)) {
          headers.set(key, value);
        }
      });

      return NextResponse.next({
        headers
      });
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/api/voice'
};    