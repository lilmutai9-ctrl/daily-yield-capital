import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Clock, DollarSign, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

const InvestmentMaturityProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastProcessResult, setLastProcessResult] = useState<any>(null);
  const { toast } = useToast();

  const processMaturedInvestments = async () => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('process-matured-investments', {
        body: { manual: true }
      });

      if (error) throw error;

      setLastProcessResult(data);
      
      if (data.processedInvestments && data.processedInvestments.length > 0) {
        toast({
          title: 'Investments Processed',
          description: `${data.processedInvestments.length} matured investments processed successfully`,
        });
      } else {
        toast({
          title: 'No Matured Investments',
          description: 'No investments were ready for maturation',
        });
      }
    } catch (error) {
      console.error('Error processing investments:', error);
      toast({
        title: 'Processing Error',
        description: 'Failed to process matured investments',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Investment Maturity System</h3>
        </div>
        <Badge variant="outline" className="bg-success/10 text-success">
          Automated
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>The system automatically processes matured investments every hour and updates user balances.</p>
          <p className="mt-1">When an investment reaches its maturity date:</p>
          <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
            <li>Total earned amount is added to user balance</li>
            <li>Investment status changes to "completed"</li>
            <li>User receives a notification</li>
            <li>Activity is logged for admin review</li>
          </ul>
        </div>

        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Auto-Processing:</span>
          </div>
          <Badge variant="secondary">Every Hour</Badge>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Earnings Update:</span>
          </div>
          <Badge variant="secondary">Every 6 Hours</Badge>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={processMaturedInvestments}
            disabled={isProcessing}
            variant="outline"
            size="sm"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Process Now (Manual)
              </>
            )}
          </Button>
        </div>

        {lastProcessResult && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Last Processing Result
            </h4>
            <div className="text-sm space-y-2">
              <p><strong>Status:</strong> {lastProcessResult.success ? 'Success' : 'Failed'}</p>
              <p><strong>Message:</strong> {lastProcessResult.message}</p>
              {lastProcessResult.processedInvestments && lastProcessResult.processedInvestments.length > 0 && (
                <div>
                  <p><strong>Processed Investments:</strong></p>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    {lastProcessResult.processedInvestments.map((inv: any, index: number) => (
                      <li key={index} className="text-xs">
                        {inv.plan_name}: ${inv.amount} → ${inv.total_earned} earned
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default InvestmentMaturityProcessor;