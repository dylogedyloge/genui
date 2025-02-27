import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response('OpenAI API key not configured', { status: 500 });
  }

  const upgrade = req.headers.get('upgrade');
  if (!upgrade || upgrade.toLowerCase() !== 'websocket') {
    return new Response('Expected Websocket connection', { status: 426 });
  }

  try {
    const wsUrl = 'wss://api.openai.com/v1/realtime';
    const response = await fetch(wsUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'realtime=v1'
      }
    });

    return new Response(response.body, {
      status: 101,
      headers: {
        'Upgrade': 'websocket',
        'Connection': 'Upgrade'
      }
    });
  } catch (err) {
    console.error('Voice API error:', err);
    return new Response('Failed to connect to OpenAI', { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};