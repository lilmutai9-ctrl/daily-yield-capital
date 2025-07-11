import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';

const messages = [
  "💸 James N. earned $52.00 today",
  "🚀 Grace T. just withdrew $540.00",
  "📈 Linda O. earned $148.50 from her $100 investment",
  "💰 Michael R. made $85.75 in daily returns",
  "🎯 Sarah K. reached $1,250 from $800 investment",
  "⚡ David L. withdrew $320.00 instantly",
  "🔥 Emma P. earned $67.30 today",
  "💎 Robert M. hit Diamond tier with $1,500",
  "🌟 Jessica W. made $45.20 profit",
  "🚀 Alex C. just earned $95.80 from Forex"
];

export const LiveTicker = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-success to-accent text-white z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-3">
          <TrendingUp className="h-5 w-5 animate-bounce" />
          <div 
            className={`font-medium transition-all duration-300 ${
              isVisible ? 'opacity-100 transform-none' : 'opacity-0 transform translate-y-2'
            }`}
          >
            {messages[currentIndex]}
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse delay-100"></div>
            <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
};