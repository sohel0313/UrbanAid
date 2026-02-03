import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Mail, Lock, User, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const roles: { value: UserRole; label: string; description: string }[] = [
  {
    value: 'citizen',
    label: 'Citizen',
    description: 'Report issues and track their resolution',
  },
  {
    value: 'volunteer',
    label: 'Volunteer',
    description: 'Help resolve community issues',
  },
  // Admin registration is disabled for public users
];

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState<UserRole>('citizen');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // validate mobile (required by backend)
    const mobileRegex = /^[6-9][0-9]{9}$/;
    if (!mobileRegex.test(mobile)) {
      setIsLoading(false);
      toast({ title: 'Invalid mobile', description: 'Enter a valid 10-digit mobile starting with 6-9', variant: 'destructive' });
      return;
    }

    try {
      await register({ name, email, password, role, mobile });
      setIsLoading(false);
      toast({ title: 'Registration successful', description: 'You may now sign in' });
      navigate('/login');
    } catch (err: any) {
      setIsLoading(false);
      toast({ title: 'Registration failed', description: err?.message || 'Unable to register', variant: 'destructive' });
    }
  }; 

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md mx-auto">
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

          <h1 className="text-2xl font-bold text-foreground mb-2">Create an account</h1>
          <p className="text-muted-foreground mb-8">
            Join UrbanAid and start making a difference
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="pl-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

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
              <Label htmlFor="mobile">Mobile</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter your mobile number"
                  className="pl-10"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                  pattern="^[6-9][0-9]{9}$"
                  inputMode="numeric"
                  title="10-digit mobile starting with 6-9"
                />
              </div>
              <p className="text-xs text-muted-foreground">Enter a valid 10-digit mobile number (starts with 6-9)</p>
            </div> 

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
            </div>

            <div className="space-y-3">
              <Label>Select your role</Label>
              <div className="grid gap-3">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={cn(
                      'relative flex items-start gap-4 p-4 rounded-lg border-2 text-left transition-all',
                      role === r.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                        role === r.value ? 'border-primary bg-primary' : 'border-muted-foreground'
                      )}
                    >
                      {role === r.value && (
                        <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{r.label}</p>
                      <p className="text-sm text-muted-foreground">{r.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Decorative */}
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-12">
        <div className="max-w-md text-primary-foreground text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join Our Growing Community
          </h2>
          <p className="text-primary-foreground/80 mb-8">
            Whether you're a citizen reporting issues, a volunteer solving problems, 
            or an administrator coordinating efforts - everyone plays a vital role.
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold">5K+</p>
              <p className="text-sm text-primary-foreground/70">Citizens</p>
            </div>
            <div>
              <p className="text-3xl font-bold">500+</p>
              <p className="text-sm text-primary-foreground/70">Volunteers</p>
            </div>
            <div>
              <p className="text-3xl font-bold">50+</p>
              <p className="text-sm text-primary-foreground/70">Cities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
