
import React, { useEffect, useRef } from 'react';
import { useChat } from '../contexts/ChatContext';
import 'highlight.js/styles/github.css';
import { marked } from 'marked';

export const ChatMessages = () => {
  const { messages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderMessage = (content: string, isMarkdown: boolean = false) => {
    if (!isMarkdown) return content;
    
    const html = marked(content, {
      gfm: true,
      breaks: true
    });
    
    return (
      <div dangerouslySetInnerHTML={{ __html: html }} className="markdown-content" />
    );
  };

  return (
    <div className="space-y-4 overflow-y-auto">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`chat-message ${
            message.sender === 'user' ? 'user-message bg-primary text-white' : 'ai-message bg-gray-100'
          } p-3 rounded-lg`}
        >
          {renderMessage(message.content, message.isMarkdown)}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
