
import React, { createContext, useContext, useState } from 'react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatContextType {
  isOpen: boolean;
  messages: Message[];
  uploadedDocs: string[];
  toggleChat: () => void;
  addMessage: (content: string, sender: 'user' | 'ai') => void;
  addDocument: (content: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);

  const toggleChat = () => setIsOpen(!isOpen);

  const addMessage = (content: string, sender: 'user' | 'ai') => {
    const newMessage = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const addDocument = (content: string) => {
    setUploadedDocs((prev) => [...prev, content]);
  };

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        messages,
        uploadedDocs,
        toggleChat,
        addMessage,
        addDocument,
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
