import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wallet, Shield, Clock, AlertTriangle } from 'lucide-react';

const CryptoGuide = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">How to Deposit Cryptocurrency</h1>
            <p className="text-muted-foreground">Complete guide to making crypto payments</p>
          </div>
        </div>

        {/* Supported Cryptocurrencies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Supported Cryptocurrencies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg bg-orange-50 border-orange-200">
                <h3 className="font-semibold text-orange-600">Bitcoin (BTC)</h3>
                <p className="text-sm text-gray-600 mt-1">The original cryptocurrency, widely accepted</p>
                <p className="text-xs text-gray-500 mt-2">Network: Bitcoin</p>
              </div>
              <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                <h3 className="font-semibold text-blue-600">Ethereum (ETH)</h3>
                <p className="text-sm text-gray-600 mt-1">Second largest crypto by market cap</p>
                <p className="text-xs text-gray-500 mt-2">Network: Ethereum</p>
              </div>
              <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                <h3 className="font-semibold text-green-600">USDT (TRC20)</h3>
                <p className="text-sm text-gray-600 mt-1">Stable coin pegged to US Dollar</p>
                <p className="text-xs text-gray-500 mt-2">Network: TRON (TRC20)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step by Step Guide */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Step-by-Step Payment Process</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="font-semibold mb-2">Choose Your Cryptocurrency</h3>
                  <p className="text-muted-foreground">Select from Bitcoin (BTC), Ethereum (ETH), or USDT (TRC20) based on what you have available.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="font-semibold mb-2">Copy the Payment Address</h3>
                  <p className="text-muted-foreground">Copy the provided wallet address for your chosen cryptocurrency. Double-check the address to avoid sending to wrong wallet.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="font-semibold mb-2">Calculate the Amount</h3>
                  <p className="text-muted-foreground">Convert your investment amount (USD) to the equivalent value in your chosen cryptocurrency using current market rates.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <h3 className="font-semibold mb-2">Send the Payment</h3>
                  <p className="text-muted-foreground">Using your crypto wallet, send the calculated amount to our provided address. Ensure you're using the correct network.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold">5</div>
                <div>
                  <h3 className="font-semibold mb-2">Confirm Your Payment</h3>
                  <p className="text-muted-foreground">After sending, click "I've Sent Payment" on our platform. Our admin team will verify and activate your investment.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Important Security Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Network Compatibility</h4>
                <p className="text-sm text-red-700">
                  Always ensure you're sending on the correct network. For USDT, use only TRC20 network. 
                  Sending on wrong networks may result in permanent loss of funds.
                </p>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Double Check Addresses</h4>
                <p className="text-sm text-yellow-700">
                  Cryptocurrency transactions are irreversible. Always double-check the wallet address 
                  before sending any funds.
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Transaction Fees</h4>
                <p className="text-sm text-blue-700">
                  Remember to account for network transaction fees when sending. The amount we receive 
                  should match your investment amount.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Processing Time */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Processing Times
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Network Confirmation</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Bitcoin: 10-60 minutes</li>
                  <li>• Ethereum: 1-15 minutes</li>
                  <li>• USDT (TRC20): 1-3 minutes</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Admin Approval</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Verification: 1-24 hours</li>
                  <li>• Investment activation: Immediate</li>
                  <li>• Notification: Real-time</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Need Help */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you encounter any issues during the payment process or need assistance, 
              please contact our support team.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => navigate('/support')}>
                Contact Support
              </Button>
              <Button onClick={() => navigate('/invest')}>
                Start Investment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CryptoGuide;