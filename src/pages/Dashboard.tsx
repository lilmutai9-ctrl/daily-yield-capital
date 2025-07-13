import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Wallet, 
  Clock, 
  BarChart3, 
  DollarSign, 
  ArrowUpRight,
  ArrowDownLeft,
  Timer,
  Target,
  LogOut
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Investment {
  id: string;
  plan_name: string;
  amount: number;
  daily_rate: number;
  start_date: string;
  maturity_date: string;
  status: string;
  total_earned: number;
}

interface Profile {
  first_name: string;
  last_name: string;
  phone: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }
      
      setUser(user);
      await Promise.all([loadProfile(user.id), loadInvestments(user.id)]);
    } catch (error) {
      console.error('Error checking user:', error);
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
      } else if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadInvestments = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error loading investments:', error);
      } else {
        setInvestments(data || []);
      }
    } catch (error) {
      console.error('Error loading investments:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive"
      });
    }
  };

  const calculateTimeRemaining = (maturityDate: string) => {
    const now = new Date();
    const maturity = new Date(maturityDate);
    const diff = maturity.getTime() - now.getTime();
    
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, minutes };
  };

  const calculateProgress = (startDate: string, maturityDate: string) => {
    const start = new Date(startDate);
    const maturity = new Date(maturityDate);
    const now = new Date();
    
    const totalDuration = maturity.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    
    return Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
  };

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalEarned = investments.reduce((sum, inv) => sum + inv.total_earned, 0);
  const activeInvestments = investments.filter(inv => inv.status === 'active').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {profile?.first_name || user?.email?.split('@')[0] || 'Investor'}!
            </h1>
            <p className="text-muted-foreground">Monitor your investments and track your earnings</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Invested</p>
                  <p className="text-2xl font-bold text-accent">${totalInvested.toLocaleString()}</p>
                </div>
                <Wallet className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-success/10 to-success/5 border-success/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Earned</p>
                  <p className="text-2xl font-bold text-success">${totalEarned.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-warning/10 to-warning/5 border-warning/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Investments</p>
                  <p className="text-2xl font-bold text-warning">{activeInvestments}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Portfolio Value</p>
                  <p className="text-2xl font-bold text-purple-400">${(totalInvested + totalEarned).toLocaleString()}</p>
                </div>
                <Target className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Button className="cta-button p-6 h-auto flex flex-col items-center gap-2" onClick={() => navigate('/auth')}>
            <ArrowUpRight className="h-8 w-8" />
            <span className="text-lg">New Investment</span>
          </Button>
          
          <Button variant="outline" className="p-6 h-auto flex flex-col items-center gap-2 border-success text-success hover:bg-success/10">
            <ArrowDownLeft className="h-8 w-8" />
            <span className="text-lg">Request Withdrawal</span>
          </Button>
          
          <Button variant="outline" className="p-6 h-auto flex flex-col items-center gap-2" onClick={() => navigate('/support')}>
            <Timer className="h-8 w-8" />
            <span className="text-lg">Contact Support</span>
          </Button>
        </div>

        {/* Active Investments */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Active Investments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {investments.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Active Investments</h3>
                <p className="text-muted-foreground mb-6">Start your investment journey today and begin earning daily returns!</p>
                <Button className="cta-button" onClick={() => navigate('/auth')}>
                  Make Your First Investment
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {investments.map((investment) => {
                  const timeRemaining = calculateTimeRemaining(investment.maturity_date);
                  const progress = calculateProgress(investment.start_date, investment.maturity_date);
                  const projectedEarnings = (investment.amount * investment.daily_rate / 100) * 30; // 30 day projection
                  
                  return (
                    <Card key={investment.id} className="bg-secondary/20 border border-border/50">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              <Badge variant="outline" className="text-accent border-accent">
                                {investment.plan_name}
                              </Badge>
                              <Badge 
                                variant={investment.status === 'active' ? 'default' : 'secondary'}
                                className={investment.status === 'active' ? 'bg-success text-white' : ''}
                              >
                                {investment.status}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Investment</p>
                                <p className="text-lg font-semibold">${investment.amount.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Daily Rate</p>
                                <p className="text-lg font-semibold text-success">{investment.daily_rate}%</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Earned</p>
                                <p className="text-lg font-semibold text-accent">${investment.total_earned.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Projected (30d)</p>
                                <p className="text-lg font-semibold text-warning">${projectedEarnings.toLocaleString()}</p>
                              </div>
                            </div>
                            
                            <div className="mb-2">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-muted-foreground">Progress</span>
                                <span className="text-sm font-medium">{Math.round(progress)}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                          </div>
                          
                          <div className="text-center lg:text-right">
                            <p className="text-sm text-muted-foreground mb-2">Time to Maturity</p>
                            <div className="flex justify-center lg:justify-end gap-2 text-2xl font-bold">
                              <div className="bg-accent/20 rounded-lg p-2 min-w-[3rem]">
                                <div className="text-accent">{timeRemaining.days}</div>
                                <div className="text-xs text-muted-foreground">days</div>
                              </div>
                              <div className="bg-accent/20 rounded-lg p-2 min-w-[3rem]">
                                <div className="text-accent">{timeRemaining.hours}</div>
                                <div className="text-xs text-muted-foreground">hrs</div>
                              </div>
                              <div className="bg-accent/20 rounded-lg p-2 min-w-[3rem]">
                                <div className="text-accent">{timeRemaining.minutes}</div>
                                <div className="text-xs text-muted-foreground">min</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {investments.slice(0, 5).map((investment, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-secondary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <p className="font-medium">{investment.plan_name} Investment</p>
                      <p className="text-sm text-muted-foreground">
                        Started {new Date(investment.start_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${investment.amount.toLocaleString()}</p>
                    <p className="text-sm text-success">+{investment.daily_rate}% daily</p>
                  </div>
                </div>
              ))}
              
              {investments.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;