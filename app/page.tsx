// import React from "react";
// import BotCard from "@/components/bot-card";
// import Link from "next/link";

// const MainPage = () => {
//   return (
//     <div className="flex flex-1 flex-col gap-4 p-4">
//       <div className="grid auto-rows-min gap-4 md:grid-cols-5">
//         <Link href="/agents/flight-agent">
//           <BotCard
//             title="پرواز"
//             description="پرواز مورد نظر خودتون رو رزرو کنید و سفر مطمينی رو تجربه کنید."
//             iconName="Plane"
//           />
//         </Link>
//         {/* <Link href="/agents/hotel-agent">
//           <BotCard
//             title="هتل"
//             description="برای اقامت خود از ما کمک بگیرید و اقامت دلنشینی داشته باشید."
//             iconName="House"
//           />
//         </Link>
//         <Link href="/agents/restaurant-agent">
//           <BotCard
//             title="رستوران"
//             description="برای انتخاب بهترین و مناسبترین رستوران با ما صحبت کنید."
//             iconName="UtensilsCrossed"
//           />
//         </Link>
//         <Link href="/agents/itinerary-agent">
//           <BotCard
//             title="برنامه سفر"
//             description="برنامه سفر خود را از ما بخواهید."
//             iconName="NotebookPen"
//           />
//         </Link>
//         <Link href="/agents/tour-agent">
//           <BotCard
//             title="تور"
//             description="تور مورد نظر خود را با مشورت ما انتخاب کنید."
//             iconName="Bus"
//           />
//         </Link> */}
//       </div>
//     </div>
//   );
// };

// export default MainPage;
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ChatInterface from "@/components/chat-interface";

const FlightAgent = () => {
  const router = useRouter();

  return (
    <ChatInterface
      chatId="1"
      agentType="پرواز"
      onBack={() => router.push("/")}
    />
  );
};

export default FlightAgent;
