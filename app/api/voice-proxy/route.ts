import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  
  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Voice proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to process audio request' }, 
      { status: 500 }
    );
  }
}