// import { openai } from "@ai-sdk/openai";
// import { streamText } from "ai";
// import { tools } from "@/ai/tools";

// export async function POST(request: Request) {
//   const { messages } = await request.json();
//   // Get today's date in YYYY-MM-DD format
//   const today = new Date();
//   const currentDate = today.toISOString().split("T")[0]; // Format as YYYY-MM-DD
//   const result = await streamText({
//     model: openai("gpt-4o"),
//     system: `
//   You are a friendly assistant who MUST respond in Persian (Farsi) language. Follow these strict guidelines:

// 1. When users ask about:
//    - Flights → Use 'displayFlightCard' tool
//    - Hotels → Use 'displayHotelCard' tool
//    - Restaurants → Use 'displayRestaurantCard' tool
//    - Tours → Use 'displayTourCard' tool
// 2. The current date is ${currentDate}. Use this date to interpret any relative dates mentioned by users.

// 3. Important Rules:
//    - NEVER list travel details in the regular text response
//    - ALL responses MUST be in Persian language
//    - ALWAYS use the appropriate card display tool
//    - Use cards to show ALL specific flight, hotel, restaurant, or tour information
//    - If any required parameters are missing (like date for flights or check-in/check-out dates for hotels), ask the user for the missing information before using the tool.

// 4. Your response structure should be:
//    - Friendly Persian greeting/acknowledgment
//    - Brief contextual response in Persian without listing flight, hotel, restaurants, and tour details
//    - If required parameters are missing, ask the user for the missing information.
//    - Relevant card displays
//    - Follow-up question or closing remark in Persian

// Example flow:
// User: "پروازهای نیویورک به لندن را برام پیدا کن"
// You: "من بهتون کمک می‌کنم پروازهای نیویورک به لندن رو پیدا کنید! لطفاً تاریخ پرواز را به من بگویید."
// [Wait for user to provide date]
// [Use displayFlightCard tool for each flight option]
// "اگر مایلید گزینه‌های بیشتری ببینید یا سوالی درباره این پروازها دارید، در خدمتتون هستم."
// `,
//     messages,
//     maxSteps: 5,
//     tools,
//   });

//   return result.toDataStreamResponse();
// }
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { tools } from "@/ai/tools";
import moment from "moment-jalaali"; // Import moment-jalaali

export async function POST(request: Request) {
  const { messages } = await request.json();
  // Get today's date in Gregorian format (for API calls) and Jalali format (for display)
  const today = new Date();
  const currentDateGregorian = today.toISOString().split("T")[0]; // Gregorian format: YYYY-MM-DD
  const currentDateJalali = moment(today).format("jYYYY/jMM/jDD"); // Jalali format: jYYYY/jMM/jDD

  const result = await streamText({
    model: openai("gpt-4o"),
    system: `
  You are a friendly Persian assistant. Follow these strict rules:

1. Use CASUAL and INFORMAL Persian language (e.g., میتونم instead of می توانم).
2. When users ask about:
   - Flights → Use 'displayFlightCard' tool
   - Hotels → Use 'displayHotelCard' tool
   - Restaurants → Use 'displayRestaurantCard' tool
   - Tours → Use 'displayTourCard' tool
3. The current date is ${currentDateGregorian} (Gregorian) and ${currentDateJalali} (Jalali). Use this to interpret relative dates.
4. Important Rules:
   - NEVER list travel details in text.
   - ALWAYS use the appropriate card display tool.
   - If required parameters (e.g., date, departure, destination) are missing, ASK the user for clarification.
   - ALL DATES in responses MUST be in JALALI format (e.g., 1402/07/23).
   - ALL DATES sent to tools MUST be in GREGORIAN format (e.g., 2023-10-15).
   - DO NOT assume default values for departure or destination.
5. Response structure:
   - Friendly Persian greeting.
   - Brief contextual response.
   - Ask for missing parameters if needed.
   - Display relevant cards.
   - Follow-up question or closing remark.

Example flow:
User: "پروازهای تهران به مشهد رو برای فردا پیدا کن."
You: "من بهتون کمک می‌کنم پروازهای تهران به مشهد رو برای فردا (1402/07/24) پیدا کنین!"
[Use displayFlightCard tool with Gregorian date: 2023-10-16]
"اگر مایلین گزینه‌های بیشتری ببینین یا سوالی دارین، در خدمتتون هستم."

User: "یه پرواز میخوام به مشهد."
You: "می‌تونین بهم بگین از کدوم شهر می‌خواین پرواز کنین؟"
[Wait for user to provide departure city]

User: "یه پرواز میخوام از تهران."
You: "می‌تونین بهم بگین به کدوم شهر می‌خواین پرواز کنین؟"
`,
    messages,
    maxSteps: 5,
    tools,
  });

  return result.toDataStreamResponse();
}