// app/api/voice/audio/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/voice-sessions"; // Adjust path

export async function POST(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
        return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const session = getSession(sessionId);

    if (!session || !session.client || !session.client.isConnected()) {
         console.warn(`[${sessionId}] Audio received but session not found or client disconnected.`);
        return NextResponse.json({ error: "Invalid or inactive session" }, { status: 404 });
    }

    try {
        // Read the raw body which should be the Int16Array audio data
        const audioBuffer = await request.arrayBuffer();
        const audioData = new Int16Array(audioBuffer);

        // console.log(`[${sessionId}] Received audio chunk, ${audioData.length} samples. Appending...`) // Debug

        if (audioData.length > 0) {
            await session.client.appendInputAudio(audioData);
        } else {
            console.warn(`[${sessionId}] Received empty audio chunk.`);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error(`[${sessionId}] Error processing/appending audio:`, error);
        return NextResponse.json({ error: "Failed to process audio" }, { status: 500 });
    }
}