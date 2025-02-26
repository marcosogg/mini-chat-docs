
import React, { useCallback } from 'react';
import { useChat } from '../contexts/ChatContext';
import { Upload } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export const FileUpload = () => {
  const { addDocument, messages, getDocumentsCount } = useChat();
  const { toast } = useToast();

  const handleFileDrop = useCallback(
    async (files: FileList | null) => {
      if (!files) return;

      const file = files[0];
      if (file.type !== 'text/markdown') {
        toast({
          title: "Invalid file type",
          description: "Please upload a markdown file",
          variant: "destructive",
        });
        return;
      }

      try {
        const text = await file.text();
        addDocument(text);
        toast({
          title: "Document uploaded",
          description: `Successfully loaded ${file.name}`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to process the document",
          variant: "destructive",
        });
      }
    },
    [addDocument, toast]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileDrop(e.dataTransfer.files);
  };

  if (messages.length > 0) return null;

  return (
    <div
      className="upload-area relative"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {getDocumentsCount() > 0 && (
        <div className="absolute top-2 right-2">
          <span className="bg-primary text-white px-2 py-1 rounded-full text-sm">
            {getDocumentsCount()} docs
          </span>
        </div>
      )}
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
