
import React, { useRef, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
import { FileUpload } from './FileUpload';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';

export const ChatWindow = () => {
  const { isOpen } = useChat();
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && windowRef.current) {
      windowRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={windowRef}
      className="chat-window flex flex-col"
      role="dialog"
      aria-label="Chat window"
    >
      <div className="h-12 bg-primary text-white flex items-center px-4 rounded-t-lg">
        <h2 className="font-semibold">MiniCom Assistant</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 max-h-[500px]">
        <FileUpload />
        <ChatMessages />
      </div>
      
      <ChatInput />
    </div>
  );
};
