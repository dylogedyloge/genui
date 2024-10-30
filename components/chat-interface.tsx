// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { ArrowRight, SendHorizontal } from "lucide-react";
// import { Input } from "@/components/ui/input";

// type Message = {
//   text: string;
//   isUser: boolean;
//   timestamp: Date;
// };

// interface ChatInterfaceProps {
//   agentType: string;
//   onBack: () => void;
// }

// const ChatInterface: React.FC<ChatInterfaceProps> = ({ agentType, onBack }) => {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       text: `سلام من دستیار ${agentType} شما هستم. چطور می تونم کمکتون کنم؟`,
//       isUser: false,
//       timestamp: new Date(),
//     },
//   ]);
//   const [inputMessage, setInputMessage] = useState("");

//   const handleSendMessage = () => {
//     if (inputMessage.trim()) {
//       setMessages([
//         ...messages,
//         { text: inputMessage, isUser: true, timestamp: new Date() },
//       ]);
//       setInputMessage("");
//       // Here you would typically call an API to get the bot's response
//       setTimeout(() => {
//         setMessages((prev) => [
//           ...prev,
//           {
//             text: "بزودی کارشناسان ما با شما تماس می گیرند",
//             isUser: false,
//             timestamp: new Date(),
//           },
//         ]);
//       }, 1000);
//     }
//   };

//   return (
//     <div className="flex flex-col h-full p-4">
//       <Button variant="secondary" className="self-end mb-4" onClick={onBack}>
//         <ArrowRight className="w-4 h-4 mr-6" />
//         برگشت
//       </Button>
//       <div className="flex-grow overflow-auto space-y-4 mb-4">
//         {messages.map((message, index) => (
//           <div
//             key={index}
//             className={`flex ${
//               message.isUser ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`max-w-[70%] p-3 rounded-lg ${
//                 message.isUser
//                   ? "bg-primary text-primary-foreground"
//                   : "bg-secondary text-secondary-foreground"
//               }`}
//             >
//               <p className="text-sm">{message.text}</p>
//               <p className="text-xs mt-1 opacity-50">
//                 {message.timestamp.toLocaleTimeString()}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="p-4">
//         <div className="flex items-center gap-2">
//           <Input
//             type="text"
//             value={inputMessage}
//             onChange={(e) => setInputMessage(e.target.value)}
//             placeholder="پیام خود را بنویسید..."
//             className="flex-grow border-none"
//             onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//           />
//           <Button size="icon" onClick={handleSendMessage}>
//             <SendHorizontal className="w-4 h-4 -rotate-180" />
//             <span className="sr-only">ارسال</span>
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatInterface;
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, SendHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/utils/supabase-client";

type Message = {
  text: string;
  isUser: boolean;
  timestamp: Date;
};

interface ChatInterfaceProps {
  agentType: string;
  chatId: string;
  onBack: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  agentType,
  chatId,
  onBack,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(data || []);
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const newMessage = {
        chat_id: chatId,
        content: inputMessage,
        is_user: true,
      };

      const { error } = await supabase.from("messages").insert(newMessage);

      if (error) {
        console.error("Error sending message:", error);
      } else {
        setInputMessage("");
        fetchMessages(); // Refetch messages to include the new one

        // Simulate bot response
        setTimeout(async () => {
          const botResponse = {
            chat_id: chatId,
            content: "بزودی کارشناسان ما با شما تماس می گیرند",
            is_user: false,
          };
          await supabase.from("messages").insert(botResponse);
          fetchMessages(); // Refetch messages to include bot response
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col p-4 h-full">
      <Button variant="secondary" className="self-end mb-4" onClick={onBack}>
        <ArrowRight className="w-4 h-4 mr-6" />
        برگشت
      </Button>
      <div className="flex-grow overflow-auto space-y-4 mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.isUser
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs mt-1 opacity-50">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="پیام خود را بنویسید..."
            className="flex-grow border-none"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button size="icon" onClick={handleSendMessage}>
            <SendHorizontal className="w-4 h-4 -rotate-180" />
            <span className="sr-only">ارسال</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
