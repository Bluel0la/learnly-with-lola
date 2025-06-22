
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, BookOpen, Brain } from 'lucide-react';

const features = [
  {
    icon: <MessageCircle className="h-12 w-12" />,
    title: "AI-Powered Chat",
    description: "Get instant help with homework, explanations, and personalized tutoring through our advanced AI assistant.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <BookOpen className="h-12 w-12" />,
    title: "Smart Flashcards",
    description: "Create and study with adaptive flashcards that adjust to your learning pace and track your progress.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: <Brain className="h-12 w-12" />,
    title: "Interactive Quizzes",
    description: "Test your knowledge with intelligent quizzes that provide detailed feedback and performance analytics.",
    color: "from-green-500 to-emerald-500"
  }
];

const LandingFeatures = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything you need to excel
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive suite of AI-powered tools adapts to your learning style and helps you achieve better results faster.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed text-center">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;
