import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AdminAccess = () => {
  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (code === 'ADMIN2024') {
      sessionStorage.setItem('adminAccess', 'true');
      toast({
        title: "Access Granted",
        description: "Welcome to the admin portal"
      });
      navigate('/admin');
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid access code",
        variant: "destructive"
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Shield className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl font-bold mb-2">Admin Access Portal</h1>
          <p className="text-muted-foreground">Enter the access code to continue</p>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <CardTitle className="text-center">Restricted Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-medium mb-2">Access Code</label>
                <Input 
                  type={showCode ? "text" : "password"} 
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter admin access code" 
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
                >
                  {showCode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Verifying..." : "Access Admin Portal"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                ← Back to home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAccess;