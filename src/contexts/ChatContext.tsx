
import React, { createContext, useContext, useState } from 'react';
import { marked } from 'marked';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isMarkdown?: boolean;
}

interface ChatContextType {
  isOpen: boolean;
  messages: Message[];
  uploadedDocs: string[];
  isLoading: boolean;
  toggleChat: () => void;
  addMessage: (content: string, sender: 'user' | 'ai', isMarkdown?: boolean) => void;
  addDocument: (content: string) => void;
  clearChat: () => void;
  getDocumentsCount: () => number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const addMessage = (content: string, sender: 'user' | 'ai', isMarkdown = false) => {
    const newMessage = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
      isMarkdown
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const addDocument = (content: string) => {
    setUploadedDocs((prev) => [...prev, content]);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const getDocumentsCount = () => uploadedDocs.length;

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        messages,
        uploadedDocs,
        isLoading,
        toggleChat,
        addMessage,
        addDocument,
        clearChat,
        getDocumentsCount,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
