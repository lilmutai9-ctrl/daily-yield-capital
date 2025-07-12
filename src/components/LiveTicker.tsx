import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';

const messages = [
  "💸 James Alexander Williams earned $2,540.00 today from his Forex investments",
  "🚀 Grace Elizabeth Thompson just withdrew $15,400.00 in under 2 minutes", 
  "📈 Linda Maria Rodriguez earned $7,850.50 from her $2,500 investment in 30 days",
  "💰 Michael Christopher Richardson made $3,275.75 in daily returns this week",
  "🎯 Sarah Katherine Johnson reached $25,750 from $8,000 investment in 45 days",
  "⚡ David Benjamin Lancaster withdrew $12,320.00 instantly to his Bitcoin wallet",
  "🔥 Emma Patricia Patterson earned $4,567.30 today from crypto arbitrage",
  "💎 Robert Anthony Montenegro hit Diamond tier with $345,500 total earnings",
  "🌟 Jessica Marie Williams made $8,945.20 profit this month",
  "🚀 Alexander Chen just earned $156,895.80 from Forex trading signals",
  "💵 Benjamin Carter withdrew $418,750.00 after 60 days of compounding",
  "🎊 Maria Isabella Gonzalez reached Platinum status with $722,300 portfolio",
  "⭐ Christopher Davis earned $65,422.15 from automated trading bots",
  "💎 Amanda Rose Foster just hit $535,890.00 from her initial $5,000 deposit",
  "🔥 Thomas William Anderson deposited $25,000 to Diamond tier",
  "💰 Jennifer Lynn Martinez withdrew $89,750.25 in Bitcoin",
  "📈 Robert James Wilson reinvested $45,680.50 for compounding",
  "🚀 Michelle Sarah Brown earned $234,567.80 in 90 days",
  "💸 Daniel Michael Taylor deposited $50,000 for VIP status",
  "⚡ Ashley Nicole Garcia withdrew $167,890.45 instantly",
  "🎯 Matthew David Miller reached $678,432.10 total balance",
  "💎 Stephanie Anne Moore deposited $75,000 to upgrade tier",
  "🌟 Anthony Joseph Clark earned $156,789.30 daily profit",
  "💵 Nicole Elizabeth Lewis withdrew $234,567.89 successfully",
  "🔥 Joshua Ryan Walker deposited $40,000 for Premium tier",
  "📈 Samantha Marie Hall reinvested $89,432.15 for growth",
  "🚀 Kevin Christopher Young earned $345,678.90 in profits",
  "💰 Melissa Dawn King withdrew $567,890.12 to bank account",
  "⭐ Brian Patrick Scott deposited $60,000 for Platinum access",
  "💸 Amanda Michelle Green earned $123,456.78 today",
  "🎊 Tyler Jonathan Adams withdrew $456,789.01 instantly",
  "💎 Rachel Lauren Nelson deposited $35,000 to VIP tier",
  "🔥 Cameron Lee Baker earned $234,567.45 in 30 days",
  "📈 Madison Hope Carter reinvested $178,901.23 for compounding",
  "🚀 Nathan Charles Mitchell withdrew $345,678.56 successfully",
  "💰 Olivia Grace Phillips deposited $80,000 for Diamond status",
  "⚡ Ethan Alexander Evans earned $456,789.78 total profit",
  "🌟 Hannah Victoria Turner withdrew $567,890.34 to crypto wallet",
  "💵 Jacob William Parker deposited $45,000 for Premium tier",
  "🎯 Emma Charlotte Edwards earned $234,567.12 in daily returns",
  "💎 Logan Christopher Collins withdrew $678,901.45 instantly",
  "🔥 Ava Elizabeth Stewart deposited $55,000 to Platinum tier",
  "📈 Mason Anthony Sanchez reinvested $123,456.89 for growth",
  "🚀 Sophia Isabella Morris earned $789,012.34 in 60 days",
  "💰 William James Rogers withdrew $345,678.90 successfully",
  "⭐ Isabella Rose Reed deposited $65,000 for VIP access",
  "💸 Alexander David Cook earned $456,789.56 today",
  "🎊 Mia Katherine Bailey withdrew $234,567.78 instantly",
  "💎 Benjamin Samuel Rivera deposited $90,000 for Diamond tier",
  "🔥 Charlotte Sophia Cooper earned $567,890.12 in profits",
  "📈 Elijah Michael Richardson reinvested $345,678.45 for compounding"
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
      <div className="max-w-7xl mx-auto px-4 py-2">
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