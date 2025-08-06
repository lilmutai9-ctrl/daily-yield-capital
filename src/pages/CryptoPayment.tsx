import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Copy, ExternalLink, Bitcoin, Zap, Wallet, Info } from 'lucide-react';

const paymentMethods = [
  {
    name: 'Bitcoin (BTC)',
    address: '1G34ANDa8vBWrUFd3Pz8aopxuYCcgfQ6kk',
    icon: Bitcoin,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  {
    name: 'Ethereum (ETH)',
    address: '0xd11334f91e89eef052dd2d6feb401f45c890639f',
    icon: Zap,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    name: 'USDT (TRC20)',
    address: 'TPdhkjKLtYgVMDJKJGzaGgHZLcDjJsBx5J',
    icon: Wallet,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  }
];

const CryptoPayment = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  const tier = searchParams.get('tier');
  const amount = searchParams.get('amount');
  const rate = searchParams.get('rate');

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
    } catch (error) {
      console.error('Error checking user:', error);
      navigate('/auth');
    }
  };

  const copyToClipboard = (text: string, cryptoName: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${cryptoName} address copied to clipboard`
    });
  };

  const handlePaymentComplete = async () => {
    if (!tier || !amount || !rate) {
      toast({
        title: "Error",
        description: "Invalid investment parameters",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Create a deposit record instead of direct investment
      const { error } = await supabase
        .from('deposits')
        .insert({
          user_id: user.id,
          amount: parseFloat(amount),
          payment_method: 'Cryptocurrency',
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Payment Confirmation Submitted!",
        description: "Your deposit is pending admin approval. You'll be notified once confirmed."
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting deposit:', error);
      toast({
        title: "Error",
        description: "Failed to submit deposit. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => navigate('/invest')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Investment
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Cryptocurrency Payment</h1>
            <p className="text-muted-foreground">Send payment to complete your investment</p>
          </div>
        </div>

        {/* Investment Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Investment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center p-4 bg-secondary/20 rounded-lg">
              <div>
                <p className="font-semibold">{tier} Investment</p>
                <p className="text-sm text-muted-foreground">{rate}% daily returns</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${amount}</p>
                <Badge variant="outline" className="text-success border-success">
                  Investment Amount
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Send Payment To</CardTitle>
            <p className="text-sm text-muted-foreground">
              Choose any cryptocurrency below and send exactly ${amount} worth to the provided address
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <div
                    key={method.name}
                    className={`p-4 rounded-lg border-2 ${method.bgColor} ${method.borderColor}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className={`h-8 w-8 ${method.color}`} />
                        <div>
                          <h3 className="font-semibold text-lg">{method.name}</h3>
                          <p className="text-sm text-muted-foreground">Network: {method.name.includes('USDT') ? 'TRON (TRC20)' : method.name.split(' ')[0]}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(method.address, method.name)}
                        className="flex items-center gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        Copy
                      </Button>
                    </div>
                    <div className="mt-3 p-3 bg-white/50 rounded border break-all">
                      <code className="text-sm font-mono">{method.address}</code>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Payment Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <p>Copy the cryptocurrency address above</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <p>Send exactly <strong>${amount} worth</strong> of your chosen cryptocurrency</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <p>Click "I've Sent Payment" after completing the transaction</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold">4</div>
                <p>Wait for admin approval (usually within 24 hours)</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm">
                <strong>Important:</strong> Make sure to send the exact amount in USD value. 
                Your investment will be activated once the payment is confirmed by our admin team.
              </p>
            </div>

            {/* Wallet Setup Guide Link */}
            <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
              <div className="flex items-center gap-3 mb-2">
                <Info className="h-5 w-5 text-accent" />
                <h4 className="font-semibold">Don't have a crypto wallet?</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                New to cryptocurrency? Learn how to create a wallet and buy crypto in our comprehensive guide.
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate('/wallet-guide')}
                className="w-full"
              >
                Complete Wallet Setup Guide
              </Button>
            </div>

            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => navigate('/crypto-guide')}
                className="text-accent hover:text-accent/80"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Learn how to deposit cryptocurrency
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Confirm Payment */}
        <Card>
          <CardContent className="pt-6">
            <Button
              onClick={handlePaymentComplete}
              disabled={loading}
              className="w-full cta-button text-lg py-6"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </div>
              ) : (
                "I've Sent Payment"
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Only click this button after you have successfully sent the cryptocurrency payment.
              False confirmations may result in account suspension.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CryptoPayment;