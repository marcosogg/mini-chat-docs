
import React from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';

export const MessengerButton = () => {
  const { isOpen, toggleChat } = useChat();

  return (
    <div
      className="messenger-button"
      onClick={toggleChat}
      role="button"
      aria-label="Toggle chat"
    >
      {isOpen ? (
        <X className="w-6 h-6" />
      ) : (
        <MessageCircle className="w-6 h-6" />
      )}
    </div>
  );
};
