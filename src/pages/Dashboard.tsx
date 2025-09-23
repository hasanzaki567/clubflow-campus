import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Users, Calendar, Trophy, TrendingUp, Plus, Menu, Bell, Search, Settings, MessageSquare, Mail, Smartphone, Megaphone, Send, Archive, Filter, Star, Shield, UserCheck, UserX, Ban, Eye, EyeOff, Download, Upload, BarChart3, Activity, AlertTriangle, CheckCircle, XCircle, Clock, Globe, Lock, Unlock, Trash2, Edit, MoreHorizontal, UserPlus, Crown, Zap, Database, Server, Wifi, WifiOff, UserCog, Gavel, FileText, PieChart, LineChart, TrendingDown, AlertCircle, Info, Check, X, LogOut, Brain, DollarSign, Handshake } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import InteractiveMap from "@/components/InteractiveMap";
import GamificationSystem from "@/components/GamificationSystem";
import AIRecommendationSystem from "@/components/AIRecommendationSystem";
import ChatSystem from "@/components/ChatSystem";
import BudgetManagement from "@/components/BudgetManagement";
import SponsorshipManagement from "@/components/SponsorshipManagement";

const Dashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showModerationDialog, setShowModerationDialog] = useState(false);
  const [showSystemHealthDialog, setShowSystemHealthDialog] = useState(false);
  const { user, logout } = useUser();
  const queryClient = useQueryClient();

  // Real-time API data fetching
  const { data: userStats, isLoading: userStatsLoading, error: userStatsError } = useQuery({
    queryKey: ['userStats'],
    queryFn: () => apiClient.getUserStats(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: clubStats, isLoading: clubStatsLoading, error: clubStatsError } = useQuery({
    queryKey: ['clubStats'],
    queryFn: () => apiClient.getClubStats(),
    refetchInterval: 30000,
  });

  const { data: eventStats, isLoading: eventStatsLoading, error: eventStatsError } = useQuery({
    queryKey: ['eventStats'],
    queryFn: () => apiClient.getEventStats(),
    refetchInterval: 30000,
  });

  const { data: users, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.getUsers(),
    refetchInterval: 60000, // Refetch every minute
  });

  const { data: clubs, isLoading: clubsLoading, error: clubsError } = useQuery({
    queryKey: ['clubs'],
    queryFn: () => apiClient.getClubs(),
    refetchInterval: 60000,
  });

  const { data: events, isLoading: eventsLoading, error: eventsError } = useQuery({
    queryKey: ['events'],
    queryFn: () => apiClient.getEvents(),
    refetchInterval: 60000,
  });

  // Derived stats from API data
  const stats = [
    {
      title: "Total Members",
      value: userStats?.total_users?.toLocaleString() || "0",
      change: userStats?.new_users_30d ? `+${userStats.new_users_30d}` : "+0",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Upcoming Events",
      value: eventStats?.upcoming_events?.toString() || "0",
      change: eventStats?.total_events ? `+${Math.floor(eventStats.total_events * 0.1)}` : "+0",
      icon: Calendar,
      color: "text-green-600"
    },
    {
      title: "Active Clubs",
      value: clubStats?.total_clubs?.toString() || "0",
      change: clubStats?.new_clubs_30d ? `+${clubStats.new_clubs_30d}` : "+0",
      icon: Trophy,
      color: "text-purple-600"
    },
    {
      title: "Engagement Rate",
      value: "87%",
      change: "+5%",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  const recentEvents = events?.slice(0, 3).map(event => ({
    name: event.title,
    club: event.club_name || "Unknown Club",
    date: new Date(event.event_date).toLocaleDateString(),
    attendees: event.current_attendees || 0,
    status: event.status
  })) || [];

  const topClubs = clubs?.slice(0, 4).map(club => ({
    name: club.name,
    members: club.member_count || 0,
    growth: "+15%" // This would need to be calculated from historical data
  })) || [];

  // Check if any data is loading
  const isLoading = userStatsLoading || clubStatsLoading || eventStatsLoading || usersLoading || clubsLoading || eventsLoading;

  // Error handling
  useEffect(() => {
    if (userStatsError || clubStatsError || eventStatsError || usersError || clubsError || eventsError) {
      toast.error("Failed to load dashboard data. Please refresh the page.");
    }
  }, [userStatsError, clubStatsError, eventStatsError, usersError, clubsError, eventsError]);

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
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50 transition-all duration-300 shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            {/* Logo and Title */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="bg-gradient-to-br from-[hsl(var(--campus-green))] to-[hsl(var(--campus-green))]/80 text-[hsl(var(--campus-navy))] p-1.5 sm:p-2 rounded-lg shadow-sm flex-shrink-0">
                <Users className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="font-bold text-lg sm:text-xl text-foreground truncate">Campus Dashboard</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block truncate">Management Hub</p>
              </div>
            </div>

            {/* User Info and Logout */}
            {user && (
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-muted/50 rounded-lg border">
                  <div className="text-2xl">
                    {user.avatar}
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {user.role === 'admin' ? 'Super Admin' :
                       user.role === 'student' ? 'Student' :
                       user.role.charAt(0).toUpperCase() + user.role.slice(1).replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            )}

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-6">
              <nav className="flex items-center gap-2 xl:gap-4">
                <button
                  onClick={() => scrollToSection('overview')}
                  className="group relative px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 rounded-lg hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <span className="relative z-10">Overview</span>
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-[hsl(var(--campus-green))] to-[hsl(var(--campus-green))]/60 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
                <button
                  onClick={() => scrollToSection('events')}
                  className="group relative px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 rounded-lg hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <span className="relative z-10">Events</span>
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
                <button
                  onClick={() => scrollToSection('clubs')}
                  className="group relative px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 rounded-lg hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <span className="relative z-10">Clubs</span>
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
                <button
                  onClick={() => scrollToSection('analytics')}
                  className="group relative px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 rounded-lg hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <span className="relative z-10">Analytics</span>
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
              </nav>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 xl:gap-3">
                <div className="relative hidden xl:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 text-sm bg-muted/50 rounded-lg border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 w-40 xl:w-48 transition-all duration-300"
                  />
                </div>
                <Button variant="outline" size="sm" className="relative p-2 hover:bg-muted/80 transition-all duration-300">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
                </Button>
                <Button variant="outline" size="sm" className="p-2 hover:bg-muted/80 transition-all duration-300">
                  <Settings className="h-4 w-4" />
                </Button>
                <Link to="/events/new">
                  <Button size="sm" className="bg-gradient-to-r from-[hsl(var(--campus-green))] to-[hsl(var(--campus-green))]/90 hover:from-[hsl(var(--campus-green))]/90 hover:to-[hsl(var(--campus-green))]/80 text-white shadow-sm hover:shadow-md transition-all duration-300">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden xl:inline">Create Event</span>
                    <span className="xl:hidden">New</span>
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
            <div className="md:hidden mt-4 pb-4 border-t border-border/50 pt-4 bg-background/95 backdrop-blur-sm">
              <nav className="flex flex-col gap-2">
                <button
                  onClick={() => scrollToSection('overview')}
                  className="group flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300 rounded-lg text-left"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-[hsl(var(--campus-green))] to-[hsl(var(--campus-green))]/60 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => scrollToSection('events')}
                  className="group flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300 rounded-lg text-left"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                  <span>Events</span>
                </button>
                <button
                  onClick={() => scrollToSection('clubs')}
                  className="group flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300 rounded-lg text-left"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                  <span>Clubs</span>
                </button>
                <button
                  onClick={() => scrollToSection('analytics')}
                  className="group flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300 rounded-lg text-left"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                  <span>Analytics</span>
                </button>

                {/* Mobile Action Buttons */}
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="px-4 space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm bg-muted/50 rounded-lg border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 p-2 hover:bg-muted/80 transition-all duration-300">
                        <Bell className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 p-2 hover:bg-muted/80 transition-all duration-300">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Link to="/events/new" className="flex-1">
                        <Button size="sm" className="w-full bg-gradient-to-r from-[hsl(var(--campus-green))] to-[hsl(var(--campus-green))]/90 hover:from-[hsl(var(--campus-green))]/90 hover:to-[hsl(var(--campus-green))]/80 text-white shadow-sm hover:shadow-md transition-all duration-300">
                          <Plus className="h-4 w-4 mr-2" />
                          New Event
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Admin Tools Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-[hsl(var(--campus-green))] to-[hsl(var(--campus-green))]/80 text-[hsl(var(--campus-navy))] p-3 rounded-xl shadow-lg">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Admin Control Center</h1>
              <p className="text-lg text-muted-foreground">Professional management tools for campus administration</p>
            </div>
          </div>

          {/* Quick Admin Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-[hsl(var(--campus-green))]/10 hover:border-[hsl(var(--campus-green))]/30 transition-all duration-300">
                  <UserPlus className="h-6 w-6 text-[hsl(var(--campus-green))]" />
                  <span className="text-sm font-medium">Add User</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Create a new user account with specified permissions.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="user-name">Full Name</Label>
                    <Input id="user-name" placeholder="Enter full name" />
                  </div>
                  <div>
                    <Label htmlFor="user-email">Email</Label>
                    <Input id="user-email" type="email" placeholder="Enter email address" />
                  </div>
                  <div>
                    <Label htmlFor="user-role">Role</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="club_admin">Club Admin</SelectItem>
                        <SelectItem value="college_admin">College Admin</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="send-welcome" />
                    <Label htmlFor="send-welcome">Send welcome email</Label>
                  </div>
                  <Button className="w-full bg-[hsl(var(--campus-green))] hover:bg-[hsl(var(--campus-green))/90]">
                    Create User Account
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-300">
                  <Database className="h-6 w-6 text-blue-500" />
                  <span className="text-sm font-medium">Export Data</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Export System Data</DialogTitle>
                  <DialogDescription>
                    Download system data in various formats.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Data Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select data to export" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="users">User Database</SelectItem>
                        <SelectItem value="events">Event Records</SelectItem>
                        <SelectItem value="clubs">Club Information</SelectItem>
                        <SelectItem value="analytics">Analytics Report</SelectItem>
                        <SelectItem value="full">Complete System Backup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Format</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select export format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="xlsx">Excel</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="pdf">PDF Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="include-sensitive" />
                    <Label htmlFor="include-sensitive">Include sensitive data</Label>
                  </div>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all duration-300">
                  <BarChart3 className="h-6 w-6 text-purple-500" />
                  <span className="text-sm font-medium">Analytics</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Advanced Analytics Dashboard</DialogTitle>
                  <DialogDescription>
                    Real-time insights and performance metrics.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">98.5%</div>
                      <div className="text-sm text-muted-foreground">System Uptime</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">1,247</div>
                      <div className="text-sm text-muted-foreground">Active Users</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">23</div>
                      <div className="text-sm text-muted-foreground">Active Clubs</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">156</div>
                      <div className="text-sm text-muted-foreground">Events This Month</div>
                    </CardContent>
                  </Card>
                </div>
                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Detailed Report
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-orange-500/10 hover:border-orange-500/30 transition-all duration-300">
                  <Settings className="h-6 w-6 text-orange-500" />
                  <span className="text-sm font-medium">System Settings</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>System Configuration</DialogTitle>
                  <DialogDescription>
                    Manage global system settings and preferences.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Maintenance Mode</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <Switch id="maintenance" />
                        <Label htmlFor="maintenance">Enable maintenance mode</Label>
                      </div>
                    </div>
                    <div>
                      <Label>Email Notifications</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <Switch id="email-notifications" defaultChecked />
                        <Label htmlFor="email-notifications">Enable email notifications</Label>
                      </div>
                    </div>
                    <div>
                      <Label>Registration Status</Label>
                      <Select defaultValue="open">
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open Registration</SelectItem>
                          <SelectItem value="approval">Require Approval</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Max Users per Club</Label>
                      <Input type="number" defaultValue="100" className="mt-2" />
                    </div>
                  </div>
                  <div>
                    <Label>Custom Message</Label>
                    <Textarea placeholder="Enter system-wide announcement..." className="mt-2" />
                  </div>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    Save System Settings
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-300">
                  <Gavel className="h-6 w-6 text-red-500" />
                  <span className="text-sm font-medium">Moderation</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Content Moderation Tools</DialogTitle>
                  <DialogDescription>
                    Manage reported content and user violations.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Reported Content</h4>
                      <Badge variant="destructive">3 pending</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Review and moderate reported posts and comments</p>
                    <Button variant="outline" size="sm">
                      Review Reports
                    </Button>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">User Violations</h4>
                      <Badge variant="secondary">2 active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Handle user misconduct and policy violations</p>
                    <Button variant="outline" size="sm">
                      Manage Violations
                    </Button>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Banned Users</h4>
                      <Badge variant="outline">5 users</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Manage banned user accounts</p>
                    <Button variant="outline" size="sm">
                      View Banned Users
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300">
                  <Server className="h-6 w-6 text-indigo-500" />
                  <span className="text-sm font-medium">System Health</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>System Health Monitor</DialogTitle>
                  <DialogDescription>
                    Real-time system performance and health metrics.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="text-lg font-bold text-green-600">99.9%</div>
                      <div className="text-sm text-muted-foreground">Uptime</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-lg font-bold text-blue-600">1.2s</div>
                      <div className="text-sm text-muted-foreground">Response Time</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-lg font-bold text-purple-600">2.1GB</div>
                      <div className="text-sm text-muted-foreground">Memory Usage</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-lg font-bold text-orange-600">45%</div>
                      <div className="text-sm text-muted-foreground">CPU Usage</div>
                    </CardContent>
                  </Card>
                </div>
                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    <Activity className="h-4 w-4 mr-2" />
                    View Detailed Metrics
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-yellow-500/10 hover:border-yellow-500/30 transition-all duration-300">
                  <Shield className="h-6 w-6 text-yellow-500" />
                  <span className="text-sm font-medium">Security</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Advanced Security Center</DialogTitle>
                  <DialogDescription>
                    Comprehensive security monitoring and threat protection.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Security Overview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Shield className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="text-lg font-bold text-green-600">0</div>
                        <div className="text-sm text-muted-foreground">Security Alerts</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Lock className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="text-lg font-bold text-blue-600">256-bit</div>
                        <div className="text-sm text-muted-foreground">Encryption</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                          <UserCheck className="h-5 w-5 text-purple-500" />
                        </div>
                        <div className="text-lg font-bold text-purple-600">2FA</div>
                        <div className="text-sm text-muted-foreground">Enabled</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Wifi className="h-5 w-5 text-orange-500" />
                        </div>
                        <div className="text-lg font-bold text-orange-600">HTTPS</div>
                        <div className="text-sm text-muted-foreground">Secured</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Security Features */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Access Control</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Password Policy</span>
                          <Badge variant="default">Strong</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Session Timeout</span>
                          <Badge variant="secondary">30 min</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Failed Login Lockout</span>
                          <Badge variant="outline">5 attempts</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">IP Whitelist</span>
                          <Badge variant="destructive">Disabled</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Threat Protection</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">DDoS Protection</span>
                          <Badge variant="default">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">SQL Injection Prevention</span>
                          <Badge variant="default">Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">XSS Protection</span>
                          <Badge variant="default">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Rate Limiting</span>
                          <Badge variant="secondary">100 req/min</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Security Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" className="flex-1">
                      <Lock className="h-4 w-4 mr-2" />
                      Security Audit
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Export Security Log
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Settings className="h-4 w-4 mr-2" />
                      Security Settings
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="clubs" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Club Control
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="gamification" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Gamification
            </TabsTrigger>
            <TabsTrigger value="ai-recommendations" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Recommendations
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              System
            </TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>Manage user accounts, permissions, and access levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* User Search and Filter */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search users..." className="pl-10" />
                    </div>
                    <Select>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="student">Students</SelectItem>
                        <SelectItem value="club_admin">Club Admins</SelectItem>
                        <SelectItem value="college_admin">College Admins</SelectItem>
                        <SelectItem value="banned">Banned Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* User List */}
                  <div className="space-y-3">
                    {users?.slice(0, 10).map((user, index) => (
                      <div key={user.id || index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--campus-green))] to-[hsl(var(--campus-green))]/80 rounded-full flex items-center justify-center text-[hsl(var(--campus-navy))] font-bold">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <p className="text-xs text-muted-foreground">Joined {new Date(user.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={user.role === 'college_admin' ? 'default' : user.role === 'club_admin' ? 'secondary' : 'outline'}>
                            {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                          <Badge variant={user.is_active ? 'default' : 'destructive'}>
                            {user.is_active ? 'active' : 'inactive'}
                          </Badge>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Ban className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirm User Action</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to {user.is_active ? 'deactivate' : 'activate'} this user account?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                                    {user.is_active ? 'Deactivate User' : 'Activate User'}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-muted-foreground">
                        No users found
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Club Management Tab */}
          <TabsContent value="clubs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Club Administration
                </CardTitle>
                <CardDescription>Manage clubs, approve requests, and monitor activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="bg-[hsl(var(--campus-green))] hover:bg-[hsl(var(--campus-green))/90]">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Club
                    </Button>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter Clubs
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    {clubs?.slice(0, 6).map((club, index) => (
                      <div key={club.id || index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--campus-green))] to-[hsl(var(--campus-green))]/80 rounded-xl flex items-center justify-center text-[hsl(var(--campus-navy))] font-bold">
                            {club.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-medium">{club.name}</p>
                            <p className="text-sm text-muted-foreground">{club.member_count} members • Admin: {club.admin_name}</p>
                            <p className="text-xs text-muted-foreground">Created {new Date(club.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={club.is_active ? 'default' : 'secondary'}>
                            {club.is_active ? 'active' : 'inactive'}
                          </Badge>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            {club.is_active && (
                              <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                  <X className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Club</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{club.name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                                    Delete Club
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-muted-foreground">
                        No clubs found
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Event Management Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Event Management
                </CardTitle>
                <CardDescription>Monitor and manage all campus events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="bg-[hsl(var(--campus-green))] hover:bg-[hsl(var(--campus-green))/90]">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Event
                    </Button>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter Events
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {events?.slice(0, 8).map((event, index) => {
                      const eventDate = new Date(event.event_date);
                      const now = new Date();
                      const isUpcoming = eventDate > now;
                      const isPast = eventDate < now;

                      let eventType = 'upcoming';
                      if (isPast) eventType = 'completed';
                      else if (event.status === 'ongoing') eventType = 'ongoing';

                      return (
                        <div key={event.id || index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                              {event.title.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-medium">{event.title}</p>
                              <p className="text-sm text-muted-foreground">{event.club_name || 'Unknown Club'} • {event.current_attendees || 0} attendees</p>
                              <p className="text-xs text-muted-foreground">{eventDate.toLocaleDateString()} {eventDate.toLocaleTimeString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={event.status === 'approved' ? 'default' : 'secondary'}>
                              {event.status}
                            </Badge>
                            <Badge variant="outline">{eventType}</Badge>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              {event.status === 'pending' && (
                                <>
                                  <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }) || (
                      <div className="text-center py-8 text-muted-foreground">
                        No events found
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            {/* Interactive Map Section */}
            <InteractiveMap height="500px" showControls={true} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    User Activity Report
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Comprehensive user engagement analytics</p>
                  <Button className="w-full bg-[hsl(var(--campus-green))] hover:bg-[hsl(var(--campus-green))/90]">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Club Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Club engagement and growth metrics</p>
                  <Button variant="outline" className="w-full">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    System Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Platform usage statistics and trends</p>
                  <Button variant="outline" className="w-full">
                    <LineChart className="h-4 w-4 mr-2" />
                    View Metrics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Gamification Tab */}
          <TabsContent value="gamification" className="space-y-6">
            <GamificationSystem />
          </TabsContent>

          {/* AI Recommendations Tab */}
          <TabsContent value="ai-recommendations" className="space-y-6">
            <AIRecommendationSystem maxItems={8} showExplanations={true} />
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Services</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email Service</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">File Storage</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600">Online</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Data Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export All Data
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Archive className="h-4 w-4 mr-2" />
                    Create Backup
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear All Data
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>⚠️ DANGER ZONE</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete ALL system data. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                          I Understand - Delete Everything
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Chat System */}
      <ChatSystem />
    </div>
  );
};

export default Dashboard;
