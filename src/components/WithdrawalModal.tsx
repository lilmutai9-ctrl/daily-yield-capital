import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WithdrawalModalProps {
  availableBalance: number;
  onSuccess: () => void;
}

const WithdrawalModal = ({ availableBalance, onSuccess }: WithdrawalModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    withdrawalMethod: '',
    withdrawalAddress: '',
    notes: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user?.id) throw new Error('User not authenticated');

      const amount = parseFloat(formData.amount);
      if (amount <= 0 || amount > availableBalance) {
        throw new Error('Invalid withdrawal amount');
      }

      const { error } = await supabase
        .from('withdrawals')
        .insert({
          user_id: user.user.id,
          amount,
          withdrawal_method: formData.withdrawalMethod,
          withdrawal_address: formData.withdrawalAddress,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Withdrawal Request Submitted",
        description: `Your withdrawal request for $${amount.toLocaleString()} has been submitted and is pending admin approval.`
      });

      setFormData({
        amount: '',
        withdrawalMethod: '',
        withdrawalAddress: '',
        notes: ''
      });
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error('Error submitting withdrawal:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit withdrawal request",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Request Withdrawal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Withdrawal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              max={availableBalance}
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Available balance: ${availableBalance.toLocaleString()}
            </p>
          </div>

          <div>
            <Label htmlFor="withdrawalMethod">Withdrawal Method</Label>
            <Select 
              value={formData.withdrawalMethod} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, withdrawalMethod: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select withdrawal method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bitcoin">Bitcoin</SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="usdt">USDT (Tether)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="withdrawalAddress">
              Wallet Address
            </Label>
            <Textarea
              id="withdrawalAddress"
              placeholder="Enter your wallet address"
              value={formData.withdrawalAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, withdrawalAddress: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information for the withdrawal"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalModal;