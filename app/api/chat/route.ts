import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { tools } from "@/ai/tools";

export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = await streamText({
    model: openai("gpt-4o"),
    system:
      "You are a friendly assistant!Use tools like 'displayWeather' when asked about weather.",
    messages,
    maxSteps: 5,
    tools,
  });
  

  return result.toDataStreamResponse();
}
