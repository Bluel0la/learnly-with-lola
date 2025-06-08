
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onFileSelected: (file: File | null) => void;
  isLoading?: boolean;
  accept?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelected, 
  isLoading = false,
  accept = ".pdf,.doc,.docx,.txt"
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileSelected(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0] || null;
    onFileSelected(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  return (
    <Card className={`border-2 border-dashed transition-colors ${
      dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
    }`}>
      <CardContent 
        className="p-6"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            ) : (
              <Upload className="h-6 w-6 text-primary" />
            )}
          </div>
          <div>
            <p className="text-lg font-medium">
              {isLoading ? 'Processing file...' : 'Upload a file to generate flashcards'}
            </p>
            <p className="text-sm text-muted-foreground">
              Drag and drop or click to select
            </p>
          </div>
          <div>
            <input
              type="file"
              accept={accept}
              onChange={handleFileChange}
              disabled={isLoading}
              className="hidden"
              id="file-upload"
            />
            <Button asChild disabled={isLoading}>
              <label htmlFor="file-upload" className="cursor-pointer">
                Choose File
              </label>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
