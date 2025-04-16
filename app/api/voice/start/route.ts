// app/api/voice/start/route.ts
import { NextResponse } from "next/server";
import { RealtimeClient } from "@openai/realtime-api-beta";
import { v4 as uuidv4 } from "uuid";
import { addSession } from "@/lib/voice-sessions"; // Adjust path if needed
import { tools } from "@/ai/tools"; // Reuse tools definition
import DateService from "@/services/date-service";

export async function POST(request: Request) {
    try {
        const sessionId = uuidv4();
        const apiKey = process.env.OPENAI_API_KEY; // Use server-side key

        if (!apiKey) {
            console.error("OPENAI_API_KEY is not set on the server.");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        // Create a placeholder session first
        // The streamController will be added by the /events endpoint when it connects
        const client = new RealtimeClient({ apiKey, debug: true }); // Enable debug for troubleshooting

        // We will add the actual streamController when the SSE connects
        const placeholderSession = {
             client,
             streamController: null as any, // Placeholder
             sseResponseStream: null as any, // Placeholder
             lastActivity: Date.now()
        };

        // Temporarily store the session - it will be fully populated by /events
        addSession(sessionId, placeholderSession);

        console.log(`Session ${sessionId} initialized, awaiting SSE connection.`);

        // Return the sessionId to the client
        return NextResponse.json({ sessionId });

    } catch (error) {
        console.error("Error starting voice session:", error);
        return NextResponse.json({ error: "Failed to start voice session" }, { status: 500 });
    }
}