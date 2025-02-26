
import React from 'react';
import { ChatProvider } from '../contexts/ChatContext';
import { MessengerButton } from '../components/MessengerButton';
import { ChatWindow } from '../components/ChatWindow';

const Index = () => {
  return (
    <ChatProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            MiniCom - Intercom Interview Prep Assistant
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Upload Intercom documentation and chat with an AI assistant to prepare for your interview.
          </p>
        </div>
        <MessengerButton />
        <ChatWindow />
      </div>
    </ChatProvider>
  );
};

export default Index;
