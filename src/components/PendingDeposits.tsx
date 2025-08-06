import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Deposit {
  id: string;
  amount: number;
  payment_method: string;
  status: string;
  created_at: string;
  admin_notes?: string;
}

const PendingDeposits = () => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeposits();
    setupRealtimeSubscription();
  }, []);

  const fetchDeposits = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user?.id) return;

      const { data, error } = await supabase
        .from('deposits')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeposits(data || []);
    } catch (error) {
      console.error('Error fetching deposits:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('deposits-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'deposits'
      }, () => {
        fetchDeposits();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'pending':
      default:
        return <Clock className="h-5 w-5 text-warning" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'pending':
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-2"></div>
        <p className="text-muted-foreground">Loading deposits...</p>
      </div>
    );
  }

  if (deposits.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Deposits Found</h3>
        <p className="text-muted-foreground">Your deposit history will appear here once you make a deposit.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {deposits.map((deposit) => (
        <Card key={deposit.id} className="bg-secondary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(deposit.status)}
                <div>
                  <p className="font-semibold">${deposit.amount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    {deposit.payment_method} • {new Date(deposit.created_at).toLocaleDateString()}
                  </p>
                  {deposit.admin_notes && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Note: {deposit.admin_notes}
                    </p>
                  )}
                </div>
              </div>
              <Badge variant={getStatusVariant(deposit.status)} className="capitalize">
                {deposit.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PendingDeposits;