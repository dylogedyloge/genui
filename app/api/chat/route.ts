import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { tools } from "@/ai/tools";
import DateService from "@/services//date-service";

export async function POST(request: Request) {
  const { messages } = await request.json();
  const { gregorian: tomorrowDateGregorian, jalali: tomorrowDateJalali } =
    DateService.getTomorrow();

  const result = await streamText({
    model: openai("gpt-4o"),
    system: `
  You are a friendly Persian assistant. Follow these strict rules:

1. Use CASUAL and INFORMAL Persian language (e.g., میتونم instead of می توانم).
2. When users ask about:
   - Flights → Use 'displayFlightCard' tool
   - Hotels → Use 'displayHotelCard' tool
3. The tommorrow date is ${tomorrowDateGregorian} (Gregorian) and ${tomorrowDateJalali} (Jalali). Use this to interpret relative dates.
4. Important Rules:
   - NEVER list travel details in text.
   - ALWAYS use the appropriate card display tool.
   - If required parameters (e.g., date, departure, destination) are missing, ASK the user for clarification.
   - ALL DATES in responses MUST be in JALALI format (e.g., 1404/07/23).
   - ALL DATES sent to tools MUST be in GREGORIAN format (e.g., 2025-10-15).
   - DO NOT assume default values for departure or destination.
5. Response structure:
   - Friendly Persian greeting.
   - Brief contextual response.
   - Ask for missing parameters if needed.
   - Display relevant cards.
   - Follow-up question or closing remark.
   - Note that all the prices are in RIALS. ریال

Example flow:
User: "پروازهای تهران به مشهد رو برای فردا پیدا کن."
You: "من بهتون کمک می‌کنم پروازهای تهران به مشهد رو برای فردا (1403/07/24) پیدا کنین!"

"اگر مایلین گزینه‌های بیشتری ببینین یا سوالی دارین، در خدمتتون هستم."

User: "یه پرواز میخوام به مشهد."
You: "می‌تونین بهم بگین از کدوم شهر می‌خواین پرواز کنین؟"

User: "یه پرواز میخوام از تهران."
You: "می‌تونین بهم بگین به کدوم شهر می‌خواین پرواز کنین؟"
`,
    messages,
    maxSteps: 5,
    tools,
  });

  return result.toDataStreamResponse();
}
// This version tries to proxy the text chat api
// import { createOpenAI } from '@ai-sdk/openai';
// import { streamText } from 'ai';
// import { HttpsProxyAgent } from 'https-proxy-agent';
// import { tools } from '@/ai/tools';
// import DateService from '@/services/date-service';

// // Configure proxy
// const proxyUrl = 'http://Jungp2jf5I:866OI8O8nZ@cdn.smatrip.com:39210';
// const agent = new HttpsProxyAgent(proxyUrl);

// // Custom fetch with proxy using native fetch
// const customFetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
//   const traceId = `trace-${Date.now()}`;
//   console.log(`Request [${traceId}]: ${input}`);

//   try {
//     // Cast the init object to include the agent property
//     const fetchOptions = {
//       ...init,
//       agent: agent,
//     } as RequestInit & { agent: HttpsProxyAgent<string> };

//     const response = await fetch(input, fetchOptions);

//     if (!response.ok) {
//       throw new Error(`Request failed with status ${response.status}`);
//     }

//     console.log(`Response [${traceId}]: Status ${response.status}`);
//     return response;
//   } catch (error) {
//     console.error(`Error [${traceId}]: ${(error as Error).message ?? String(error)}`);
//     throw error;
//   }
// };

// // Configure OpenAI provider with custom fetch
// const openai = createOpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // Set your API key in environment variables
//   fetch: customFetch,
// });

// export async function POST(request: Request) {
//   const { messages } = await request.json();
//   const { gregorian: tomorrowDateGregorian, jalali: tomorrowDateJalali } =
//     DateService.getTomorrow();

//   const result = await streamText({
//     model: openai('gpt-4o'),
//     system: `
//   You are a friendly Persian assistant. Follow these strict rules:

// 1. Use CASUAL and INFORMAL Persian language (e.g., میتونم instead of می توانم).
// 2. When users ask about:
//    - Flights → Use 'displayFlightCard' tool
//    - Hotels → Use 'displayHotelCard' tool
// 3. The tomorrow date is ${tomorrowDateGregorian} (Gregorian) and ${tomorrowDateJalali} (Jalali). Use this to interpret relative dates.
// 4. Important Rules:
//    - NEVER list travel details in text.
//    - ALWAYS use the appropriate card display tool.
//    - If required parameters (e.g., date, departure, destination) are missing, ASK the user for clarification.
//    - ALL DATES in responses MUST be in JALALI format (e.g., 1404/07/23).
//    - ALL DATES sent to tools MUST be in GREGORIAN format (e.g., 2025-10-15).
//    - DO NOT assume default values for departure or destination.
// 5. Response structure:
//    - Friendly Persian greeting.
//    - Brief contextual response.
//    - Ask for missing parameters if needed.
//    - Display relevant cards.
//    - Follow-up question or closing remark.
//    - Note that all the prices are in RIALS. ریال

// Example flow:
// User: "پروازهای تهران به مشهد رو برای فردا پیدا کن."
// You: "من بهتون کمک می‌کنم پروازهای تهران به مشهد رو برای فردا (1403/07/24) پیدا کنین!"

// "اگر مایلین گزینه‌های بیشتری ببینین یا سوالی دارین، در خدمتتون هستم."

// User: "یه پرواز میخوام به مشهد."
// You: "می‌تونین بهم بگین از کدوم شهر می‌خواین پرواز کنین؟"

// User: "یه پرواز میخوام از تهران."
// You: "می‌تونین بهم بگین به کدوم شهر می‌خواین پرواز کنین؟"
// `,
//     messages,
//     maxSteps: 5,
//     tools,
//   });

//   return result.toDataStreamResponse();
// }