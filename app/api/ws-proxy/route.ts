import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const targetUrl = req.nextUrl.searchParams.get('url');
  
  if (!targetUrl) {
    return new Response('Missing target URL', { status: 400 });
  }

  const proxyUrl = 'http://cdn.smatrip.com:39210';
  const proxyAuth = Buffer.from('Jungp2jf5I:866OI8O8nZ').toString('base64');

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'Upgrade': 'websocket',
        'Connection': 'Upgrade',
        'Sec-WebSocket-Protocol': 'realtime',
        'Proxy-Authorization': `Basic ${proxyAuth}`,
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'OpenAI-Beta': 'realtime=v1'
      }
    });

    return new Response(response.body, {
      status: 101,
      headers: {
        'Upgrade': 'websocket',
        'Connection': 'Upgrade',
        'Sec-WebSocket-Protocol': 'realtime'
      }
    });
  } catch (error) {
    console.error('WebSocket proxy error:', error);
    return new Response('WebSocket proxy error', { status: 500 });
  }
}

export const runtime = 'edge';