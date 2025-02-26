
import React from 'react';
import { useChat } from '../contexts/ChatContext';

export const ChatMessages = () => {
  const { messages } = useChat();

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`chat-message ${
            message.sender === 'user' ? 'user-message' : 'ai-message'
          }`}
        >
          {message.content}
        </div>
      ))}
    </div>
  );
};
