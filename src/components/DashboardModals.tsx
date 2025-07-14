import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Clock, DollarSign, Target, Copy, Share2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  referral_code: string;
  status: string;
  earnings_percentage: number;
  total_earnings: number;
  created_at: string;
  updated_at: string;
}

interface DashboardModalsProps {
  totalEarnedModal: boolean;
  setTotalEarnedModal: (open: boolean) => void;
  activeInvestmentsModal: boolean;
  setActiveInvestmentsModal: (open: boolean) => void;
  totalInvestmentModal: boolean;
  setTotalInvestmentModal: (open: boolean) => void;
  portfolioValueModal: boolean;
  setPortfolioValueModal: (open: boolean) => void;
  referralModal: boolean;
  setReferralModal: (open: boolean) => void;
  investments: Investment[];
  referralCode: string;
  referrals: Referral[];
  referralEarnings: number;
}

export const DashboardModals: React.FC<DashboardModalsProps> = ({
  totalEarnedModal,
  setTotalEarnedModal,
  activeInvestmentsModal,
  setActiveInvestmentsModal,
  totalInvestmentModal,
  setTotalInvestmentModal,
  portfolioValueModal,
  setPortfolioValueModal,
  referralModal,
  setReferralModal,
  investments,
  referralCode,
  referrals,
  referralEarnings
}) => {
  const { toast } = useToast();
  
  const totalEarned = investments.reduce((sum, inv) => sum + inv.total_earned, 0);
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const activeInvestments = investments.filter(inv => inv.status === 'active');

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/auth?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Referral link copied!",
      description: "Share this link to start earning 7% from referrals."
    });
  };

  const shareReferralLink = () => {
    const referralLink = `${window.location.origin}/auth?ref=${referralCode}`;
    const shareText = `Join Daily Yield Capital with my referral link and start earning up to 40% daily returns! ${referralLink}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Daily Yield Capital - High Yield Investment',
        text: shareText,
        url: referralLink
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Referral message copied!",
        description: "Share this message on social media or with friends."
      });
    }
  };

  return (
    <>
      {/* Total Earned Modal */}
      <Dialog open={totalEarnedModal} onOpenChange={setTotalEarnedModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Total Earnings Breakdown
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center p-6 bg-success/10 rounded-lg">
              <h3 className="text-3xl font-bold text-success">${totalEarned.toLocaleString()}</h3>
              <p className="text-muted-foreground">Total Earned from All Investments</p>
            </div>
            <div className="grid gap-4">
              {investments.map((investment) => (
                <Card key={investment.id} className="bg-secondary/20">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{investment.plan_name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${investment.amount.toLocaleString()} @ {investment.daily_rate}%/day
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-success">
                          ${investment.total_earned.toLocaleString()}
                        </p>
                        <Badge variant={investment.status === 'active' ? 'default' : 'secondary'}>
                          {investment.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Active Investments Modal */}
      <Dialog open={activeInvestmentsModal} onOpenChange={setActiveInvestmentsModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-warning" />
              Active Investments ({activeInvestments.length})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {activeInvestments.map((investment) => {
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

              const timeRemaining = calculateTimeRemaining(investment.maturity_date);
              const progress = calculateProgress(investment.start_date, investment.maturity_date);

              return (
                <Card key={investment.id} className="bg-secondary/20">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <Badge variant="outline" className="text-accent border-accent">
                            {investment.plan_name}
                          </Badge>
                          <Badge className="bg-success text-white">Active</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Investment:</span>
                            <span className="font-semibold">${investment.amount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Daily Rate:</span>
                            <span className="font-semibold text-success">{investment.daily_rate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Earned:</span>
                            <span className="font-semibold text-accent">${investment.total_earned.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-muted-foreground">Progress</span>
                            <span className="text-sm font-medium">{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">Time to Maturity</p>
                        <div className="flex justify-center gap-2">
                          <div className="bg-accent/20 rounded-lg p-3 min-w-[4rem]">
                            <div className="text-2xl font-bold text-accent">{timeRemaining.days}</div>
                            <div className="text-xs text-muted-foreground">days</div>
                          </div>
                          <div className="bg-accent/20 rounded-lg p-3 min-w-[4rem]">
                            <div className="text-2xl font-bold text-accent">{timeRemaining.hours}</div>
                            <div className="text-xs text-muted-foreground">hrs</div>
                          </div>
                          <div className="bg-accent/20 rounded-lg p-3 min-w-[4rem]">
                            <div className="text-2xl font-bold text-accent">{timeRemaining.minutes}</div>
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
        </DialogContent>
      </Dialog>

      {/* Total Investment Modal */}
      <Dialog open={totalInvestmentModal} onOpenChange={setTotalInvestmentModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-accent" />
              Total Investment Breakdown
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center p-6 bg-accent/10 rounded-lg">
              <h3 className="text-3xl font-bold text-accent">${totalInvested.toLocaleString()}</h3>
              <p className="text-muted-foreground">Total Amount Invested</p>
            </div>
            <div className="grid gap-4">
              {investments.map((investment) => (
                <Card key={investment.id} className="bg-secondary/20">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{investment.plan_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Started: {new Date(investment.start_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-accent">
                          ${investment.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-success">{investment.daily_rate}%/day</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Portfolio Value Modal */}
      <Dialog open={portfolioValueModal} onOpenChange={setPortfolioValueModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-400" />
              Portfolio Value Analysis
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="text-center p-6 bg-purple-500/10 rounded-lg">
              <h3 className="text-3xl font-bold text-purple-400">
                ${(totalInvested + totalEarned).toLocaleString()}
              </h3>
              <p className="text-muted-foreground">Total Portfolio Value</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-accent/10">
                <CardContent className="p-4 text-center">
                  <h4 className="text-xl font-bold text-accent">${totalInvested.toLocaleString()}</h4>
                  <p className="text-sm text-muted-foreground">Principal Investment</p>
                </CardContent>
              </Card>
              <Card className="bg-success/10">
                <CardContent className="p-4 text-center">
                  <h4 className="text-xl font-bold text-success">${totalEarned.toLocaleString()}</h4>
                  <p className="text-sm text-muted-foreground">Earnings Generated</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-secondary/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Portfolio Composition</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>ROI (Return on Investment):</span>
                  <span className="font-bold text-success">
                    {totalInvested > 0 ? ((totalEarned / totalInvested) * 100).toFixed(2) : '0'}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Active Investments:</span>
                  <span className="font-bold">{activeInvestments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Daily Rate:</span>
                  <span className="font-bold text-warning">
                    {activeInvestments.length > 0 
                      ? (activeInvestments.reduce((sum, inv) => sum + inv.daily_rate, 0) / activeInvestments.length).toFixed(2)
                      : '0'}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Referral Modal */}
      <Dialog open={referralModal} onOpenChange={setReferralModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              Referral Program - Earn 7% Commission
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Referral Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-accent/10">
                <CardContent className="p-4 text-center">
                  <h4 className="text-xl font-bold text-accent">{referrals.length}</h4>
                  <p className="text-sm text-muted-foreground">Total Referrals</p>
                </CardContent>
              </Card>
              <Card className="bg-success/10">
                <CardContent className="p-4 text-center">
                  <h4 className="text-xl font-bold text-success">${referralEarnings.toLocaleString()}</h4>
                  <p className="text-sm text-muted-foreground">Referral Earnings</p>
                </CardContent>
              </Card>
              <Card className="bg-warning/10">
                <CardContent className="p-4 text-center">
                  <h4 className="text-xl font-bold text-warning">7%</h4>
                  <p className="text-sm text-muted-foreground">Commission Rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Referral Link */}
            <Card className="bg-secondary/20">
              <CardHeader>
                <CardTitle className="text-lg">Your Referral Link</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-background rounded-lg border">
                  <code className="flex-1 text-sm">{window.location.origin}/auth?ref={referralCode}</code>
                  <Button size="sm" variant="outline" onClick={copyReferralLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button onClick={copyReferralLink} className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                  <Button onClick={shareReferralLink} variant="outline" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Share this link and earn 7% from every investment your referrals make!
                </p>
              </CardContent>
            </Card>

            {/* Referrals List */}
            <Card>
              <CardHeader>
                <CardTitle>Your Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                {referrals.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Referrals Yet</h3>
                    <p className="text-muted-foreground">Start sharing your referral link to earn commissions!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {referrals.map((referral, index) => (
                      <div key={referral.id} className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg">
                        <div>
                          <p className="font-medium">Referral #{index + 1}</p>
                          <p className="text-sm text-muted-foreground">
                            Joined: {new Date(referral.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-success">${referral.total_earnings.toLocaleString()}</p>
                          <Badge variant={referral.status === 'active' ? 'default' : 'secondary'}>
                            {referral.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card className="bg-gradient-to-r from-accent/10 to-success/10">
              <CardHeader>
                <CardTitle>How Referral Earnings Work</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-sm">Share your unique referral link with friends</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-sm">When they sign up and invest, you earn 7% of their investment profits</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <span className="text-sm">Earnings are credited to your account automatically</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-sm">No limit on how much you can earn from referrals</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};