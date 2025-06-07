
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, FileUp, Search, BookOpen, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ResourcesPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleUpload = () => {
    toast({
      title: "Upload feature",
      description: "This feature is coming soon"
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Searching resources",
        description: `Search for "${searchQuery}"`
      });
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif font-bold">Resources</h1>
        <Button className="bg-primary hover:bg-primary/90" onClick={handleUpload}>
          <FileUp className="h-4 w-4 mr-2" /> Upload
        </Button>
      </div>
      
      <Card className="mb-8">
        <CardContent className="p-6">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search your documents..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </CardContent>
      </Card>
      
      <div className="mb-8">
        <h2 className="text-xl font-serif font-semibold mb-4">Recent Uploads</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResourceCard 
            title="Physics Notes.pdf" 
            type="PDF"
            date="May 10, 2025"
            icon={<FileText className="h-10 w-10 text-red-400" />}
          />
          <ResourceCard 
            title="Biology Chapter 3.docx" 
            type="DOCX"
            date="May 8, 2025"
            icon={<FileText className="h-10 w-10 text-blue-400" />}
          />
          
          {/* Upload card */}
          <Card className="border-dashed border-2 border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
            <CardContent className="flex items-center justify-center h-full p-6" onClick={handleUpload}>
              <div className="text-center">
                <FileUp className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <div className="text-sm text-gray-500">
                  Upload new document
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-serif font-semibold mb-4">AI Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AIResourceCard 
            title="Flashcard Generator" 
            description="Convert your notes into flashcards automatically"
            icon={<BookOpen className="h-6 w-6 text-accent" />}
          />
          <AIResourceCard 
            title="Math Problem Solver" 
            description="Step-by-step solutions to your math problems"
            icon={<Calculator className="h-6 w-6 text-green-500" />}
          />
        </div>
      </div>
    </div>
  );
};

const ResourceCard = ({ 
  title, 
  type,
  date,
  icon
}: { 
  title: string; 
  type: string;
  date: string;
  icon: React.ReactNode;
}) => {
  const { toast } = useToast();
  
  const handleClick = () => {
    toast({
      title: `Opening ${title}`,
      description: "This feature is coming soon"
    });
  };
  
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleClick}>
      <CardContent className="p-4 flex items-center">
        <div className="mr-4 flex-shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <div className="flex text-xs text-gray-500 space-x-3 mt-1">
            <span>{type}</span>
            <span>·</span>
            <span>{date}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AIResourceCard = ({ 
  title, 
  description,
  icon
}: { 
  title: string; 
  description: string;
  icon: React.ReactNode;
}) => {
  const { toast } = useToast();
  
  const handleClick = () => {
    toast({
      title: `Using ${title}`,
      description: "This feature is coming soon"
    });
  };
  
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleClick}>
      <CardContent className="p-6">
        <div className="flex items-center mb-2">
          {icon}
          <h3 className="font-medium ml-2">{title}</h3>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default ResourcesPage;
