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

// Parse proxy URL components
const PROXY_HOST = 'http://cdn.smatrip.com:39210';
const PROXY_USERNAME = 'Jungp2jf5I';
const PROXY_PASSWORD = '866OI8O8nZ';
const PROXY_AUTH = `Basic ${Buffer.from(`${PROXY_USERNAME}:${PROXY_PASSWORD}`).toString('base64')}`;

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/voice')) {
    const upgrade = request.headers.get('upgrade');
    if (upgrade?.toLowerCase() === 'websocket') {
      const headers = new Headers({
        'Upgrade': 'websocket',
        'Connection': 'Upgrade',
        'Sec-WebSocket-Protocol': 'realtime',
        'X-Forwarded-Host': request.headers.get('host') || '',
        'Proxy-Authorization': PROXY_AUTH,
        'X-Proxy-Host': PROXY_HOST,
        'X-Forwarded-Proto': 'https'  // Added HTTPS protocol
      });

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