import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust this to your frontend URL
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join', (data) => {
    console.log('Client joined with instructions:', data.instructions);
    // Handle join logic here
    socket.emit('message', { id: Date.now(), text: "Welcome to the conversation!" });
  });

  socket.on('audio', (data) => {
    console.log('Received audio data:', data.audio.length, 'bytes');
    // Process audio data and send response back to client
    // For demonstration, we'll just echo it back
    socket.emit('message', { id: Date.now(), audio: data.audio });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});