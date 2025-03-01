// import { NextRequest } from 'next/server';

// export async function GET(req: NextRequest) {
//   if (!process.env.OPENAI_API_KEY) {
//     return new Response('OpenAI API key not configured', { status: 500 });
//   }

//   const upgrade = req.headers.get('upgrade');
//   if (!upgrade || upgrade.toLowerCase() !== 'websocket') {
//     return new Response('Expected Websocket connection', { status: 426 });
//   }

//   try {
//     const wsUrl = 'wss://api.openai.com/v1/realtime';
//     const response = await fetch(wsUrl, {
//       headers: {
//         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//         'Content-Type': 'application/json',
//         'OpenAI-Beta': 'realtime=v1'
//       }
//     });

//     return new Response(response.body, {
//       status: 101,
//       headers: {
//         'Upgrade': 'websocket',
//         'Connection': 'Upgrade'
//       }
//     });
//   } catch (err) {
//     console.error('Voice API error:', err);
//     return new Response('Failed to connect to OpenAI', { status: 500 });
//   }
// }

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response('OpenAI API key not configured', { status: 500 });
  }

  const proxyUrl = req.headers.get('x-proxy-url');
  const proxyApiKey = req.headers.get('x-proxy-api-key');
  const model = req.nextUrl.searchParams.get('model') || 'gpt-4o-realtime-preview-2024-10-01';

  try {
    const wsUrl = `wss://api.openai.com/v1/realtime?model=${model}`;
    const response = await fetch(wsUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'OpenAI-Beta': 'realtime=v1',
        'Upgrade': 'websocket',
        'Connection': 'Upgrade',
        'Sec-WebSocket-Protocol': 'realtime',
        'X-Proxy-URL': proxyUrl || '',
        'X-Proxy-API-Key': proxyApiKey || '',
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
  } catch (err) {
    console.error('Voice API error:', err);
    return new Response('Failed to connect to OpenAI', { status: 500 });
  }
}

export const runtime = 'edge';
// import { NextRequest } from 'next/server';

// export async function GET(req: NextRequest) {
//   if (!process.env.OPENAI_API_KEY) {
//     return new Response('OpenAI API key not configured', { status: 500 });
//   }

//   const upgrade = req.headers.get('upgrade');
//   if (!upgrade || upgrade.toLowerCase() !== 'websocket') {
//     return new Response('Expected Websocket connection', { status: 426 });
//   }

//   const model = req.nextUrl.searchParams.get('model') || 'gpt-4o-realtime-preview-2024-10-01';
//   const wsProtocol = req.headers.get('sec-websocket-protocol');

//   if (!wsProtocol?.includes('realtime')) {
//     return new Response('Invalid WebSocket protocol', { status: 400 });
//   }

//   try {
//     const wsUrl = `wss://api.openai.com/v1/realtime?model=${model}`;
//     const response = await fetch(wsUrl, {
//       headers: {
//         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//         'OpenAI-Beta': 'realtime=v1',
//         'Upgrade': 'websocket',
//         'Connection': 'Upgrade',
//         'Sec-WebSocket-Protocol': 'realtime'
//       }
//     });

//     return new Response(response.body, {
//       status: 101,
//       headers: {
//         'Upgrade': 'websocket',
//         'Connection': 'Upgrade',
//         'Sec-WebSocket-Protocol': 'realtime'
//       }
//     });
//   } catch (err) {
//     console.error('Voice API error:', err);
//     return new Response('Failed to connect to OpenAI', { status: 500 });
//   }
// }

// export const runtime = 'edge';