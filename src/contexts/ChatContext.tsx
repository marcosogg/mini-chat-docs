
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  addDocument: (content: string, name: string) => void;
  clearChat: () => void;
  getDocumentsCount: () => number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchMessages();
    fetchDocuments();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(
        data.map((msg) => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender as 'user' | 'ai',
          timestamp: new Date(msg.created_at),
          isMarkdown: msg.is_markdown,
        }))
      );
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('content')
        .order('created_at', { ascending: true });

      if (error) throw error;

      setUploadedDocs(data.map(doc => doc.content));
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const toggleChat = () => setIsOpen(!isOpen);

  const addMessage = async (content: string, sender: 'user' | 'ai', isMarkdown = false) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            content,
            sender,
            is_markdown: isMarkdown,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const newMessage = {
        id: data.id,
        content,
        sender,
        timestamp: new Date(data.created_at),
        isMarkdown,
      };

      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      console.error('Error adding message:', error);
    }
  };

  const addDocument = async (content: string, name: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .insert([
          {
            content,
            name,
          },
        ]);

      if (error) throw error;

      setUploadedDocs((prev) => [...prev, content]);
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };

  const clearChat = async () => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all messages

      if (error) throw error;

      setMessages([]);
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
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
