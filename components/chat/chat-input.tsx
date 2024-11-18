// components/chat/ChatInput.tsx
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
}) => (
  <div className="flex items-center gap-2">
    <Input
      type="text"
      value={input}
      onChange={onChange}
      placeholder="پیام خود را بنویسید..."
      className="flex-grow border-none"
      disabled={isLoading || error != null}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !isLoading && !error) {
          e.preventDefault();
          onSubmit();
        }
      }}
    />
    <Button
      size="icon"
      onClick={() => onSubmit()}
      disabled={isLoading || error != null}
    >
      <SendHorizontal className="w-4 h-4 -rotate-180" />
      <span className="sr-only">ارسال</span>
    </Button>
  </div>
);

export default ChatInput;
