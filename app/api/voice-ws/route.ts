import { NextRequest } from 'next/server';
import  WebSocket  from 'ws';

export async function GET(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response('OpenAI API key not configured', { status: 500 });
  }

  const upgrade = req.headers.get('upgrade');
  if (!upgrade || upgrade.toLowerCase() !== 'websocket') {
    return new Response('Expected Websocket connection', { status: 426 });
  }

  const wsServer = new WebSocket.Server({ noServer: true });

  wsServer.on('connection', (ws) => {
    const openAIWs = new WebSocket(
      'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17',
      [
        'realtime',
        `openai-insecure-api-key.${process.env.OPENAI_API_KEY}`,
        'openai-beta.realtime-v1'
      ]
    );

    openAIWs.on('open', () => {
      const initEvent = {
        type: 'response.create',
        response: {
          modalities: ['audio', 'text'],
          instructions: 'Please assist the user in Persian language.'
        }
      };
      openAIWs.send(JSON.stringify(initEvent));
    });

    openAIWs.on('message', (data) => {
      ws.send(data);
    });

    ws.on('message', (data) => {
      if (openAIWs.readyState === openAIWs.OPEN) {
        openAIWs.send(data);
      }
    });

    ws.on('close', () => {
      openAIWs.close();
    });
  });

  const { socket, response } = Upgrade(req, {
    protocol: 'websocket',
  });

  wsServer.handleUpgrade(req, socket, Buffer.alloc(0), (ws) => {
    wsServer.emit('connection', ws);
  });

  return response;
}

export const runtime = 'nodejs';