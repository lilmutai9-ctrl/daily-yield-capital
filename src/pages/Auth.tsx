import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Eye, EyeOff, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);

  const plans = [
    { name: 'Starter', min: 10, max: 49, daily: 20, color: 'text-blue-400' },
    { name: 'Basic', min: 50, max: 199, daily: 25, color: 'text-green-400' },
    { name: 'Premium', min: 200, max: 999, daily: 30, color: 'text-purple-400' },
    { name: 'VIP', min: 1000, max: 4999, daily: 35, color: 'text-orange-400' },
    { name: 'Platinum', min: 5000, max: 19999, daily: 38, color: 'text-cyan-400' },
    { name: 'Diamond', min: 20000, max: 999999, daily: 40, color: 'text-yellow-400' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-4">
            <TrendingUp className="h-8 w-8 text-accent" />
            <span className="bg-gradient-to-r from-accent to-success bg-clip-text text-transparent">
              Daily Yield Capital
            </span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Join Thousands of Successful Investors</h1>
          <p className="text-muted-foreground">Start earning daily returns today</p>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
          <CardContent className="p-8">
            <Tabs defaultValue="signup" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="signup">Create Account</TabsTrigger>
                <TabsTrigger value="login">Login</TabsTrigger>
              </TabsList>

              {/* Sign Up Tab */}
              <TabsContent value="signup" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <Input placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <Input placeholder="Doe" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <Input type="email" placeholder="john@example.com" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input placeholder="+1 (555) 123-4567" />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Create a strong password" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {/* Investment Plan Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3">Choose Your Investment Plan</label>
                  <div className="grid grid-cols-2 gap-3">
                    {plans.map((plan) => (
                      <button
                        key={plan.name}
                        onClick={() => setSelectedPlan(plan.name)}
                        className={`p-4 rounded-lg border transition-all ${
                          selectedPlan === plan.name 
                            ? 'border-accent bg-accent/10' 
                            : 'border-border hover:border-accent/50'
                        }`}
                      >
                        <div className={`font-bold ${plan.color}`}>{plan.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ${plan.min.toLocaleString()} - ${plan.max.toLocaleString()}
                        </div>
                        <div className="text-sm font-medium">{plan.daily}% Daily</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Initial Investment Amount</label>
                  <Input type="number" placeholder="Enter amount ($50 minimum)" min="50" />
                  <p className="text-xs text-muted-foreground mt-1">Minimum withdrawal: $50</p>
                </div>

                {/* Payment Proof Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">Upload Payment Proof</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload screenshot of your deposit/transfer
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="payment-proof"
                    />
                    <label htmlFor="payment-proof">
                      <Button variant="outline" className="cursor-pointer" asChild>
                        <span>Choose File</span>
                      </Button>
                    </label>
                    {paymentProof && (
                      <p className="text-sm text-success mt-2">✓ {paymentProof.name}</p>
                    )}
                  </div>
                </div>

                <Button className="w-full cta-button text-lg py-6">
                  Create Account & Start Earning
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
              </TabsContent>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <Input type="email" placeholder="Enter your email" />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    Remember me
                  </label>
                  <a href="#" className="text-sm text-accent hover:underline">
                    Forgot password?
                  </a>
                </div>

                <Button className="w-full cta-button text-lg py-6">
                  Login to Dashboard
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;