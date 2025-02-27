import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest } from 'next';
import { Server as NetServer } from 'http';
import { NextApiResponse } from 'next';

export default function SocketHandler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket.server.io) {
    const httpServer = res.socket.server as any as NetServer;
    const io = new SocketIOServer(httpServer, {
      path: '/api/socket',
      addTrailingSlash: false,
    });

    io.on('connection', (socket) => {
      socket.on('voice-input', async (audioData) => {
        try {
          const response = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(audioData)
          });

          if (!response.ok) {
            throw new Error('OpenAI API error');
          }

          const data = await response.json();
          socket.emit('voice-response', data);
        } catch (error) {
          socket.emit('error', { message: 'Failed to process voice input' });
        }
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};