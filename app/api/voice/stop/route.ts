// app/api/voice/stop/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { removeSession } from '@/lib/voice-sessions'; // Adjust path

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
  }

  console.log(`[${sessionId}] Received request to stop session.`);
  removeSession(sessionId); // This handles client disconnection and cleanup

  return NextResponse.json({ success: true });
}