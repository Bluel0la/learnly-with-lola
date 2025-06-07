
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, UploadCloud, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUserProfile } from '@/hooks/useUserProfile';

const ChatHero = () => {
  const { toast } = useToast();
  const { profile } = useUserProfile();

  const handleAction = (action: string) => {
    toast({
      title: `${action} initiated`,
      description: "This feature is coming soon"
    });
  };

  const userName = profile?.first_name || 'there';

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 animate-fade-in">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-serif font-bold text-gray-800 mb-4">
          Hey {userName}! Ready to study something new today?
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Your AI learning assistant is here to help you with your studies.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <ActionButton 
            icon={<BookOpen className="h-5 w-5 mr-2" />}
            label="New Flashcard"
            onClick={() => handleAction("Flashcard creation")}
          />
          <ActionButton 
            icon={<UploadCloud className="h-5 w-5 mr-2" />}
            label="Upload Note"
            onClick={() => handleAction("Note upload")}
          />
          <ActionButton 
            icon={<Plus className="h-5 w-5 mr-2" />}
            label="Ask Math Question"
            onClick={() => handleAction("Math question")}
          />
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ 
  icon, 
  label, 
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void;
}) => {
  return (
    <Button 
      variant="outline" 
      className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700 p-6 h-auto flex items-center"
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
};

export default ChatHero;
