import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export const EarningsCalculator = () => {
  const [investment, setInvestment] = useState<number>(100);
  const [dailyReturn, setDailyReturn] = useState<number>(30);
  const [results, setResults] = useState<{
    week: number;
    twoWeeks: number;
    month: number;
  }>({ week: 0, twoWeeks: 0, month: 0 });

  const getTier = (amount: number) => {
    if (amount >= 1000) return { name: 'Diamond', rate: 40, color: 'text-purple-400' };
    if (amount >= 500) return { name: 'Platinum', rate: 35, color: 'text-gray-300' };
    if (amount >= 100) return { name: 'Gold', rate: 30, color: 'text-warning' };
    if (amount >= 50) return { name: 'Silver', rate: 25, color: 'text-gray-400' };
    return { name: 'Starter', rate: 20, color: 'text-green-400' };
  };

  useEffect(() => {
    const tier = getTier(investment);
    setDailyReturn(tier.rate);
    
    const rate = tier.rate / 100;
    const week = investment * Math.pow(1 + rate, 7);
    const twoWeeks = investment * Math.pow(1 + rate, 14);
    const month = investment * Math.pow(1 + rate, 30);
    
    setResults({ week, twoWeeks, month });
  }, [investment]);

  const tier = getTier(investment);

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-accent to-primary-glow bg-clip-text text-transparent">
            Calculate Your Earnings
          </h2>
          <p className="text-xl text-muted-foreground">
            See how your investment grows with daily compounded returns
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Input */}
          <Card className="investment-card">
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="h-8 w-8 text-accent" />
              <h3 className="text-2xl font-bold">Investment Calculator</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Investment Amount ($)</label>
                <Input
                  type="number"
                  value={investment}
                  onChange={(e) => setInvestment(Number(e.target.value))}
                  min="10"
                  className="calculator-input text-xl"
                  placeholder="Enter amount..."
                />
              </div>
              
              <div className="bg-secondary rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Your Tier:</span>
                  <span className={`font-bold ${tier.color}`}>{tier.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Daily Return:</span>
                  <span className="text-2xl font-bold text-success">{tier.rate}%</span>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Results */}
          <Card className="investment-card">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="h-8 w-8 text-success" />
              <h3 className="text-2xl font-bold">Projected Earnings</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-secondary rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">7 Days</span>
                  <span className="text-xl font-bold text-success">
                    ${results.week.toFixed(2)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Profit: +${(results.week - investment).toFixed(2)}
                </div>
              </div>
              
              <div className="bg-secondary rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">14 Days</span>
                  <span className="text-xl font-bold text-success">
                    ${results.twoWeeks.toFixed(2)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Profit: +${(results.twoWeeks - investment).toFixed(2)}
                </div>
              </div>
              
              <div className="bg-secondary rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">30 Days</span>
                  <span className="text-xl font-bold text-success">
                    ${results.month.toFixed(2)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Profit: +${(results.month - investment).toFixed(2)}
                </div>
              </div>
            </div>
            
            <Button className="cta-button w-full mt-6">
              <DollarSign className="mr-2 h-5 w-5" />
              Start Investing Now
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};