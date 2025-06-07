
import React from 'react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to StudyAI
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your intelligent study companion for better learning
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Chat</h3>
              <p className="text-gray-600">Interactive learning conversations</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Flashcards</h3>
              <p className="text-gray-600">Create and study flashcard decks</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Quizzes</h3>
              <p className="text-gray-600">Test your knowledge with scoring</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
