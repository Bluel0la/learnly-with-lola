
import React from 'react';

const stats = [
  { number: "50K+", label: "Active Students" },
  { number: "98%", label: "Success Rate" },
  { number: "2M+", label: "Questions Answered" },
  { number: "4.9/5", label: "User Rating" }
];

const LandingStats = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900">{stat.number}</div>
              <div className="text-sm md:text-base text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingStats;
