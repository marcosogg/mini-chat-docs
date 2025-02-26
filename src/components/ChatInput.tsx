
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';

export const ChatInput = () => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addMessage, uploadedDocs } = useChat();

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    addMessage(input, 'user');
    setInput('');

    // Simple AI response for now
    const aiResponse = "Thanks for your question! The AI integration will be implemented soon.";
    setTimeout(() => {
      addMessage(aiResponse, 'ai');
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div className="border-t border-gray-200 p-4 flex items-end gap-2">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type your question..."
        className="chat-input"
        rows={1}
        style={{ maxHeight: '120px' }}
      />
      <button
        onClick={handleSubmit}
        disabled={!input.trim()}
        className="p-2 text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
};
