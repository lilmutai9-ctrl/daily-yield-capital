import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { InvestmentTiers } from '@/components/InvestmentTiers';
import { PaymentMethods } from '@/components/PaymentMethods';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Crown, Star, Award, Diamond, Zap, ArrowLeft, Calculator, CheckCircle } from 'lucide-react';

const tiers = [
  { name: 'Starter', min: 10, max: 49, rate: 20, icon: Zap, color: 'text-green-400' },
  { name: 'Silver', min: 50, max: 99, rate: 25, icon: Star, color: 'text-gray-400' },
  { name: 'Gold', min: 100, max: 499, rate: 30, icon: Award, color: 'text-warning' },
  { name: 'Platinum', min: 500, max: 999, rate: 35, icon: Crown, color: 'text-gray-300' },
  { name: 'Diamond', min: 1000, max: 999999, rate: 40, icon: Diamond, color: 'text-purple-400' },
];

const Invest = () => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [selectedTier, setSelectedTier] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    checkUser();
    
    // Check for tier selection from URL
    const tierParam = searchParams.get('tier');
    if (tierParam) {
      const tier = tiers.find(t => t.name.toLowerCase() === tierParam.toLowerCase());
      if (tier) {
        setSelectedTier(tier);
        setAmount(tier.min.toString());
        setStep(2);
      }
    }
  }, [searchParams]);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
      navigate('/auth');
    }
  };

  const getTierForAmount = (investmentAmount: number) => {
    return tiers.find(tier => investmentAmount >= tier.min && investmentAmount <= tier.max);
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    const numAmount = parseFloat(value) || 0;
    const tier = getTierForAmount(numAmount);
    setSelectedTier(tier);
  };

  const calculateProjections = () => {
    if (!selectedTier || !amount) return null;
    
    const investmentAmount = parseFloat(amount);
    const dailyRate = selectedTier.rate / 100;
    
    return {
      daily: investmentAmount * dailyRate,
      weekly: investmentAmount * dailyRate * 7,
      monthly: investmentAmount * dailyRate * 30,
      yearly: investmentAmount * dailyRate * 365
    };
  };

  const handleTierSelect = (tier: any) => {
    setSelectedTier(tier);
    setAmount(tier.min.toString());
    setStep(2);
  };

  const handleInvestment = async () => {
    if (!selectedTier || !amount) {
      toast({
        title: "Error",
        description: "Please select an investment amount",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Calculate maturity date (30 days from now)
      const maturityDate = new Date();
      maturityDate.setDate(maturityDate.getDate() + 30);

      const { error } = await supabase
        .from('investments')
        .insert({
          user_id: user.id,
          plan_name: selectedTier.name,
          amount: parseFloat(amount),
          daily_rate: selectedTier.rate,
          maturity_date: maturityDate.toISOString(),
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Investment Successful!",
        description: `Your ${selectedTier.name} investment of $${amount} has been activated.`
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating investment:', error);
      toast({
        title: "Error",
        description: "Failed to create investment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const projections = calculateProjections();

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => step > 1 ? setStep(step - 1) : navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {step > 1 ? 'Back' : 'Dashboard'}
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Start Your Investment</h1>
            <p className="text-muted-foreground">Choose your investment tier and amount</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-accent text-accent-foreground' : 'bg-muted'}`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-accent' : 'bg-muted'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-accent text-accent-foreground' : 'bg-muted'}`}>
              2
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-accent' : 'bg-muted'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-accent text-accent-foreground' : 'bg-muted'}`}>
              3
            </div>
          </div>
        </div>

        {/* Step 1: Select Tier */}
        {step === 1 && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Investment Tier</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tiers.map((tier) => {
                    const Icon = tier.icon;
                    return (
                      <Card 
                        key={tier.name}
                        className={`cursor-pointer hover:scale-105 transition-all duration-300 ${tier.color.includes('warning') ? 'border-warning bg-warning/10' : 'bg-secondary/20'}`}
                        onClick={() => handleTierSelect(tier)}
                      >
                        <CardContent className="p-6 text-center">
                          <Icon className={`h-12 w-12 mx-auto mb-4 ${tier.color}`} />
                          <h3 className={`text-xl font-bold mb-2 ${tier.color}`}>{tier.name}</h3>
                          <p className="text-muted-foreground mb-2">${tier.min} - ${tier.max === 999999 ? '∞' : tier.max}</p>
                          <p className="text-2xl font-bold text-success">{tier.rate}%<span className="text-sm">/day</span></p>
                          <Button className="w-full mt-4" variant={tier.color.includes('warning') ? 'default' : 'outline'}>
                            Select Tier
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            <InvestmentTiers />
          </div>
        )}

        {/* Step 2: Enter Amount */}
        {step === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Investment Amount
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Investment Amount (USD)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="Enter amount"
                    className="text-xl text-center"
                  />
                  {selectedTier && (
                    <div className="text-center">
                      <Badge variant="outline" className={`${selectedTier.color} border-current`}>
                        {selectedTier.name} Tier - {selectedTier.rate}% Daily
                      </Badge>
                    </div>
                  )}
                </div>

                {projections && (
                  <Card className="bg-gradient-to-r from-accent/10 to-success/10">
                    <CardHeader>
                      <CardTitle className="text-center">Projected Returns</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-success">${projections.daily.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">Daily</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-success">${projections.weekly.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">Weekly</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-success">${projections.monthly.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">Monthly</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-success">${projections.yearly.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">Yearly</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button 
                    onClick={() => setStep(3)} 
                    className="flex-1 cta-button"
                    disabled={!selectedTier || !amount || parseFloat(amount) < selectedTier.min}
                  >
                    Continue to Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Payment & Confirmation */}
        {step === 3 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Investment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-secondary/20 rounded-lg">
                    <div>
                      <p className="font-semibold">{selectedTier?.name} Investment</p>
                      <p className="text-sm text-muted-foreground">{selectedTier?.rate}% daily returns</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">${amount}</p>
                      <p className="text-sm text-success">+${projections?.daily.toFixed(2)}/day</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Investment Period</p>
                      <p className="font-bold">30 Days</p>
                    </div>
                    <div className="p-3 bg-success/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Expected Return</p>
                      <p className="font-bold text-success">${projections?.monthly.toFixed(2)}</p>
                    </div>
                    <div className="p-3 bg-warning/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Value</p>
                      <p className="font-bold text-warning">${(parseFloat(amount) + (projections?.monthly || 0)).toFixed(2)}</p>
                    </div>
                  </div>

                  <Button 
                    onClick={handleInvestment}
                    disabled={loading}
                    className="w-full cta-button text-lg py-6"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing Investment...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Confirm Investment
                      </div>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By confirming this investment, you agree to our terms and conditions. 
                    Your investment will be activated immediately and start earning daily returns.
                  </p>
                </div>
              </CardContent>
            </Card>

            <PaymentMethods />
          </div>
        )}
      </div>
    </div>
  );
};

export default Invest;