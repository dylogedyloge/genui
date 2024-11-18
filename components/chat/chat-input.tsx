// // components/chat/ChatInput.tsx
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { SendHorizontal } from "lucide-react";

// interface ChatInputProps {
//   input: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onSubmit: (e?: React.FormEvent) => Promise<void>;
//   isLoading: boolean;
//   error: Error | null;
// }

// const ChatInput: React.FC<ChatInputProps> = ({
//   input,
//   onChange,
//   onSubmit,
//   isLoading,
//   error,
// }) => (
//   <div className="flex items-center gap-2">
//     <Input
//       type="text"
//       value={input}
//       onChange={onChange}
//       placeholder="پیام خود را بنویسید..."
//       className="flex-grow border-none"
//       disabled={isLoading || error != null}
//       onKeyDown={(e) => {
//         if (e.key === "Enter" && !isLoading && !error) {
//           e.preventDefault();
//           onSubmit();
//         }
//       }}
//     />
//     <Button
//       size="icon"
//       onClick={() => onSubmit()}
//       disabled={isLoading || error != null}
//     >
//       <SendHorizontal className="w-4 h-4 -rotate-180" />
//       <span className="sr-only">ارسال</span>
//     </Button>
//   </div>
// );

// export default ChatInput;
import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";

interface ChatInputProps {
  input: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e?: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  onChange,
  onSubmit,
  isLoading,
  error,
}) => {
  // Add ref to focus on the input
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Focus input after message submission
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await onSubmit();
    if (inputRef.current) {
      inputRef.current.focus(); // Refocus input after submission
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        ref={inputRef}  // Attach the ref to the input element
        type="text"
        value={input}
        onChange={onChange}
        placeholder="پیام خود را بنویسید..."
        className="flex-grow border-none"
        disabled={isLoading || error != null}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !isLoading && !error) {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />
      <Button
        size="icon"
        onClick={() => handleSubmit()}  // Call the custom handleSubmit
        disabled={isLoading || error != null}
      >
        <SendHorizontal className="w-4 h-4 -rotate-180" />
        <span className="sr-only">ارسال</span>
      </Button>
    </div>
  );
};

export default ChatInput;