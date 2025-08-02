import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const [selectedTab, setSelectedTab] = useState('overview');
  const [adminNotes, setAdminNotes] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
    fetchAdminData();
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
        fetchAdminData();
      })
      .subscribe();

    // Subscribe to withdrawals changes
    const withdrawalsChannel = supabase
      .channel('withdrawals-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'withdrawals' }, () => {
        fetchAdminData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(depositsChannel);
      supabase.removeChannel(withdrawalsChannel);
    };
  };

  const fetchAdminData = async () => {
    try {
      // Fetch profiles count
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch investments data
      const { data: investmentsData, count: investmentCount } = await supabase
        .from('investments')
        .select('*', { count: 'exact' });

      const totalAmount = investmentsData?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;
      const activeInvs = investmentsData?.filter(inv => inv.status === 'active').length || 0;

      // Fetch deposits
      const { data: depositsData, count: depositsCount } = await supabase
        .from('deposits')
        .select(`
          *,
          profiles:user_id(first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      const pendingDepositsCount = depositsData?.filter(dep => dep.status === 'pending').length || 0;

      // Fetch withdrawals
      const { data: withdrawalsData, count: withdrawalsCount } = await supabase
        .from('withdrawals')
        .select(`
          *,
          profiles:user_id(first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      const pendingWithdrawalsCount = withdrawalsData?.filter(wd => wd.status === 'pending').length || 0;

      // Fetch users with profiles
      const { data: usersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      // Fetch referrals
      const { data: referralsData } = await supabase
        .from('referrals')
        .select(`
          *,
          referrer:referrer_id(first_name, last_name),
          referred:referred_id(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      setStats({
        totalUsers: userCount || 0,
        totalInvestments: investmentCount || 0,
        totalInvestmentAmount: totalAmount,
        activeInvestments: activeInvs,
        pendingWithdrawals: pendingWithdrawalsCount,
        pendingDeposits: pendingDepositsCount
      });

      setUsers(usersData || []);
      setInvestments(investmentsData || []);
      setReferrals(referralsData || []);
      setDeposits(depositsData || []);
      setWithdrawals(withdrawalsData || []);
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
      if (!deposit) return;

      // Update deposit status
      const { error: depositError } = await supabase
        .from('deposits')
        .update({
          status: action === 'approve' ? 'approved' : 'rejected',
          admin_notes: adminNotes,
          approved_by: action === 'approve' ? 'admin' : null,
          approved_at: action === 'approve' ? new Date().toISOString() : null
        })
        .eq('id', depositId);

      if (depositError) throw depositError;

      // If approved, create investment
      if (action === 'approve') {
        const { error: investmentError } = await supabase
          .from('investments')
          .insert({
            user_id: deposit.user_id,
            amount: deposit.amount,
            plan_name: 'Standard Plan',
            daily_rate: 3.5,
            start_date: new Date().toISOString(),
            maturity_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active'
          });

        if (investmentError) throw investmentError;

        // Create notification for user
        await supabase
          .from('notifications')
          .insert({
            user_id: deposit.user_id,
            title: 'Deposit Approved',
            message: `Your deposit of $${deposit.amount} has been approved and your investment is now active.`,
            type: 'success'
          });
      } else {
        // Create notification for rejection
        await supabase
          .from('notifications')
          .insert({
            user_id: deposit.user_id,
            title: 'Deposit Rejected',
            message: `Your deposit of $${deposit.amount} has been rejected. ${adminNotes || 'Please contact support for more information.'}`,
            type: 'error'
          });
      }

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
        description: "Failed to process deposit",
        variant: "destructive"
      });
    }
  };

  const handleWithdrawalAction = async (withdrawalId: string, action: 'approve' | 'reject') => {
    try {
      const withdrawal = withdrawals.find(w => w.id === withdrawalId);
      if (!withdrawal) return;

      // Update withdrawal status
      const { error } = await supabase
        .from('withdrawals')
        .update({
          status: action === 'approve' ? 'completed' : 'rejected',
          admin_notes: adminNotes,
          processed_by: 'admin',
          processed_at: new Date().toISOString()
        })
        .eq('id', withdrawalId);

      if (error) throw error;

      // Create notification for user
      await supabase
        .from('notifications')
        .insert({
          user_id: withdrawal.user_id,
          title: `Withdrawal ${action === 'approve' ? 'Completed' : 'Rejected'}`,
          message: action === 'approve' 
            ? `Your withdrawal of $${withdrawal.amount} has been processed and sent to your ${withdrawal.withdrawal_method} address.`
            : `Your withdrawal of $${withdrawal.amount} has been rejected. ${adminNotes || 'Please contact support for more information.'}`,
          type: action === 'approve' ? 'success' : 'error'
        });

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
        description: "Failed to process withdrawal",
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deposits">Deposits</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
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
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;