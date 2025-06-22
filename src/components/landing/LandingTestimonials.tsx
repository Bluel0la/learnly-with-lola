
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Computer Science Student",
    content: "Learnly helped me improve my grades by 40%. The AI explanations are incredibly clear and the flashcards are perfect for memorization.",
    rating: 5
  },
  {
    name: "Marcus Johnson",
    role: "High School Student",
    content: "I went from struggling with math to being one of the top students in my class. The personalized quizzes really work!",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "Medical Student",
    content: "The adaptive learning system is amazing. It knows exactly what I need to review and when. Saved me countless hours of studying.",
    rating: 5
  }
];

const LandingTestimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Loved by students everywhere
          </h2>
          <p className="text-xl text-gray-600">
            See how Learnly is helping students achieve their academic goals
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-gray-300 mb-4" />
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingTestimonials;
