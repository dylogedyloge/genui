// types/chat.ts
export type Message = {
  text: string;
  isUser: boolean;
  timestamp: Date;
  toolInvocations?: ToolInvocation[];
};

export type ToolInvocation = {
  toolName: string;
  toolCallId: string;
  state: "calling" | "result";
  result?: unknown;
};

export interface ChatInterfaceProps {
  agentType: string;
  chatId: string;
  userId: string;
  onBack: () => void;
}
