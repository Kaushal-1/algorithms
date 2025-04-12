
import { ChatSession, ChatMessage } from '@/types/ChatSession';

// This would normally interact with an API or database
// For now, we'll use localStorage for demonstration

const STORAGE_KEY = 'algorithm-ai-chat-sessions';

// Get all sessions
export const getAllSessions = (): ChatSession[] => {
  const sessionsJson = localStorage.getItem(STORAGE_KEY);
  if (!sessionsJson) return [];
  
  try {
    return JSON.parse(sessionsJson).map((session: any) => ({
      ...session,
      createdAt: new Date(session.createdAt),
      messages: session.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    }));
  } catch (error) {
    console.error('Error parsing sessions from localStorage:', error);
    return [];
  }
};

// Get a session by ID
export const getSessionById = (id: string): ChatSession | undefined => {
  const sessions = getAllSessions();
  const session = sessions.find(s => s.id === id);
  
  return session;
};

// Create a new session
export const createSession = (
  title: string,
  messages: ChatMessage[],
  domain?: string,
  experienceLevel?: string,
  roadmapId?: string
): ChatSession => {
  const sessions = getAllSessions();
  
  const newSession: ChatSession = {
    id: Date.now().toString(),
    title,
    createdAt: new Date(),
    messages,
    domain,
    experienceLevel,
    roadmapId
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify([newSession, ...sessions]));
  
  return newSession;
};

// Update an existing session
export const updateSession = (
  sessionId: string,
  updates: Partial<Omit<ChatSession, 'id'>>
): ChatSession | undefined => {
  const sessions = getAllSessions();
  const sessionIndex = sessions.findIndex(s => s.id === sessionId);
  
  if (sessionIndex === -1) return undefined;
  
  const updatedSession = {
    ...sessions[sessionIndex],
    ...updates
  };
  
  sessions[sessionIndex] = updatedSession;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  
  return updatedSession;
};

// Delete a session
export const deleteSession = (sessionId: string): boolean => {
  const sessions = getAllSessions();
  const filteredSessions = sessions.filter(s => s.id !== sessionId);
  
  if (filteredSessions.length === sessions.length) {
    return false; // No session found with that ID
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredSessions));
  return true;
};
