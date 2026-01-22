import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { 
  MapPin, 
  Users, 
  Shield, 
  ArrowRight, 
  CheckCircle2, 
  Clock,
  BarChart3,
  MessageSquare
} from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: 'Report Issues',
    description: 'Easily report local problems like potholes, broken streetlights, or graffiti with photos and precise locations.',
  },
  {
    icon: Users,
    title: 'Volunteer Network',
    description: 'Connect with dedicated community volunteers who are ready to take action and resolve issues.',
  },
  {
    icon: Shield,
    title: 'Real-time Tracking',
    description: 'Track the status of your reports from submission to resolution with transparent updates.',
  },
  {
    icon: BarChart3,
    title: 'City Analytics',
    description: 'Administrators gain insights into community issues with comprehensive dashboards and reports.',
  },
];

const stats = [
  { value: '10K+', label: 'Issues Resolved' },
  { value: '5K+', label: 'Active Citizens' },
  { value: '500+', label: 'Volunteers' },
  { value: '50+', label: 'Cities' },
];

const howItWorks = [
  {
    step: '01',
    title: 'Report an Issue',
    description: 'Snap a photo, describe the problem, and pin the location on the map.',
    icon: MapPin,
  },
  {
    step: '02',
    title: 'Get Assigned',
    description: 'A volunteer from your community is assigned to address the issue.',
    icon: Users,
  },
  {
    step: '03',
    title: 'Track Progress',
    description: 'Receive real-time updates as your issue moves through the resolution process.',
    icon: Clock,
  },
  {
    step: '04',
    title: 'Issue Resolved',
    description: 'Get notified when the issue is resolved and rate the service.',
    icon: CheckCircle2,
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]" />
        
        <div className="container mx-auto px-4 py-16 sm:py-24 lg:py-32 relative">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Trusted by 50+ Cities Worldwide
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Empowering Communities Through{' '}
              <span className="text-gradient">Smart Action</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              UrbanAid connects citizens, volunteers, and city administrators to identify, 
              report, and resolve local issues faster than ever before.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="w-full sm:w-auto gap-2">
                <Link to="/citizen">
                  <MapPin className="w-5 h-5" />
                  Report an Issue
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto gap-2">
                <Link to="/register">
                  <Users className="w-5 h-5" />
                  Join as Volunteer
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-primary mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Improve Your City
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A comprehensive platform designed to streamline civic engagement and community action.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="card-interactive p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple steps to make a real difference in your community.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <div key={item.step} className="relative">
                <div className="card-elevated p-6 h-full">
                  <span className="text-5xl font-bold text-primary/10">{item.step}</span>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mt-4 mb-3">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-3 w-6 h-6 text-muted-foreground/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="card-elevated p-8 sm:p-12 text-center gradient-hero text-primary-foreground rounded-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
              Join thousands of citizens and volunteers working together to build better communities.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="secondary" asChild className="w-full sm:w-auto">
                <Link to="/register">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="ghost" asChild className="w-full sm:w-auto text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/about" className="gap-2">
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">UrbanAid</span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-6">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
            </nav>
            <p className="text-sm text-muted-foreground">
              © 2024 UrbanAid. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
