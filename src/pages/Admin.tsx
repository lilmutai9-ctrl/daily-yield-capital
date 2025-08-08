import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Users, DollarSign, TrendingUp, Activity, Eye, Shield, Check, X, Clock, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInvestments: 0,
    totalInvestmentAmount: 0,
    activeInvestments: 0,
    pendingWithdrawals: 0,
    pendingDeposits: 0
  });
  const [users, setUsers] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [userNotes, setUserNotes] = useState([]);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [adminNotes, setAdminNotes] = useState('');
  const [newNote, setNewNote] = useState({ userId: '', title: '', content: '' });
  const [editingNote, setEditingNote] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
    fetchAdminData();
    fetchUserNotes();
    setupRealtimeSubscriptions();
  }, []);

  const checkAdminAccess = async () => {
    // Check if user came from admin access portal
    const hasAdminAccess = sessionStorage.getItem('adminAccess');
    if (!hasAdminAccess) {
      toast({
        title: "Access Denied",
        description: "Please use the admin access portal",
        variant: "destructive"
      });
      navigate('/admin-access');
      return;
    }
  };

  const setupRealtimeSubscriptions = () => {
    // Subscribe to deposits changes
    const depositsChannel = supabase
      .channel('deposits-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deposits' }, () => {
        console.log('Deposits table changed - refreshing data');
        fetchAdminData();
      })
      .subscribe();

    // Subscribe to withdrawals changes
    const withdrawalsChannel = supabase
      .channel('withdrawals-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'withdrawals' }, () => {
        console.log('Withdrawals table changed - refreshing data');
        fetchAdminData();
      })
      .subscribe();

    // Subscribe to investments changes
    const investmentsChannel = supabase
      .channel('investments-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'investments' }, () => {
        console.log('Investments table changed - refreshing data');
        fetchAdminData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(depositsChannel);
      supabase.removeChannel(withdrawalsChannel);
      supabase.removeChannel(investmentsChannel);
    };
  };

  const logAdminActivity = async (actionType: string, targetTable: string, targetId: string, oldStatus: string, newStatus: string, userAffected: string, amount: number, notes?: string) => {
    try {
      await supabase
        .from('admin_activity_logs')
        .insert({
          admin_session: `admin-${Date.now()}`,
          action_type: actionType,
          target_table: targetTable,
          target_id: targetId,
          old_status: oldStatus,
          new_status: newStatus,
          admin_notes: notes,
          user_affected: userAffected,
          amount: amount
        });
    } catch (error) {
      console.error('Failed to log admin activity:', error);
    }
  };

  const fetchAdminData = async () => {
    try {
      console.log('Fetching admin data...');
      setLoading(true);

      // Fetch profiles count
      const { count: userCount, error: userCountError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (userCountError) {
        console.error('Error fetching user count:', userCountError);
      }

      // Fetch ALL investments data (no filters)
      const { data: investmentsData, count: investmentCount, error: investmentsError } = await supabase
        .from('investments')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (investmentsError) {
        console.error('Error fetching investments:', investmentsError);
      }

      console.log('Fetched investments:', investmentsData?.length || 0);

      const totalAmount = investmentsData?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;
      const activeInvs = investmentsData?.filter(inv => inv.status === 'active').length || 0;

      // Fetch ALL deposits with user profile data (no filters)
      const { data: depositsData, error: depositsError } = await supabase
        .from('deposits')
        .select('*')
        .order('created_at', { ascending: false });

      if (depositsError) {
        console.error('Error fetching deposits:', depositsError);
      }

      console.log('Fetched deposits:', depositsData?.length || 0, 'Pending:', depositsData?.filter(d => d.status === 'pending').length || 0);

      // Fetch user profiles for deposits
      const depositsWithProfiles = [];
      if (depositsData && depositsData.length > 0) {
        for (const deposit of depositsData) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('user_id', deposit.user_id)
            .single();
          
          depositsWithProfiles.push({
            ...deposit,
            profiles: profile
          });
        }
      }

      const pendingDepositsCount = depositsData?.filter(dep => dep.status === 'pending').length || 0;

      // Fetch ALL withdrawals with user profile data (no filters)
      const { data: withdrawalsData, error: withdrawalsError } = await supabase
        .from('withdrawals')
        .select('*')
        .order('created_at', { ascending: false });

      if (withdrawalsError) {
        console.error('Error fetching withdrawals:', withdrawalsError);
      }

      console.log('Fetched withdrawals:', withdrawalsData?.length || 0, 'Pending:', withdrawalsData?.filter(w => w.status === 'pending').length || 0);

      // Fetch user profiles for withdrawals
      const withdrawalsWithProfiles = [];
      if (withdrawalsData && withdrawalsData.length > 0) {
        for (const withdrawal of withdrawalsData) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('user_id', withdrawal.user_id)
            .single();
          
          withdrawalsWithProfiles.push({
            ...withdrawal,
            profiles: profile
          });
        }
      }

      const pendingWithdrawalsCount = withdrawalsData?.filter(wd => wd.status === 'pending').length || 0;

      // Fetch investments with user profile data
      const investmentsWithProfiles = [];
      if (investmentsData && investmentsData.length > 0) {
        for (const investment of investmentsData) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('user_id', investment.user_id)
            .single();
          
          investmentsWithProfiles.push({
            ...investment,
            profiles: profile
          });
        }
      }

      // Fetch users with profiles
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (usersError) {
        console.error('Error fetching users:', usersError);
      }

      // Fetch referrals with user profile data
      const { data: referralsData, error: referralsError } = await supabase
        .from('referrals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (referralsError) {
        console.error('Error fetching referrals:', referralsError);
      }

      // Fetch user profiles for referrals
      const referralsWithProfiles = [];
      if (referralsData && referralsData.length > 0) {
        for (const referral of referralsData) {
          const { data: referrerProfile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('user_id', referral.referrer_id)
            .single();
          
          const { data: referredProfile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('user_id', referral.referred_id)
            .single();
          
          referralsWithProfiles.push({
            ...referral,
            referrer: referrerProfile,
            referred: referredProfile
          });
        }
      }

      setStats({
        totalUsers: userCount || 0,
        totalInvestments: investmentCount || 0,
        totalInvestmentAmount: totalAmount,
        activeInvestments: activeInvs,
        pendingWithdrawals: pendingWithdrawalsCount,
        pendingDeposits: pendingDepositsCount
      });

      setUsers(usersData || []);
      setInvestments(investmentsWithProfiles || []);
      setReferrals(referralsWithProfiles || []);
      setDeposits(depositsWithProfiles || []);
      setWithdrawals(withdrawalsWithProfiles || []);

      console.log('Admin data updated - Pending deposits:', pendingDepositsCount, 'Pending withdrawals:', pendingWithdrawalsCount);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch admin data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDepositAction = async (depositId: string, action: 'approve' | 'reject') => {
    try {
      const deposit = deposits.find(d => d.id === depositId);
      if (!deposit) {
        throw new Error('Deposit not found');
      }

      // Update deposit status with admin session (no need for user auth check)
      const { error: depositError } = await supabase
        .from('deposits')
        .update({
          status: action === 'approve' ? 'approved' : 'rejected',
          admin_notes: adminNotes,
          approved_by: action === 'approve' ? 'admin' : null,
          approved_at: action === 'approve' ? new Date().toISOString() : null
        })
        .eq('id', depositId);

      if (depositError) {
        console.error('Deposit update error:', depositError);
        throw new Error(`Failed to update deposit: ${depositError.message}`);
      }

      // If approved, create investment
      if (action === 'approve') {
        // Get investment details from payment proof (assuming they're stored there)
        // Default values for when details are not available
        const defaultDuration = 30; // 30 days default
        const defaultRate = 3.5; // 3.5% default daily rate
        
        const { error: investmentError } = await supabase
          .from('investments')
          .insert({
            user_id: deposit.user_id,
            amount: deposit.amount,
            plan_name: 'Standard Plan',
            daily_rate: defaultRate,
            start_date: new Date().toISOString(),
            maturity_date: new Date(Date.now() + defaultDuration * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active'
          });

        if (investmentError) {
          console.error('Investment creation error:', investmentError);
          throw new Error(`Failed to create investment: ${investmentError.message}`);
        }

        // Create notification for user
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: deposit.user_id,
            title: 'Deposit Approved',
            message: `Your deposit of $${deposit.amount} has been approved and your investment is now active.`,
            type: 'success'
          });

        if (notificationError) {
          console.error('Notification error:', notificationError);
        }
      } else {
        // Create notification for rejection
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: deposit.user_id,
            title: 'Deposit Rejected',
            message: `Your deposit of $${deposit.amount} has been rejected. ${adminNotes || 'Please contact support for more information.'}`,
            type: 'error'
          });

        if (notificationError) {
          console.error('Notification error:', notificationError);
        }
      }

      // Log the action
      await logAdminActivity(
        `deposit_${action}`,
        'deposits',
        depositId,
        deposit.status,
        action === 'approve' ? 'approved' : 'rejected',
        deposit.user_id,
        deposit.amount,
        adminNotes
      );

      console.log(`Admin ${action}d deposit ${depositId} for user ${deposit.user_id} amount $${deposit.amount}`);

      toast({
        title: "Success",
        description: `Deposit ${action === 'approve' ? 'approved' : 'rejected'} successfully`
      });

      setAdminNotes('');
      fetchAdminData();
    } catch (error) {
      console.error('Error handling deposit:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process deposit",
        variant: "destructive"
      });
    }
  };

  const fetchUserNotes = async () => {
    try {
      const { data: notesData, error } = await supabase
        .from('user_notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user notes:', error);
        return;
      }

      // Fetch user profiles for notes
      const notesWithProfiles = [];
      if (notesData && notesData.length > 0) {
        for (const note of notesData) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('user_id', note.user_id)
            .single();
          
          notesWithProfiles.push({
            ...note,
            profiles: profile
          });
        }
      }

      setUserNotes(notesWithProfiles || []);
    } catch (error) {
      console.error('Error fetching user notes:', error);
    }
  };

  const handleCreateNote = async () => {
    if (!newNote.userId || !newNote.title || !newNote.content) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('user_notes')
        .insert({
          user_id: newNote.userId,
          admin_id: user?.id,
          title: newNote.title,
          content: newNote.content
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Note created successfully"
      });

      setNewNote({ userId: '', title: '', content: '' });
      fetchUserNotes();
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive"
      });
    }
  };

  const handleUpdateNote = async () => {
    if (!editingNote?.title || !editingNote?.content) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_notes')
        .update({
          title: editingNote.title,
          content: editingNote.content
        })
        .eq('id', editingNote.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Note updated successfully"
      });

      setEditingNote(null);
      fetchUserNotes();
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive"
      });
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('user_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Note deleted successfully"
      });

      fetchUserNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive"
      });
    }
  };

  const handleWithdrawalAction = async (withdrawalId: string, action: 'approve' | 'reject') => {
    try {
      const withdrawal = withdrawals.find(w => w.id === withdrawalId);
      if (!withdrawal) {
        throw new Error('Withdrawal not found');
      }

      // Update withdrawal status
      const { error: withdrawalError } = await supabase
        .from('withdrawals')
        .update({
          status: action === 'approve' ? 'completed' : 'rejected',
          admin_notes: adminNotes,
          processed_by: 'admin',
          processed_at: new Date().toISOString()
        })
        .eq('id', withdrawalId);

      if (withdrawalError) {
        console.error('Withdrawal update error:', withdrawalError);
        throw new Error(`Failed to update withdrawal: ${withdrawalError.message}`);
      }

      // Create notification for user
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: withdrawal.user_id,
          title: `Withdrawal ${action === 'approve' ? 'Completed' : 'Rejected'}`,
          message: action === 'approve' 
            ? `Your withdrawal of $${withdrawal.amount} has been processed and sent to your ${withdrawal.withdrawal_method} address.`
            : `Your withdrawal of $${withdrawal.amount} has been rejected. ${adminNotes || 'Please contact support for more information.'}`,
          type: action === 'approve' ? 'success' : 'error'
        });

      if (notificationError) {
        console.error('Notification error:', notificationError);
      }

      // Log the action
      await logAdminActivity(
        `withdrawal_${action}`,
        'withdrawals',
        withdrawalId,
        withdrawal.status,
        action === 'approve' ? 'completed' : 'rejected',
        withdrawal.user_id,
        withdrawal.amount,
        adminNotes
      );

      console.log(`Admin ${action}d withdrawal ${withdrawalId} for user ${withdrawal.user_id} amount $${withdrawal.amount}`);

      toast({
        title: "Success",
        description: `Withdrawal ${action === 'approve' ? 'approved' : 'rejected'} successfully`
      });

      setAdminNotes('');
      fetchAdminData();
    } catch (error) {
      console.error('Error handling withdrawal:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process withdrawal",
        variant: "destructive"
      });
    }
  };

  const handleInvestmentAction = async (investmentId: string, action: 'approve' | 'reject') => {
    try {
      const investment = investments.find(i => i.id === investmentId);
      if (!investment) {
        throw new Error('Investment not found');
      }

      // Update investment status
      const { error: investmentError } = await supabase
        .from('investments')
        .update({
          status: action === 'approve' ? 'active' : 'rejected'
        })
        .eq('id', investmentId);

      if (investmentError) {
        console.error('Investment update error:', investmentError);
        throw new Error(`Failed to update investment: ${investmentError.message}`);
      }

      // Create notification for user
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: investment.user_id,
          title: `Investment ${action === 'approve' ? 'Approved' : 'Rejected'}`,
          message: action === 'approve' 
            ? `Your investment of $${investment.amount} has been approved and is now active.`
            : `Your investment of $${investment.amount} has been rejected. ${adminNotes || 'Please contact support for more information.'}`,
          type: action === 'approve' ? 'success' : 'error'
        });

      if (notificationError) {
        console.error('Notification error:', notificationError);
      }

      // Log the action
      await logAdminActivity(
        `investment_${action}`,
        'investments',
        investmentId,
        investment.status,
        action === 'approve' ? 'active' : 'rejected',
        investment.user_id,
        investment.amount,
        adminNotes
      );

      console.log(`Admin ${action}d investment ${investmentId} for user ${investment.user_id} amount $${investment.amount}`);

      toast({
        title: "Success",
        description: `Investment ${action === 'approve' ? 'approved' : 'rejected'} successfully`
      });

      setAdminNotes('');
      fetchAdminData();
    } catch (error) {
      console.error('Error handling investment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process investment",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-primary animate-spin" />
          <p>Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Daily Yield Capital Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Site
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => supabase.auth.signOut()}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deposits">Deposits</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Deposits</CardTitle>
                  <Clock className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-500">{stats.pendingDeposits}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
                  <Download className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">{stats.pendingWithdrawals}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalInvestments}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Investment Volume</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalInvestmentAmount.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Investments</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeInvestments}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investments.slice(0, 5).map((investment) => (
                    <div key={investment.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <div>
                        <p className="font-medium">New {investment.plan_name} Investment</p>
                        <p className="text-sm text-muted-foreground">
                          ${Number(investment.amount).toLocaleString()} • {new Date(investment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={investment.status === 'active' ? 'default' : 'secondary'}>
                        {investment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Deposits Tab */}
          <TabsContent value="deposits" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Deposit Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Proof</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deposits.map((deposit) => (
                      <TableRow key={deposit.id}>
                        <TableCell>
                          {deposit.profiles?.first_name} {deposit.profiles?.last_name}
                        </TableCell>
                        <TableCell className="font-medium">${Number(deposit.amount).toLocaleString()}</TableCell>
                        <TableCell>{deposit.payment_method}</TableCell>
                        <TableCell>
                          {deposit.payment_proof ? (
                            <Button variant="outline" size="sm" asChild>
                              <a href={deposit.payment_proof} target="_blank" rel="noopener noreferrer">
                                View Proof
                              </a>
                            </Button>
                          ) : (
                            'No proof'
                          )}
                        </TableCell>
                        <TableCell>{new Date(deposit.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={
                            deposit.status === 'approved' ? 'default' : 
                            deposit.status === 'rejected' ? 'destructive' : 'secondary'
                          }>
                            {deposit.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {deposit.status === 'pending' && (
                            <div className="flex gap-2">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="default">
                                    <Check className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Approve Deposit</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to approve this deposit of ${Number(deposit.amount).toLocaleString()}? This will create an active investment for the user.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <div className="py-4">
                                    <Textarea
                                      placeholder="Admin notes (optional)"
                                      value={adminNotes}
                                      onChange={(e) => setAdminNotes(e.target.value)}
                                    />
                                  </div>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDepositAction(deposit.id, 'approve')}>
                                      Approve
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="destructive">
                                    <X className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Reject Deposit</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to reject this deposit of ${Number(deposit.amount).toLocaleString()}?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <div className="py-4">
                                    <Textarea
                                      placeholder="Reason for rejection (required)"
                                      value={adminNotes}
                                      onChange={(e) => setAdminNotes(e.target.value)}
                                    />
                                  </div>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDepositAction(deposit.id, 'reject')}>
                                      Reject
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Withdrawals Tab */}
          <TabsContent value="withdrawals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Withdrawal Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawals.map((withdrawal) => (
                      <TableRow key={withdrawal.id}>
                        <TableCell>
                          {withdrawal.profiles?.first_name} {withdrawal.profiles?.last_name}
                        </TableCell>
                        <TableCell className="font-medium">${Number(withdrawal.amount).toLocaleString()}</TableCell>
                        <TableCell>{withdrawal.withdrawal_method}</TableCell>
                        <TableCell className="font-mono text-sm max-w-32 truncate">
                          {withdrawal.withdrawal_address}
                        </TableCell>
                        <TableCell>{new Date(withdrawal.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={
                            withdrawal.status === 'completed' ? 'default' : 
                            withdrawal.status === 'rejected' ? 'destructive' : 'secondary'
                          }>
                            {withdrawal.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {withdrawal.status === 'pending' && (
                            <div className="flex gap-2">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="default">
                                    <Check className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Approve Withdrawal</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to approve this withdrawal of ${Number(withdrawal.amount).toLocaleString()} to {withdrawal.withdrawal_address}?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <div className="py-4">
                                    <Textarea
                                      placeholder="Admin notes (optional)"
                                      value={adminNotes}
                                      onChange={(e) => setAdminNotes(e.target.value)}
                                    />
                                  </div>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleWithdrawalAction(withdrawal.id, 'approve')}>
                                      Approve
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="destructive">
                                    <X className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Reject Withdrawal</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to reject this withdrawal of ${Number(withdrawal.amount).toLocaleString()}?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <div className="py-4">
                                    <Textarea
                                      placeholder="Reason for rejection (required)"
                                      value={adminNotes}
                                      onChange={(e) => setAdminNotes(e.target.value)}
                                    />
                                  </div>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleWithdrawalAction(withdrawal.id, 'reject')}>
                                      Reject
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          {user.first_name} {user.last_name}
                        </TableCell>
                        <TableCell>{user.phone || 'N/A'}</TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="default">Active</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Investments Tab */}
          <TabsContent value="investments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Investment Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Daily Rate</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Maturity</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {investments.map((investment) => (
                      <TableRow key={investment.id}>
                        <TableCell className="font-medium">{investment.plan_name}</TableCell>
                        <TableCell>${Number(investment.amount).toLocaleString()}</TableCell>
                        <TableCell>{Number(investment.daily_rate)}%</TableCell>
                        <TableCell>{new Date(investment.start_date).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(investment.maturity_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={investment.status === 'active' ? 'default' : 'secondary'}>
                            {investment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Referral Program</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Referrer</TableHead>
                      <TableHead>Referred User</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referrals.map((referral) => (
                      <TableRow key={referral.id}>
                        <TableCell>User {referral.referrer_id.slice(0, 8)}</TableCell>
                        <TableCell>User {referral.referred_id.slice(0, 8)}</TableCell>
                        <TableCell className="font-mono">{referral.referral_code}</TableCell>
                        <TableCell>{new Date(referral.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="default">{referral.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Notes Tab */}
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>User Notes Management</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Create New Note */}
                <div className="mb-6 p-4 border rounded-lg bg-secondary/20">
                  <h3 className="font-semibold mb-4">Create New Note</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="user-select">Select User</Label>
                      <select
                        id="user-select"
                        className="w-full p-2 border rounded"
                        value={newNote.userId}
                        onChange={(e) => setNewNote({ ...newNote, userId: e.target.value })}
                      >
                        <option value="">Select a user...</option>
                        {users.map((user) => (
                          <option key={user.user_id} value={user.user_id}>
                            {user.first_name} {user.last_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="note-title">Title</Label>
                      <Input
                        id="note-title"
                        value={newNote.title}
                        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                        placeholder="Note title..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="note-content">Content</Label>
                      <textarea
                        id="note-content"
                        className="w-full p-2 border rounded min-h-[100px]"
                        value={newNote.content}
                        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                        placeholder="Note content..."
                      />
                    </div>
                    <Button onClick={handleCreateNote}>Create Note</Button>
                  </div>
                </div>

                {/* Existing Notes */}
                <div className="space-y-4">
                  {userNotes.map((note) => (
                    <div key={note.id} className="p-4 border rounded-lg">
                      {editingNote?.id === note.id ? (
                        <div className="space-y-4">
                          <Input
                            value={editingNote.title}
                            onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                          />
                          <textarea
                            className="w-full p-2 border rounded min-h-[100px]"
                            value={editingNote.content}
                            onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleUpdateNote}>Save</Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingNote(null)}>Cancel</Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">{note.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                For: {note.profiles?.first_name} {note.profiles?.last_name}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setEditingNote(note)}
                              >
                                Edit
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDeleteNote(note.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                          <p className="text-muted-foreground whitespace-pre-wrap">{note.content}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Created: {new Date(note.created_at).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;