// lib/voice-sessions.ts
import { RealtimeClient } from "@openai/realtime-api-beta";
import { Writable } from 'stream';

// Warning: In-memory store is not suitable for production serverless environments.
// Consider Redis or similar for scaling.
interface VoiceSession {
    client: RealtimeClient;
    streamController: ReadableStreamDefaultController<any>;
    sseResponseStream: Writable; // Store the response stream to write SSE events
    lastActivity: number;
}

const sessions = new Map<string, VoiceSession>();

export const addSession = (id: string, session: VoiceSession) => {
    sessions.set(id, session);
    console.log(`Session added: ${id}. Total sessions: ${sessions.size}`);
    // Start cleanup check if not already running frequently
    // scheduleCleanup();
};

export const getSession = (id: string): VoiceSession | undefined => {
    const session = sessions.get(id);
    if (session) {
        session.lastActivity = Date.now();
    }
    return session;
};

export const removeSession = (id: string) => {
    const session = sessions.get(id);
    if (session) {
        try {
            session.client.disconnect();
            console.log(`Disconnected client for session: ${id}`);
             // Ensure the stream controller is closed
             if (session.streamController) {
                session.streamController.close();
                console.log(`Closed stream controller for session: ${id}`);
            }
             // End the SSE response stream
             if (session.sseResponseStream && !session.sseResponseStream.destroyed) {
                session.sseResponseStream.end();
                console.log(`Ended SSE response stream for session: ${id}`);
            }
        } catch (error) {
            console.error(`Error disconnecting client for session ${id}:`, error);
        }
        sessions.delete(id);
        console.log(`Session removed: ${id}. Total sessions: ${sessions.size}`);
    }
};

// Optional: Add periodic cleanup for inactive sessions
const INACTIVE_TIMEOUT = 15 * 60 * 1000; // 15 minutes

const cleanupInactiveSessions = () => {
    const now = Date.now();
    console.log("Running inactive session cleanup...");
    sessions.forEach((session, id) => {
        if (now - session.lastActivity > INACTIVE_TIMEOUT) {
            console.log(`Session ${id} inactive, removing.`);
            removeSession(id);
        }
    });
     // Reschedule cleanup
     // setTimeout(cleanupInactiveSessions, 5 * 60 * 1000); // Check every 5 mins
};
// Call once to start the cleanup cycle
// setTimeout(cleanupInactiveSessions, 5 * 60 * 1000);