
import React, { useCallback } from 'react';
import { useChat } from '../contexts/ChatContext';
import { Upload } from 'lucide-react';

export const FileUpload = () => {
  const { addDocument, messages } = useChat();

  const handleFileDrop = useCallback(
    async (files: FileList | null) => {
      if (!files) return;

      const file = files[0];
      if (file.type !== 'text/markdown') {
        alert('Please upload a markdown file');
        return;
      }

      const text = await file.text();
      addDocument(text);
    },
    [addDocument]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileDrop(e.dataTransfer.files);
  };

  // Only show upload area if no messages exist
  if (messages.length > 0) return null;

  return (
    <div
      className="upload-area"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <p className="text-gray-600 mb-2">
        Drag and drop your Intercom documentation here
      </p>
      <p className="text-sm text-gray-500">or</p>
      <input
        type="file"
        accept=".md"
        className="hidden"
        id="file-upload"
        onChange={(e) => handleFileDrop(e.target.files)}
      />
      <label
        htmlFor="file-upload"
        className="inline-block mt-2 px-4 py-2 bg-primary text-white rounded-md cursor-pointer hover:brightness-105 transition-colors"
      >
        Choose a file
      </label>
    </div>
  );
};
