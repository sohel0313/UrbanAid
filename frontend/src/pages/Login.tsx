import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const resp = await signIn(email, password);
      setIsLoading(false);
      const role = resp.role || localStorage.getItem('userRole') || '';
      if (role.includes('ADMIN')) navigate('/admin');
      else if (role.includes('VOLUNTEER')) navigate('/volunteer');
      else navigate('/citizen');
    } catch (err: any) {
      setIsLoading(false);
      toast({ title: 'Sign in failed', description: err?.message || 'Unable to sign in', variant: 'destructive' });
    }
  }; 

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-sm mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg gradient-hero flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl text-foreground">UrbanAid</span>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-8">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Decorative */}
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-12">
        <div className="max-w-md text-primary-foreground text-center">
          <h2 className="text-3xl font-bold mb-4">
            Building Better Communities Together
          </h2>
          <p className="text-primary-foreground/80">
            Join thousands of citizens, volunteers, and administrators working to improve urban life through smart collaboration.
          </p>
        </div>
      </div>
    </div>
  );
}
