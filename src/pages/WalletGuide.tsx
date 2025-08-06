import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Shield, Download, CreditCard, Smartphone, Globe, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WalletGuide = () => {
  const navigate = useNavigate();

  const walletProviders = [
    {
      name: "Coinbase Wallet",
      type: "Mobile & Web",
      ease: "Beginner Friendly",
      fees: "Low",
      icon: Smartphone,
      description: "User-friendly with built-in exchange features",
      pros: ["Easy to use", "Built-in buying/selling", "Secure"],
      cons: ["Higher fees for some transactions", "Requires KYC"],
      website: "https://www.coinbase.com/wallet"
    },
    {
      name: "MetaMask",
      type: "Browser Extension & Mobile",
      ease: "Intermediate",
      fees: "Variable",
      icon: Globe,
      description: "Popular Ethereum wallet with DeFi support",
      pros: ["Wide compatibility", "DeFi integration", "Free to use"],
      cons: ["Can be complex for beginners", "Network fees apply"],
      website: "https://metamask.io"
    },
    {
      name: "Trust Wallet",
      type: "Mobile",
      ease: "Beginner Friendly",
      fees: "Low",
      icon: Shield,
      description: "Secure mobile wallet supporting multiple cryptocurrencies",
      pros: ["Multi-currency support", "Built-in DApp browser", "No fees"],
      cons: ["Mobile only", "Limited customer support"],
      website: "https://trustwallet.com"
    },
    {
      name: "Exodus",
      type: "Desktop & Mobile",
      ease: "Beginner Friendly",
      fees: "Medium",
      icon: Download,
      description: "Beautiful interface with built-in exchange",
      pros: ["Great design", "Built-in exchange", "24/7 support"],
      cons: ["Not open source", "Higher exchange fees"],
      website: "https://exodus.com"
    }
  ];

  const steps = [
    {
      title: "1. Choose a Wallet Provider",
      content: "Select a reputable wallet from our recommended list below. Consider factors like ease of use, security features, and supported cryptocurrencies.",
      icon: Shield
    },
    {
      title: "2. Download & Install",
      content: "Download the wallet app from the official website or app store. Never download from third-party sources to avoid scams.",
      icon: Download
    },
    {
      title: "3. Create Your Wallet",
      content: "Follow the setup process, create a strong password, and securely store your recovery phrase (seed phrase) in a safe place.",
      icon: CheckCircle
    },
    {
      title: "4. Verify Your Identity (if required)",
      content: "Some wallets require identity verification for higher limits. This involves uploading ID documents and may take 1-3 business days.",
      icon: CreditCard
    },
    {
      title: "5. Add Funds to Your Wallet",
      content: "You can buy cryptocurrency directly in most wallets using a bank card, or transfer from an exchange like Coinbase, Binance, or Kraken.",
      icon: CreditCard
    }
  ];

  const fundingMethods = [
    {
      method: "Buy Directly in Wallet",
      description: "Most wallets allow you to buy crypto with a debit/credit card directly",
      pros: ["Convenient", "Fast", "All in one place"],
      cons: ["Higher fees (3-5%)", "Lower limits"],
      timeframe: "Instant - 10 minutes"
    },
    {
      method: "Buy from Exchange",
      description: "Purchase on exchanges like Coinbase, Binance, or Kraken, then transfer to wallet",
      pros: ["Lower fees (0.5-1.5%)", "Higher limits", "More payment options"],
      cons: ["Extra step", "Transfer fees apply"],
      timeframe: "15 minutes - 1 hour"
    },
    {
      method: "Bank Transfer to Exchange",
      description: "Wire transfer or ACH to exchange, then buy crypto and transfer to wallet",
      pros: ["Lowest fees", "Highest limits", "Most secure"],
      cons: ["Slower process", "Multiple steps"],
      timeframe: "1-3 business days"
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Cryptocurrency Wallet Setup Guide</h1>
            <p className="text-muted-foreground">Learn how to create a wallet and fund it with cryptocurrency</p>
          </div>
        </div>

        {/* Important Security Notice */}
        <Card className="mb-8 border-warning bg-warning/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-warning flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-warning mb-2">Important Security Reminders</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Never share your recovery phrase (seed phrase) with anyone</li>
                  <li>• Always double-check wallet addresses before sending funds</li>
                  <li>• Only download wallets from official websites or app stores</li>
                  <li>• Start with small amounts until you're comfortable</li>
                  <li>• Enable two-factor authentication (2FA) when available</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step-by-Step Guide */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Step-by-Step Setup Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="bg-accent/10 p-3 rounded-full">
                      <Icon className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recommended Wallets */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Recommended Wallet Providers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {walletProviders.map((wallet, index) => {
                const Icon = wallet.icon;
                return (
                  <Card key={index} className="border-border hover:border-accent transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="bg-accent/10 p-3 rounded-full">
                          <Icon className="h-8 w-8 text-accent" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-xl mb-1">{wallet.name}</h3>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="outline">{wallet.type}</Badge>
                            <Badge variant="outline">{wallet.ease}</Badge>
                            <Badge variant="outline">Fees: {wallet.fees}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{wallet.description}</p>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-semibold text-success mb-2">Pros:</h4>
                          <ul className="text-sm space-y-1">
                            {wallet.pros.map((pro, i) => (
                              <li key={i} className="text-muted-foreground">• {pro}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-warning mb-2">Cons:</h4>
                          <ul className="text-sm space-y-1">
                            {wallet.cons.map((con, i) => (
                              <li key={i} className="text-muted-foreground">• {con}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={() => window.open(wallet.website, '_blank')}
                      >
                        Visit {wallet.name}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Funding Methods */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              How to Add Funds to Your Wallet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {fundingMethods.map((method, index) => (
                <Card key={index} className="bg-secondary/20">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2">{method.method}</h3>
                    <p className="text-muted-foreground mb-4">{method.description}</p>
                    
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-success mb-2">Pros:</h4>
                        <ul className="text-sm space-y-1">
                          {method.pros.map((pro, i) => (
                            <li key={i} className="text-muted-foreground">• {pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-warning mb-2">Cons:</h4>
                        <ul className="text-sm space-y-1">
                          {method.cons.map((con, i) => (
                            <li key={i} className="text-muted-foreground">• {con}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-accent mb-2">Timeframe:</h4>
                        <p className="text-sm text-muted-foreground">{method.timeframe}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-gradient-to-r from-accent/10 to-success/10">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Start Investing?</h3>
              <p className="text-muted-foreground mb-6">
                Once you have cryptocurrency in your wallet, you can proceed with your investment.
                Make sure you have enough funds to cover both the investment amount and any network fees.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => navigate('/crypto-payment')} className="cta-button">
                  Continue to Payment
                </Button>
                <Button variant="outline" onClick={() => navigate('/crypto-guide')}>
                  Learn More About Crypto
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletGuide;