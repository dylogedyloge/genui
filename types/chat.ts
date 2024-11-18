export type Message = {
  role: string;
  content?: string;
  text?: string;
  timestamp: Date | string | number; 
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
