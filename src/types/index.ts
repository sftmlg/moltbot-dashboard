export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface Session {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  preview: string;
}

export interface DashboardStats {
  totalConversations: number;
  messagesThisWeek: number;
  avgResponseTime: string;
  activeTools: number;
}

export interface CustomComponent {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  prompt: string;
}
