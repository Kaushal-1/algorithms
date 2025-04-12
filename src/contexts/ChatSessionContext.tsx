
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatSession, ChatMessage } from '@/types/ChatSession';
import * as chatSessionService from '@/services/chatSessionService';

interface ChatSessionContextType {
  sessions: ChatSession[];
  activeSession: ChatSession | null;
  loadSession: (sessionId: string) => void;
  createNewSession: (
    title: string,
    messages: ChatMessage[],
    domain?: string,
    experienceLevel?: string,
    roadmapId?: string
  ) => ChatSession;
  updateActiveSession: (updates: Partial<Omit<ChatSession, 'id'>>) => void;
  deleteSession: (sessionId: string) => void;
  resetActiveSession: () => void;
}

const ChatSessionContext = createContext<ChatSessionContextType | undefined>(undefined);

export const ChatSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  
  // Load all sessions on mount
  useEffect(() => {
    const loadedSessions = chatSessionService.getAllSessions();
    setSessions(loadedSessions);
  }, []);
  
  const loadSession = (sessionId: string) => {
    const session = chatSessionService.getSessionById(sessionId);
    if (session) {
      setActiveSession(session);
    }
  };
  
  const createNewSession = (
    title: string,
    messages: ChatMessage[],
    domain?: string,
    experienceLevel?: string,
    roadmapId?: string
  ) => {
    const newSession = chatSessionService.createSession(
      title,
      messages,
      domain,
      experienceLevel,
      roadmapId
    );
    
    setSessions(prev => [newSession, ...prev]);
    setActiveSession(newSession);
    return newSession;
  };
  
  const updateActiveSession = (updates: Partial<Omit<ChatSession, 'id'>>) => {
    if (!activeSession) return;
    
    const updatedSession = chatSessionService.updateSession(activeSession.id, updates);
    
    if (updatedSession) {
      setActiveSession(updatedSession);
      setSessions(prev => 
        prev.map(s => s.id === updatedSession.id ? updatedSession : s)
      );
    }
  };
  
  const deleteSession = (sessionId: string) => {
    const deleted = chatSessionService.deleteSession(sessionId);
    
    if (deleted) {
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      
      if (activeSession?.id === sessionId) {
        setActiveSession(null);
      }
    }
  };
  
  const resetActiveSession = () => {
    setActiveSession(null);
  };
  
  return (
    <ChatSessionContext.Provider
      value={{
        sessions,
        activeSession,
        loadSession,
        createNewSession,
        updateActiveSession,
        deleteSession,
        resetActiveSession
      }}
    >
      {children}
    </ChatSessionContext.Provider>
  );
};

export const useChatSessions = () => {
  const context = useContext(ChatSessionContext);
  if (context === undefined) {
    throw new Error('useChatSessions must be used within a ChatSessionProvider');
  }
  return context;
};
