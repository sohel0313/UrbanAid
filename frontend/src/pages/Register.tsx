import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { MapPin, Mail, Lock, User, ArrowLeft, CheckCircle2, Briefcase, Activity } from 'lucide-react';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const roles: { value: UserRole; label: string; description: string }[] = [
  { value: 'citizen', label: 'Citizen', description: 'Report issues and track resolution' },
  { value: 'volunteer', label: 'Volunteer', description: 'Help resolve community issues' },
];

// Valid Vtype values matching your backend Enum
const volunteerTypes = [
  { value: 'GENERAL_HELP', label: 'General Help' },
  { value: 'TECHNICAL_SUPPORT', label: 'Technical Support' },
  { value: 'FIRST_AID', label: 'First Aid' },
  { value: 'DISASTER_RESPONSE', label: 'Disaster Response' },
  { value: 'SAFETY_SUPPORT', label: 'Safety Support' },
  { value: 'ENVIRONMENT_SUPPORT', label: 'Environment Support' },
  { value: 'ANIMAL_RESCUE', label: 'Animal Rescue' },
  { value: 'INFRASTRUCTURE_SUPPORT', label: 'Infrastructure Support' },
];

export default function Register() {
  // Common Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState<UserRole>('citizen');
  
  // Volunteer Specific Fields
  const [area, setArea] = useState('');
  const [skills, setSkills] = useState('');
  const [vtype, setVtype] = useState('GENERAL_HELP'); // Default valid enum value
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'volunteer' && !coords) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCoords({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
            toast({ title: "Location Captured", description: "Your coordinates have been linked." });
          },
          () => {
            toast({ 
              title: "Location Error", 
              description: "Please enable location permissions for volunteer registration.", 
              variant: "destructive" 
            });
          }
        );
      }
    }
  }, [role, coords, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!/^[6-9][0-9]{9}$/.test(mobile)) {
      setIsLoading(false);
      toast({ title: 'Invalid mobile', variant: 'destructive' });
      return;
    }

    if (role === 'volunteer' && (!area || !coords)) {
      setIsLoading(false);
      toast({ title: 'Missing Data', description: 'Area and Location are required for volunteers.', variant: 'destructive' });
      return;
    }

    try {
      const payload = {
        name,
        email,
        password,
        role,
        mobile,
        ...(role === 'volunteer' && {
          area,
          skill: skills,
          latitude: coords?.lat,
          longitude: coords?.lng,
          availability: true,
          vtype: vtype // Now sends the selected valid Enum value
        })
      };

      await register(payload);
      toast({ title: 'Registration successful' });
      navigate('/login');
    } catch (err: any) {
      toast({ title: 'Registration failed', description: err?.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <h1 className="text-2xl font-bold mb-8 text-foreground">Create an account</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile</Label>
                <Input id="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="9876543210" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Register as</Label>
              <div className="grid gap-3">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={cn(
                      'relative flex items-start gap-4 p-4 rounded-lg border-2 text-left transition-all',
                      role === r.value ? 'border-primary bg-primary/5' : 'border-border'
                    )}
                  >
                    <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5', role === r.value ? 'border-primary bg-primary' : 'border-muted-foreground')}>
                      {role === r.value && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{r.label}</p>
                      <p className="text-sm text-muted-foreground">{r.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {role === 'volunteer' && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/20 animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-2">
                  <Activity className="w-4 h-4" />
                  Volunteer Profile Details
                </div>

                <div className="space-y-2">
                  <Label>Volunteer Specialization</Label>
                  <Select onValueChange={setVtype} defaultValue={vtype}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {volunteerTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="area">Preferred Service Area</Label>
                  <Input id="area" placeholder="e.g. Mumbai West" value={area} onChange={(e) => setArea(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Specific Skills</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="skills" className="pl-10" placeholder="e.g. First Aid, Driving" value={skills} onChange={(e) => setSkills(e.target.value)} />
                  </div>
                </div>

                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", coords ? "bg-green-500" : "bg-red-500")} />
                  {coords ? `GPS Locked: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "Waiting for GPS permission..."}
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        </div>
      </div>
      
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-12 text-primary-foreground text-center">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="opacity-80">Empowering citizens and volunteers to build better cities together.</p>
        </div>
      </div>
    </div>
  );
}