import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, Calendar, MessageSquare, Trophy, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: Users,
      title: "Club Management",
      description: "Organize and manage your campus clubs with ease"
    },
    {
      icon: Calendar,
      title: "Event Planning",
      description: "Plan, track, and manage events with RSVP functionality"
    },
    {
      icon: MessageSquare,
      title: "Inter-College Collaboration",
      description: "Connect and collaborate with clubs from other colleges"
    },
    {
      icon: Trophy,
      title: "Analytics & Insights",
      description: "Track engagement and get AI-powered recommendations"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">Campus Club Suite</h1>
              <p className="text-sm text-muted-foreground">Management Platform</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Streamline Your Campus Club Management
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect, organize, and grow your campus community with our comprehensive club management platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="gap-2">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Everything You Need</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful tools to manage clubs, events, and foster collaboration across your campus.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-elegant hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-primary/10 text-primary p-3 rounded-full w-fit mx-auto mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-card/50 border-y border-border py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary">500+</p>
              <p className="text-muted-foreground">Active Clubs</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">50k+</p>
              <p className="text-muted-foreground">Students</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">1000+</p>
              <p className="text-muted-foreground">Events Organized</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">200+</p>
              <p className="text-muted-foreground">Colleges</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Transform Your Campus Experience?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of students and clubs already using Campus Club Suite.
          </p>
          <Link to="/signup">
            <Button size="lg">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 Campus Club Suite. Built for students, by students.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
