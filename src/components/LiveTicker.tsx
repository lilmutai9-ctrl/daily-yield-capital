import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';

const messages = [
  "💸 James Alexander earned $2,540.00 today from his Forex investments",
  "🚀 Grace Thompson just withdrew $15,400.00 in under 2 minutes",
  "📈 Linda Rodriguez earned $7,850.50 from her $2,500 investment in 30 days",
  "💰 Michael Richardson made $3,275.75 in daily returns this week",
  "🎯 Sarah Katherine reached $25,750 from $8,000 investment in just 45 days",
  "⚡ David Lancaster withdrew $12,320.00 instantly to his Bitcoin wallet",
  "🔥 Emma Patterson earned $4,567.30 today from crypto arbitrage",
  "💎 Robert Montenegro hit Diamond tier with $45,500 total earnings",
  "🌟 Jessica Williams made $8,945.20 profit this month",
  "🚀 Alexander Chen just earned $6,895.80 from Forex trading signals",
  "💵 Benjamin Carter withdrew $18,750.00 after 60 days of compounding",
  "🎊 Maria Gonzalez reached Platinum status with $22,300 portfolio",
  "⭐ Christopher Davis earned $5,422.15 from automated trading bots",
  "💎 Amanda Foster just hit $35,890.00 from her initial $5,000 deposit"
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