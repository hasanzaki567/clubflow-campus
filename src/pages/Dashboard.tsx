import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Calendar, Trophy, TrendingUp, Plus, Menu, Bell, Search, Settings, MessageSquare, Mail, Smartphone, Megaphone, Send, Archive, Filter, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const stats = [
    { title: "Total Members", value: "1,247", change: "+12%", icon: Users, color: "text-blue-600" },
    { title: "Upcoming Events", value: "8", change: "+3", icon: Calendar, color: "text-green-600" },
    { title: "Active Clubs", value: "23", change: "+2", icon: Trophy, color: "text-purple-600" },
    { title: "Engagement Rate", value: "87%", change: "+5%", icon: TrendingUp, color: "text-orange-600" }
  ];

  const recentEvents = [
    { name: "Tech Talk 2024", club: "Computer Science Club", date: "Dec 25", attendees: 85, status: "upcoming" },
    { name: "Art Exhibition", club: "Fine Arts Society", date: "Dec 22", attendees: 120, status: "ongoing" },
    { name: "Cricket Tournament", club: "Sports Club", date: "Dec 20", attendees: 200, status: "completed" }
  ];

  const topClubs = [
    { name: "Computer Science Club", members: 245, growth: "+15%" },
    { name: "Drama Society", members: 189, growth: "+8%" },
    { name: "Photography Club", members: 156, growth: "+12%" },
    { name: "Music Club", members: 134, growth: "+6%" }
  ];

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Smooth scroll to sections
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Sticky Header Skeleton */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div>
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Skeleton */}
        <div className="container mx-auto px-4 py-6 space-y-6">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="space-y-4">
                  <div>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="flex items-center justify-between p-3">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                  <Skeleton className="h-10 w-full" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Navigation Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b transition-all duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-foreground">Campus Dashboard</h1>
                <p className="text-sm text-muted-foreground">Management Hub</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <nav className="flex items-center gap-6">
                <button
                  onClick={() => scrollToSection('overview')}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Overview
                </button>
                <button
                  onClick={() => scrollToSection('events')}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Events
                </button>
                <button
                  onClick={() => scrollToSection('clubs')}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clubs
                </button>
                <button
                  onClick={() => scrollToSection('analytics')}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Analytics
                </button>
              </nav>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 text-sm bg-muted rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary/20 w-48"
                  />
                </div>
                <Button variant="outline" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
                <Link to="/events/new">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t pt-4">
              <nav className="flex flex-col gap-3">
                <button
                  onClick={() => scrollToSection('overview')}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
                >
                  Overview
                </button>
                <button
                  onClick={() => scrollToSection('events')}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
                >
                  Events
                </button>
                <button
                  onClick={() => scrollToSection('clubs')}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
                >
                  Clubs
                </button>
                <button
                  onClick={() => scrollToSection('analytics')}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
                >
                  Analytics
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Welcome Section */}
        <section id="overview" className="scroll-mt-20">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Welcome back! 👋
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Here's what's happening in your campus community today.
            </p>
          </div>
        </section>

        {/* Stats Grid */}
        <section id="analytics" className="scroll-mt-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="shadow-elegant hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                      <p className="text-sm text-green-600 mt-1 font-medium">{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Events */}
          <section id="events" className="xl:col-span-2 scroll-mt-20">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Events
                </CardTitle>
                <CardDescription>Latest activities across all clubs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentEvents.map((event, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{event.name}</p>
                        <p className="text-sm text-muted-foreground">{event.club}</p>
                        <p className="text-sm text-muted-foreground">{event.attendees} attendees</p>
                      </div>
                      <div className="text-right mt-2 sm:mt-0">
                        <p className="text-sm font-medium text-foreground">{event.date}</p>
                        <Badge
                          variant={event.status === 'upcoming' ? 'default' : event.status === 'ongoing' ? 'secondary' : 'outline'}
                          className="mt-1"
                        >
                          {event.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Link to="/events">
                    <Button variant="outline" className="w-full">
                      View All Events
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Top Clubs Sidebar */}
          <section id="clubs" className="scroll-mt-20">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Top Performing Clubs
                </CardTitle>
                <CardDescription>Clubs with highest engagement this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topClubs.map((club, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">{club.name}</p>
                        <p className="text-xs text-muted-foreground">{club.members} members</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="text-xs">{club.growth}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Link to="/clubs">
                    <Button variant="outline" className="w-full">
                      View All Clubs
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
