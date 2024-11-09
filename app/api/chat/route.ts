// import { openai } from "@ai-sdk/openai";
// import { streamText, convertToCoreMessages } from "ai";
// import { tools } from '@/ai/tools';

// // Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

// export async function POST(req: Request) {
//   const { messages, agentType } = await req.json();

//   const agentRoutes = {
//     پرواز: "/agents/flight-agent",
//     هتل: "/agents/hotel-agent",
//     رستوران: "/agents/restaurant-agent",
//     تور: "/agents/tour-agent",
//     "برنامه سفر": "/agents/itinerary-agent",
//   };

//   const agentPrompts = {
//     پرواز: `You are a flight booking assistant. Only answer questions about flights, airports, and airlines. 
//     If users ask about other services, redirect them using this format:
//     "من فقط در مورد پروازها می‌تونم کمکتون کنم. برای اطلاعات در مورد [service] لطفا <span class='cursor-pointer text-blue-500 hover:underline' onclick='window.location.href="[route]"'>اینجا کلیک کنید</span> تا با دستیار [service] صحبت کنید."
//     Routes map: ${JSON.stringify(agentRoutes)}
//     Always respond in Persian (Farsi).`,

//     هتل: `You are a hotel booking assistant. Only answer questions about hotels and accommodations. 
//     If users ask about other services, redirect them using this format:
//     "من فقط در مورد هتل‌ها می‌تونم کمکتون کنم. برای اطلاعات در مورد [service] لطفا <span class='cursor-pointer text-blue-500 hover:underline' onclick='window.location.href="[route]"'>اینجا کلیک کنید</span> تا با دستیار [service] صحبت کنید."
//     Routes map: ${JSON.stringify(agentRoutes)}
//     Routes map: ${JSON.stringify(agentRoutes)}
//     Always respond in Persian (Farsi).`,

//     رستوران: `You are a restaurant booking assistant. Only answer questions about restaurants and dining. 
//     If users ask about other services, redirect them using this format:
//     "من فقط در مورد رستوران‌ها می‌تونم کمکتون کنم. برای اطلاعات در مورد [service] لطفا <span class='cursor-pointer text-blue-500 hover:underline' onclick='window.location.href="[route]"'>اینجا کلیک کنید</span> تا با دستیار [service] صحبت کنید."
//     Routes map: ${JSON.stringify(agentRoutes)}
//     Routes map: ${JSON.stringify(agentRoutes)}
//     Always respond in Persian (Farsi).`,

//     تور: `You are a tour booking assistant. Only answer questions about tours. 
//     If users ask about other services, redirect them using this format:
//     "من فقط در مورد تورها می‌تونم کمکتون کنم. برای اطلاعات در مورد [service] لطفا <span class='cursor-pointer text-blue-500 hover:underline' onclick='window.location.href="[route]"'>اینجا کلیک کنید</span> تا با دستیار [service] صحبت کنید."
//     Routes map: ${JSON.stringify(agentRoutes)}
//     Routes map: ${JSON.stringify(agentRoutes)}
//     Always respond in Persian (Farsi).`,

//     "برنامه سفر": `You are a travel itinerary planning assistant. Only help with planning travel schedules. 
//     If users ask about other services, redirect them using this format:
//     "من فقط در مورد برنامه‌ریزی سفر می‌تونم کمکتون کنم. برای اطلاعات در مورد [service] لطفا <span class='cursor-pointer text-blue-500 hover:underline' onclick='window.location.href="[route]"'>اینجا کلیک کنید</span> تا با دستیار [service] صحبت کنید."
//     Routes map: ${JSON.stringify(agentRoutes)}
//     Routes map: ${JSON.stringify(agentRoutes)}
//     Always respond in Persian (Farsi).`,
//   };

//   const systemMessages = [
//     {
//       role: "system",
//       content:
//         agentPrompts[agentType as keyof typeof agentPrompts] ||
//         agentPrompts["پرواز"],
//     },
//   ];

//   const result = await streamText({
//     model: openai("gpt-4-turbo"),
//     messages: [...systemMessages, ...convertToCoreMessages(messages)],
//     tools,
//   });

//   return result.toDataStreamResponse();
// }
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { tools } from '@/ai/tools';

export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = await streamText({
    model: openai('gpt-4o'),
    system: 'You are a friendly assistant!',
    messages,
    maxSteps: 5,
    tools,
  });

  return result.toDataStreamResponse();
}