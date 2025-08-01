import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Eye, EyeOff, Upload } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signup');
  
  // Form states
  const [signupForm, setSignupForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    investmentAmount: ''
  });
  
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref');

  const plans = [
    { name: 'Starter', min: 10, max: 49, daily: 20, color: 'text-blue-400' },
    { name: 'Basic', min: 50, max: 199, daily: 25, color: 'text-green-400' },
    { name: 'Premium', min: 200, max: 999, daily: 30, color: 'text-purple-400' },
    { name: 'VIP', min: 1000, max: 4999, daily: 35, color: 'text-orange-400' },
    { name: 'Platinum', min: 5000, max: 19999, daily: 38, color: 'text-cyan-400' },
    { name: 'Diamond', min: 20000, max: 999999, daily: 40, color: 'text-yellow-400' }
  ];

  // Check if user is already logged in and listen for auth changes
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };
    
    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupForm.email,
        password: signupForm.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            first_name: signupForm.firstName,
            last_name: signupForm.lastName,
            phone: signupForm.phone,
            selected_plan: selectedPlan,
            investment_amount: signupForm.investmentAmount
          }
        }
      });

      if (error) {
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive"
        });
      } else if (data.user) {
        // Handle referral if present
        if (referralCode) {
          try {
            const { data: referrerData } = await supabase
              .from('referral_codes')
              .select('user_id')
              .eq('code', referralCode)
              .single();

            if (referrerData) {
              await supabase
                .from('referrals')
                .insert({
                  referrer_id: referrerData.user_id,
                  referred_id: data.user.id,
                  referral_code: referralCode
                });
            }
          } catch (refError) {
            console.error('Error processing referral:', refError);
          }
        }

        toast({
          title: "Account Created Successfully!",
          description: "Please check your email to verify your account."
        });
        
        // Redirect to dashboard after successful signup
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Welcome Back!",
          description: "You have successfully logged in."
        });
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
        redirectTo: `${window.location.origin}/dashboard`
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Password Reset Email Sent",
          description: "Check your email for the password reset link."
        });
        setShowForgotPassword(false);
        setForgotPasswordEmail('');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
                <form onSubmit={handleSignup} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name</label>
                      <Input 
                        value={signupForm.firstName}
                        onChange={(e) => setSignupForm({...signupForm, firstName: e.target.value})}
                        placeholder="John" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name</label>
                      <Input 
                        value={signupForm.lastName}
                        onChange={(e) => setSignupForm({...signupForm, lastName: e.target.value})}
                        placeholder="Doe" 
                        required 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <Input 
                      type="email" 
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                      placeholder="john@example.com" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <Input 
                      value={signupForm.phone}
                      onChange={(e) => setSignupForm({...signupForm, phone: e.target.value})}
                      placeholder="+1 (555) 123-4567" 
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                      placeholder="Create a strong password" 
                      required
                      minLength={6}
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
                          type="button"
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
                    <Input 
                      type="number" 
                      value={signupForm.investmentAmount}
                      onChange={(e) => setSignupForm({...signupForm, investmentAmount: e.target.value})}
                      placeholder="Enter amount ($50 minimum)" 
                      min="50" 
                      required 
                    />
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
                        <Button type="button" variant="outline" className="cursor-pointer" asChild>
                          <span>Choose File</span>
                        </Button>
                      </label>
                      {paymentProof && (
                        <p className="text-sm text-success mt-2">✓ {paymentProof.name}</p>
                      )}
                    </div>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full cta-button text-lg py-6">
                    {loading ? "Creating Account..." : "Create Account & Start Earning"}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By creating an account, you agree to our Terms of Service and Privacy Policy
                  </p>
                </form>
              </TabsContent>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-6">
                {!showForgotPassword ? (
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address</label>
                      <Input 
                        type="email" 
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                        placeholder="Enter your email" 
                        required 
                      />
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium mb-2">Password</label>
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                        placeholder="Enter your password" 
                        required
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
                        <input 
                          type="checkbox" 
                          checked={loginForm.rememberMe}
                          onChange={(e) => setLoginForm({...loginForm, rememberMe: e.target.checked})}
                          className="rounded" 
                        />
                        Remember me
                      </label>
                      <button 
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-accent hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full cta-button text-lg py-6">
                      {loading ? "Logging in..." : "Login to Dashboard"}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-6">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-medium">Reset Password</h3>
                      <p className="text-sm text-muted-foreground">
                        Enter your email address and we'll send you a link to reset your password.
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address</label>
                      <Input 
                        type="email" 
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        placeholder="Enter your email" 
                        required 
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowForgotPassword(false)}
                        className="flex-1"
                      >
                        Back to Login
                      </Button>
                      <Button type="submit" disabled={loading} className="flex-1 cta-button">
                        {loading ? "Sending..." : "Send Reset Link"}
                      </Button>
                    </div>
                  </form>
                )}
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