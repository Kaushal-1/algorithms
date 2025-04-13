
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isCode?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  roadmapId?: string;
  experience?: string;
  topic?: string;
  messages: ChatMessage[];
  createdAt: Date;
}
