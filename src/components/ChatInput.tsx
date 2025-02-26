
import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2 } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';
import { useToast } from '../hooks/use-toast';

export const ChatInput = () => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addMessage, uploadedDocs, clearChat } = useChat();
  const { toast } = useToast();

  const sendToOpenAI = async (userMessage: string, docs: string[]) => {
    try {
      const systemPrompt = `You are an Intercom Technical Support Engineer interview preparation assistant. Use the following documentation to answer the user's question accurately and professionally:

${docs.join('\n\n')}

User Question: ${userMessage}

Please respond in a clear, professional manner, using markdown formatting when appropriate for code snippets or technical explanations.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('OpenAI API request failed');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    if (uploadedDocs.length === 0) {
      toast({
        title: "No documentation loaded",
        description: "Please upload some documentation first",
        variant: "destructive",
      });
      return;
    }
    
    // Add user message
    await addMessage(input, 'user');
    setInput('');

    try {
      const aiResponse = await sendToOpenAI(input, uploadedDocs);
      await addMessage(aiResponse, 'ai', true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    }
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
      <button
        onClick={clearChat}
        className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
        title="Clear chat"
      >
        <Trash2 className="w-5 h-5" />
      </button>
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type your question..."
        className="chat-input flex-1"
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
