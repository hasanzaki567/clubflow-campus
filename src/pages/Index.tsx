import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, Calendar, MessageSquare, Trophy, ArrowRight, Sparkles, Star, Zap, Plus, Search, Bell, Settings, UserPlus, BookOpen, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Index = () => {
  console.log('Index component is rendering...');

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  const features = [
    {
      icon: Users,
      title: "Club Management",
      description: "Organize and manage your campus clubs with ease",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: Calendar,
      title: "Event Planning",
      description: "Plan, track, and manage events with RSVP functionality",
      gradient: "from-green-500/20 to-emerald-500/20"
    },
    {
      icon: MessageSquare,
      title: "Inter-College Collaboration",
      description: "Connect and collaborate with clubs from other colleges",
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      icon: Trophy,
      title: "Analytics & Insights",
      description: "Track engagement and get AI-powered recommendations",
      gradient: "from-orange-500/20 to-red-500/20"
    }
  ];

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe all sections for scroll animations
    const sections = document.querySelectorAll('section');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--campus-navy))] via-[hsl(220,26%,18%)] to-[hsl(var(--campus-navy))]" style={{
      transform: 'perspective(1000px)',
      transformStyle: 'preserve-3d',
      backgroundImage: `
        radial-gradient(circle at 20% 50%, hsl(var(--campus-green))/0.1 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, hsl(var(--campus-green))/0.1 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, hsl(var(--campus-green))/0.05 0%, transparent 50%)
      `,
      backgroundSize: '800px 800px, 600px 600px, 900px 900px',
      backgroundPosition: '0% 0%, 100% 0%, 50% 100%'
    }}>
      {/* Glass Morphism Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-xl bg-white/5 supports-[backdrop-filter]:bg-white/10 transition-all duration-500"
        style={{
          transform: `translateY(${Math.min(scrollY * 0.1, 100)}px)`,
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          background: `rgba(255, 255, 255, 0.05)`,
          borderImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent) 1'
        }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-[hsl(var(--campus-green))] rounded-lg blur-sm opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-[hsl(var(--campus-green))] to-[hsl(var(--campus-green))]/80 text-[hsl(var(--campus-navy))] p-2 rounded-lg shadow-lg">
                  <GraduationCap className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h1 className="font-bold text-xl text-white tracking-tight" style={{
                  textShadow: '0 0 20px hsl(var(--campus-green)), 0 0 40px hsl(var(--campus-green))',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>Campbuzz</h1>
                <p className="text-sm text-gray-300/80">Campus Management</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 backdrop-blur-sm bg-white/5 shadow-lg hover:shadow-xl"
                >
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Professional Asymmetric Layout */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Professional Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(76, 175, 80, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(76, 175, 80, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        {/* Floating elements with professional positioning */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-[hsl(var(--campus-green))]/10 rounded-full blur-xl animate-breathe-dramatic"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-[hsl(var(--campus-green))]/15 rounded-full blur-lg animate-breathe-dramatic" style={{animationDelay: '0s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-[hsl(var(--campus-green))]/20 rounded-full blur-md animate-breathe-dramatic" style={{animationDelay: '0s'}}></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Professional Hero Layout */}
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              {/* Left Content Column - 7/12 width */}
              <div className="lg:col-span-7 text-center lg:text-left space-y-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center px-4 py-2 bg-[hsl(var(--campus-green))]/10 backdrop-blur-sm text-[hsl(var(--campus-green))] text-sm font-semibold rounded-full border border-[hsl(var(--campus-green))]/20 shadow-lg">
                    <span className="relative">
                      🚀 Now Serving 200+ Colleges
                      <div className="absolute -inset-1 bg-gradient-to-r from-[hsl(var(--campus-green))]/20 to-transparent rounded-full blur opacity-75"></div>
                    </span>
                  </div>

                  <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.9] tracking-tight text-white" style={{
                    textShadow: '0 0 10px hsl(var(--campus-green)), 0 0 20px hsl(var(--campus-green))',
                    lineHeight: '1.1',
                    letterSpacing: '-0.02em'
                  }}>
                    Streamline Your
                    <br />
                    <span className="relative text-transparent bg-gradient-to-r from-[hsl(var(--campus-green))] via-white to-[hsl(var(--campus-green))] bg-clip-text" style={{
                      background: 'linear-gradient(135deg, hsl(var(--campus-green)) 0%, #ffffff 50%, hsl(var(--campus-green)) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      Campus Club
                      <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[hsl(var(--campus-green))] to-transparent opacity-60"></div>
                    </span>
                    <br />
                    Management
                  </h1>

                  <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 max-w-2xl leading-relaxed font-light" style={{lineHeight: '1.6', letterSpacing: '0.01em'}}>
                    Connect, organize, and grow your campus community with our comprehensive club management platform designed for the modern educational experience.
                  </p>
                </div>

                {/* Professional CTA Layout */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center pt-4">
                  <Link to="/signup" className="group">
                    <Button size="lg" className="bg-[hsl(var(--campus-green))] hover:bg-[hsl(var(--campus-green))]/90 text-[hsl(var(--campus-navy))] font-semibold px-10 py-5 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] relative overflow-hidden border-2 border-[hsl(var(--campus-green))]/20 hover:border-[hsl(var(--campus-green))]/40" style={{
                      transform: 'perspective(1000px)',
                      boxShadow: '0 10px 25px -5px hsl(var(--campus-green)), inset 0 1px 0 hsl(45, 100%, 70%)',
                      minWidth: '200px'
                    }}>
                      <span className="relative z-10 flex items-center gap-3">
                        View Web
                        <div className="w-2 h-2 bg-[hsl(var(--campus-navy))]/40 rounded-full group-hover:bg-[hsl(var(--campus-navy))]/60 transition-all duration-300 group-hover:scale-110"></div>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                    </Button>
                  </Link>

                  <Link to="/signup" className="group">
                    <Button variant="outline" size="lg" className="border-2 border-[hsl(var(--campus-green))] text-[hsl(var(--campus-green))] hover:bg-[hsl(var(--campus-green))] hover:text-[hsl(var(--campus-navy))] font-semibold px-10 py-5 text-lg transition-all duration-500 hover:scale-105 backdrop-blur-sm bg-white/5" style={{minWidth: '200px'}}>
                      <span className="flex items-center gap-3">
                        Watch Video
                        <div className="w-1.5 h-1.5 bg-[hsl(var(--campus-green))] rounded-full group-hover:bg-[hsl(var(--campus-navy))] transition-colors"></div>
                      </span>
                    </Button>
                  </Link>
                </div>

                {/* Trust indicators with professional spacing */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Free forever</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                    <span>Setup in minutes</span>
                  </div>
                </div>
              </div>

              {/* Right Visual Column - 5/12 width */}
              <div className="lg:col-span-5 relative">
                <div className="relative">
                  {/* Main visual container */}
                  <div className="relative bg-gradient-to-br from-[hsl(var(--campus-green))]/10 to-[hsl(var(--campus-green))]/5 backdrop-blur-sm rounded-3xl p-8 border border-[hsl(var(--campus-green))]/20 shadow-2xl">
                    {/* Floating cards simulation */}
                    <div className="space-y-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 animate-float">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-3 h-3 bg-[hsl(var(--campus-green))] rounded-full"></div>
                          <span className="text-white text-sm font-medium">Active Events</span>
                        </div>
                        <div className="text-2xl font-bold text-white">24</div>
                      </div>

                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 animate-float" style={{animationDelay: '2s'}}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-white text-sm font-medium">Total Members</span>
                        </div>
                        <div className="text-2xl font-bold text-white">1,247</div>
                      </div>

                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 animate-float" style={{animationDelay: '4s'}}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-white text-sm font-medium">Growth Rate</span>
                        </div>
                        <div className="text-2xl font-bold text-white">+23%</div>
                      </div>
                    </div>

                    {/* Central logo/icon - Perfect center of all cards */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-50">
                      <div className="relative">
                        <div className="absolute inset-0 bg-[hsl(var(--campus-green))] rounded-full blur-xl opacity-25 animate-pulse"></div>
                        <div className="relative bg-gradient-to-br from-[hsl(var(--campus-green))] to-[hsl(var(--campus-green))]/80 text-[hsl(var(--campus-navy))] p-6 rounded-2xl shadow-xl">
                          <Users className="h-12 w-12" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-[hsl(var(--campus-green))]/30 rounded-full animate-bounce"></div>
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-500/30 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
                  <div className="absolute top-1/2 -left-6 w-4 h-4 bg-purple-500/30 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-16 bg-gradient-to-br from-[hsl(var(--campus-navy))] via-[hsl(220,26%,18%)] to-[hsl(var(--campus-navy))]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="mb-4">
              <span className="inline-block px-4 py-2 bg-[hsl(var(--campus-green))]/10 text-[hsl(var(--campus-green))] text-sm font-semibold rounded-full border border-[hsl(var(--campus-green))]/20">
                ⚡ Quick Actions
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              Get Started in Seconds
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Jump into the most popular actions with one click
            </p>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="group bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--campus-green))] to-[hsl(var(--campus-green))]/80 rounded-2xl flex items-center justify-center text-[hsl(var(--campus-navy))] text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <UserPlus className="h-8 w-8" />
                </div>
                <h3 className="text-white font-semibold mb-2">Join Club</h3>
                <p className="text-gray-400 text-sm mb-4">Browse and join campus clubs</p>
                <Link to="/clubs">
                  <Button size="sm" className="bg-[hsl(var(--campus-green))] hover:bg-[hsl(var(--campus-green))/90] text-[hsl(var(--campus-navy))] font-medium px-4 py-2 text-sm">
                    Join Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Plus className="h-8 w-8" />
                </div>
                <h3 className="text-white font-semibold mb-2">Create Event</h3>
                <p className="text-gray-400 text-sm mb-4">Plan and organize new events</p>
                <Link to="/events/new">
                  <Button size="sm" variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white px-4 py-2 text-sm">
                    Create Event
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="text-white font-semibold mb-2">Browse Clubs</h3>
                <p className="text-gray-400 text-sm mb-4">Discover clubs by category</p>
                <Link to="/clubs">
                  <Button size="sm" variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-4 py-2 text-sm">
                    Browse
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-8 w-8" />
                </div>
                <h3 className="text-white font-semibold mb-2">View Dashboard</h3>
                <p className="text-gray-400 text-sm mb-4">Access your personal dashboard</p>
                <Link to="/dashboard">
                  <Button size="sm" variant="outline" className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white px-4 py-2 text-sm">
                    Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Additional Quick Actions Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/clubs" className="group">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-lg font-bold mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-6 w-6" />
                  </div>
                  <h4 className="text-white font-medium text-sm mb-1">Find Clubs</h4>
                  <p className="text-gray-400 text-xs">Discover by interest</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/events" className="group">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center text-white text-lg font-bold mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <h4 className="text-white font-medium text-sm mb-1">Upcoming Events</h4>
                  <p className="text-gray-400 text-xs">See what's happening</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/signup" className="group">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-lg font-bold mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Bell className="h-6 w-6" />
                  </div>
                  <h4 className="text-white font-medium text-sm mb-1">Notifications</h4>
                  <p className="text-gray-400 text-xs">Stay updated</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/signup" className="group">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-lg font-bold mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Settings className="h-6 w-6" />
                  </div>
                  <h4 className="text-white font-medium text-sm mb-1">Settings</h4>
                  <p className="text-gray-400 text-xs">Customize experience</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Quick Actions - Always Visible */}
      <div className="fixed bottom-6 right-6 z-50 space-y-3">
        <div className="flex flex-col gap-3">
          <Link to="/clubs" className="group">
            <div className="w-14 h-14 bg-gradient-to-br from-[hsl(var(--campus-green))] to-[hsl(var(--campus-green))]/80 rounded-full flex items-center justify-center text-[hsl(var(--campus-navy))] shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 hover:-translate-y-1" style={{
              boxShadow: '0 10px 25px -5px hsl(var(--campus-green)), inset 0 2px 4px rgba(255, 255, 255, 0.2)'
            }}>
              <UserPlus className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </Link>

          <Link to="/events/new" className="group">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 hover:-translate-y-1">
              <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
            </div>
          </Link>

          <Link to="/clubs" className="group">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 hover:-translate-y-1">
              <Search className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </Link>

          <Link to="/signup" className="group">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 hover:-translate-y-1">
              <Bell className="h-6 w-6 group-hover:animate-pulse transition-all duration-300" />
            </div>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 relative animate-on-scroll">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(var(--campus-green))]/5 to-transparent"></div>

        <div className="text-center mb-16 relative z-10">
          <div className="mb-4 animate-scale-in">
            <span className="inline-block px-4 py-2 bg-[hsl(var(--campus-green))]/10 text-[hsl(var(--campus-green))] text-sm font-semibold rounded-full border border-[hsl(var(--campus-green))]/20">
              ✨ Features
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight animate-slide-up" style={{
            textShadow: `
              0 0 2px hsl(var(--campus-green)),
              0 0 4px hsl(var(--campus-green)),
              2px 2px 4px hsl(220, 26%, 10%)
            `
          }}>Everything You Need</h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed animate-fade-up animate-delay-200">
            Powerful tools to manage clubs, events, and foster collaboration across your campus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group shadow-2xl hover:shadow-3xl transition-all duration-700 border-0 bg-gradient-to-br from-[hsl(var(--card))] to-[hsl(var(--card))]/80 hover:-translate-y-4 hover:rotate-x-12 hover:scale-105 relative overflow-hidden backdrop-blur-sm"
              style={{
                transform: `perspective(1000px) rotateX(${index * 2}deg)`,
                transformStyle: 'preserve-3d',
                boxShadow: `
                  0 20px 40px -10px hsl(220, 13%, 15%),
                  0 10px 20px -5px hsl(220, 13%, 20%),
                  inset 0 1px 0 hsl(220, 13%, 35%)
                `
              }}
            >
              {/* Individual gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

              {/* Animated border */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-[hsl(var(--campus-green))]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>

              {/* Floating particles */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-[hsl(var(--campus-green))]/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-bounce" style={{animationDelay: '0s'}}></div>
              <div className="absolute bottom-4 left-4 w-1 h-1 bg-[hsl(var(--campus-green))]/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-bounce" style={{animationDelay: '0.5s'}}></div>

              <CardHeader className="text-center relative z-10">
                <div className="relative">
                  {/* Glow effect behind icon */}
                  <div className="absolute inset-0 bg-[hsl(var(--campus-green))]/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-150"></div>
                  <div className="relative bg-gradient-to-br from-[hsl(var(--campus-green))]/20 to-[hsl(var(--campus-green))]/10 text-[hsl(var(--campus-green))] p-4 rounded-full w-fit mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:shadow-[hsl(var(--campus-green))]/25 transition-all duration-500 group-hover:scale-110 border border-[hsl(var(--campus-green))]/20 hover-lift" style={{
                    transform: 'translateZ(20px)',
                    boxShadow: '0 10px 20px -5px hsl(var(--campus-green))'
                  }}>
                    <feature.icon className="h-7 w-7 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-white group-hover:text-[hsl(var(--campus-green))] transition-colors duration-300 relative animate-stagger-up" style={{transform: 'translateZ(10px)'}}>
                  {feature.title}
                  {/* Sparkle effect */}
                  <Sparkles className="absolute -top-2 -right-2 h-4 w-4 text-[hsl(var(--campus-green))] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </CardTitle>
              </CardHeader>
              <CardContent style={{transform: 'translateZ(5px)'}} className="relative z-10">
                <CardDescription className="text-center text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300 animate-fade-up animate-delay-300">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-[hsl(var(--campus-navy))] to-[hsl(var(--campus-navy))/90] text-white py-20 animate-on-scroll">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="animate-scale-in">
              <p className="text-5xl font-bold text-[hsl(var(--campus-green))] mb-2 animate-button-pulse">500+</p>
              <p className="text-white/90 font-medium">Active Clubs</p>
            </div>
            <div className="animate-scale-in animate-delay-100">
              <p className="text-5xl font-bold text-[hsl(var(--campus-green))] mb-2 animate-button-pulse" style={{animationDelay: '0.5s'}}>50k+</p>
              <p className="text-white/90 font-medium">Students</p>
            </div>
            <div className="animate-scale-in animate-delay-200">
              <p className="text-5xl font-bold text-[hsl(var(--campus-green))] mb-2 animate-button-pulse" style={{animationDelay: '1s'}}>1000+</p>
              <p className="text-white/90 font-medium">Events Organized</p>
            </div>
            <div className="animate-scale-in animate-delay-300">
              <p className="text-5xl font-bold text-[hsl(var(--campus-green))] mb-2 animate-button-pulse" style={{animationDelay: '1.5s'}}>200+</p>
              <p className="text-white/90 font-medium">Colleges</p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Vision & Roadmap Section */}
      <section className="py-20 bg-gradient-to-br from-[hsl(var(--campus-navy))] via-[hsl(220,26%,18%)] to-[hsl(var(--campus-navy))]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="mb-4">
              <span className="inline-block px-4 py-2 bg-[hsl(var(--campus-green))]/10 text-[hsl(var(--campus-green))] text-sm font-semibold rounded-full border border-[hsl(var(--campus-green))]/20">
                🚀 Platform Vision & Roadmap
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight" style={{
              textShadow: '0 0 2px hsl(var(--campus-green)), 0 0 4px hsl(var(--campus-green))'
            }}>
              Building the Future of Campus Management
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Our vision is to create the most comprehensive, student-centered platform for campus life management.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Vision Statement */}
            <div className="text-center mb-16">
              <Card className="bg-gradient-to-br from-[hsl(var(--campus-green))]/10 to-[hsl(var(--campus-green))]/5 border-[hsl(var(--campus-green))]/30 shadow-2xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">Our Vision</h3>
                  <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
                    To empower every student and campus organization with the tools they need to create meaningful connections,
                    organize successful events, and build thriving communities. We envision a future where every campus
                    runs like a well-oiled machine, where students can focus on what matters most - learning, growing,
                    and making lasting memories.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Roadmap Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {/* Currently Available */}
              <Card className="bg-white/5 backdrop-blur-sm border-[hsl(var(--campus-green))]/30 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                <CardHeader>
                  <CardTitle className="text-[hsl(var(--campus-green))] flex items-center gap-3">
                    <div className="w-4 h-4 bg-[hsl(var(--campus-green))] rounded-full animate-pulse"></div>
                    Currently Available
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[hsl(var(--campus-green))] rounded-full mt-2"></div>
                    <div>
                      <p className="text-white font-medium">Club Management</p>
                      <p className="text-gray-400 text-sm">Create and manage campus clubs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[hsl(var(--campus-green))] rounded-full mt-2"></div>
                    <div>
                      <p className="text-white font-medium">Event Planning</p>
                      <p className="text-gray-400 text-sm">Organize and track campus events</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[hsl(var(--campus-green))] rounded-full mt-2"></div>
                    <div>
                      <p className="text-white font-medium">Analytics Dashboard</p>
                      <p className="text-gray-400 text-sm">Track engagement and insights</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[hsl(var(--campus-green))] rounded-full mt-2"></div>
                    <div>
                      <p className="text-white font-medium">Inter-College Collaboration</p>
                      <p className="text-gray-400 text-sm">Connect with other universities</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Coming Soon */}
              <Card className="bg-white/5 backdrop-blur-sm border-blue-500/30 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center gap-3">
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                    Coming Soon
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-white font-medium">Mobile App</p>
                      <p className="text-gray-400 text-sm">iOS and Android applications</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-white font-medium">AI Event Assistant</p>
                      <p className="text-gray-400 text-sm">Smart event planning suggestions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-white font-medium">Virtual Events</p>
                      <p className="text-gray-400 text-sm">Online event hosting capabilities</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-white font-medium">Resource Sharing</p>
                      <p className="text-gray-400 text-sm">Club resource and material exchange</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Future Vision */}
              <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                <CardHeader>
                  <CardTitle className="text-purple-400 flex items-center gap-3">
                    <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
                    Future Vision
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-white font-medium">Campus Marketplace</p>
                      <p className="text-gray-400 text-sm">Buy/sell items within campus</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-white font-medium">Mentorship Platform</p>
                      <p className="text-gray-400 text-sm">Connect students with mentors</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-white font-medium">Career Services</p>
                      <p className="text-gray-400 text-sm">Job boards and career resources</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-white font-medium">Campus Social Network</p>
                      <p className="text-gray-400 text-sm">Connect with entire student body</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Community Input Section */}
            <div className="text-center">
              <Card className="bg-gradient-to-br from-[hsl(var(--campus-green))]/10 to-[hsl(var(--campus-green))]/5 border-[hsl(var(--campus-green))]/30 shadow-2xl max-w-4xl mx-auto">
                <CardContent className="p-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Help Shape Our Future</h3>
                  <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                    We're building Campus Club Suite with input from students like you. Your feedback helps us prioritize
                    features and create the best possible platform for campus life.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/signup">
                      <Button size="lg" className="bg-[hsl(var(--campus-green))] hover:bg-[hsl(var(--campus-green))/90] text-[hsl(var(--campus-navy))] font-semibold px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300">
                        Join Beta Program
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button variant="outline" size="lg" className="border-[hsl(var(--campus-green))] text-[hsl(var(--campus-green))] hover:bg-[hsl(var(--campus-green))] hover:text-[hsl(var(--campus-navy))] font-semibold px-8 py-4">
                        Request Feature
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Matrix */}
      <section className="py-20 bg-gradient-to-br from-[hsl(220,26%,18%)] to-[hsl(var(--campus-navy))]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="mb-4">
              <span className="inline-block px-4 py-2 bg-[hsl(var(--campus-green))]/10 text-[hsl(var(--campus-green))] text-sm font-semibold rounded-full border border-[hsl(var(--campus-green))]/20">
                ⚡ Feature Comparison
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight" style={{
              textShadow: '0 0 2px hsl(var(--campus-green)), 0 0 4px hsl(var(--campus-green))'
            }}>
              Why Choose Campus Club Suite?
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Compare our features with traditional club management methods.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Traditional Method */}
              <Card className="bg-red-500/10 border-red-500/20 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    Traditional Methods
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-300">Manual event tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-300">Limited collaboration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-300">No analytics insights</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-300">Time-consuming setup</span>
                  </div>
                </CardContent>
              </Card>

              {/* VS */}
              <div className="flex items-center justify-center">
                <div className="bg-[hsl(var(--campus-green))]/20 text-[hsl(var(--campus-green))] px-6 py-3 rounded-full border border-[hsl(var(--campus-green))]/30">
                  <span className="text-2xl font-bold">VS</span>
                </div>
              </div>

              {/* Campus Club Suite */}
              <Card className="bg-[hsl(var(--campus-green))]/10 border-[hsl(var(--campus-green))]/30 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-[hsl(var(--campus-green))] flex items-center gap-2">
                    <div className="w-3 h-3 bg-[hsl(var(--campus-green))] rounded-full"></div>
                    Campus Club Suite
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-[hsl(var(--campus-green))]/30 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-[hsl(var(--campus-green))] rounded-full"></div>
                    </div>
                    <span className="text-gray-300">Automated event management</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-[hsl(var(--campus-green))]/30 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-[hsl(var(--campus-green))] rounded-full"></div>
                    </div>
                    <span className="text-gray-300">Inter-college collaboration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-[hsl(var(--campus-green))]/30 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-[hsl(var(--campus-green))] rounded-full"></div>
                    </div>
                    <span className="text-gray-300">AI-powered analytics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-[hsl(var(--campus-green))]/30 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-[hsl(var(--campus-green))] rounded-full"></div>
                    </div>
                    <span className="text-gray-300">5-minute setup</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-gradient-to-br from-[hsl(var(--campus-navy))] via-[hsl(220,26%,18%)] to-[hsl(var(--campus-navy))]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-4">
              <span className="inline-block px-4 py-2 bg-[hsl(var(--campus-green))]/10 text-[hsl(var(--campus-green))] text-sm font-semibold rounded-full border border-[hsl(var(--campus-green))]/20">
                🎮 Try It Out
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight" style={{
              textShadow: '0 0 2px hsl(var(--campus-green)), 0 0 4px hsl(var(--campus-green))'
            }}>
              See Campus Club Suite in Action
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              Take a quick tour of our platform features without signing up.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--campus-green))] to-[hsl(var(--campus-green))]/80 rounded-2xl flex items-center justify-center text-[hsl(var(--campus-navy))] text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    1
                  </div>
                  <h3 className="text-white font-semibold mb-2">Create Events</h3>
                  <p className="text-gray-400 text-sm">Set up and manage campus events with ease</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    2
                  </div>
                  <h3 className="text-white font-semibold mb-2">Track Attendance</h3>
                  <p className="text-gray-400 text-sm">Monitor participation and engagement metrics</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    3
                  </div>
                  <h3 className="text-white font-semibold mb-2">Get Insights</h3>
                  <p className="text-gray-400 text-sm">Analyze data and improve your events</p>
                </CardContent>
              </Card>
            </div>

            <Link to="/signup">
              <Button size="lg" className="bg-[hsl(var(--campus-green))] hover:bg-[hsl(var(--campus-green))/90] text-[hsl(var(--campus-navy))] font-semibold px-10 py-5 text-lg shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 hover:scale-105">
                Start Interactive Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Support & Contact Section */}
      <section className="py-20 bg-gradient-to-br from-[hsl(220,26%,18%)] to-[hsl(var(--campus-navy))]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-[hsl(var(--campus-green))]/10 text-[hsl(var(--campus-green))] text-sm font-semibold rounded-full border border-[hsl(var(--campus-green))]/20">
                  📞 Support & Contact
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight" style={{
                textShadow: '0 0 2px hsl(var(--campus-green)), 0 0 4px hsl(var(--campus-green))'
              }}>
                We're Here to Help
              </h2>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                Get the support you need to make the most of Campus Club Suite.
              </p>
            </div>

            {/* Support Channels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {/* Email Support */}
              <Card className="bg-white/5 backdrop-blur-sm border-[hsl(var(--campus-green))]/30 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--campus-green))] to-[hsl(var(--campus-green))]/80 rounded-2xl flex items-center justify-center text-[hsl(var(--campus-navy))] text-2xl font-bold mx-auto mb-4">
                    📧
                  </div>
                  <h3 className="text-white font-semibold mb-2">Email Support</h3>
                  <p className="text-gray-400 text-sm mb-4">Get detailed help via email</p>
                  <p className="text-[hsl(var(--campus-green))] font-medium">campbuzzzzz@gmail.com</p>
                  <p className="text-gray-500 text-xs mt-2">Response time: 24-48 hours</p>
                </CardContent>
              </Card>

              {/* Live Chat */}
              <Card className="bg-white/5 backdrop-blur-sm border-blue-500/30 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    💬
                  </div>
                  <h3 className="text-white font-semibold mb-2">Live Chat</h3>
                  <p className="text-gray-400 text-sm mb-4">Instant help when you need it</p>
                  <p className="text-blue-400 font-medium">Available in-app</p>
                  <p className="text-gray-500 text-xs mt-2">Response time: Instant</p>
                </CardContent>
              </Card>

              {/* Community Forum */}
              <Card className="bg-white/5 backdrop-blur-sm border-purple-500/30 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    👥
                  </div>
                  <h3 className="text-white font-semibold mb-2">Community Forum</h3>
                  <p className="text-gray-400 text-sm mb-4">Connect with other users</p>
                  <p className="text-purple-400 font-medium">Coming Soon</p>
                  <p className="text-gray-500 text-xs mt-2">Community-driven support</p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {/* General Inquiries */}
              <Card className="bg-gradient-to-br from-[hsl(var(--campus-green))]/10 to-[hsl(var(--campus-green))]/5 border-[hsl(var(--campus-green))]/30 shadow-2xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <div className="w-3 h-3 bg-[hsl(var(--campus-green))] rounded-full"></div>
                    General Inquiries
                  </h3>
                  <div className="space-y-3 text-gray-300">
                    <p><span className="text-[hsl(var(--campus-green))] font-medium">Email:</span> campbuzzzzz@gmail.com</p>
                    <p><span className="text-[hsl(var(--campus-green))] font-medium">Business Hours:</span> Monday - Friday, 9 AM - 6 PM EST</p>
                    <p><span className="text-[hsl(var(--campus-green))] font-medium">Response Time:</span> Within 24 hours</p>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Support */}
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/30 shadow-2xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    Technical Support
                  </h3>
                  <div className="space-y-3 text-gray-300">
                    <p><span className="text-blue-400 font-medium">Email:</span> campbuzzzzz@gmail.com</p>
                    <p><span className="text-blue-400 font-medium">Priority Support:</span> Available for urgent issues</p>
                    <p><span className="text-blue-400 font-medium">Response Time:</span> Within 12 hours</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Help Resources */}
            <div className="text-center">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl max-w-2xl mx-auto">
                <CardContent className="p-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Self-Help Resources</h3>
                  <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                    Find answers quickly with our comprehensive help resources and documentation.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--campus-green))] to-[hsl(var(--campus-green))]/80 rounded-xl flex items-center justify-center text-[hsl(var(--campus-navy))] text-xl font-bold mx-auto mb-3">
                        📚
                      </div>
                      <h4 className="text-white font-semibold mb-1">Documentation</h4>
                      <p className="text-gray-400 text-sm">Step-by-step guides</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                        🎥
                      </div>
                      <h4 className="text-white font-semibold mb-1">Video Tutorials</h4>
                      <p className="text-gray-400 text-sm">Visual learning guides</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                        ❓
                      </div>
                      <h4 className="text-white font-semibold mb-1">FAQ Center</h4>
                      <p className="text-gray-400 text-sm">Common questions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center bg-gradient-to-br from-[hsl(220,26%,18%)] to-[hsl(var(--campus-navy))] relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-[hsl(var(--campus-green))]/5 rounded-full blur-3xl animate-breathe-dramatic"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-[hsl(var(--campus-green))]/10 rounded-full blur-2xl animate-breathe-dramatic" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[hsl(var(--campus-green))]/5 rounded-full blur-3xl animate-breathe-dramatic" style={{animationDelay: '0s'}}></div>

        <div className="max-w-2xl mx-auto relative z-10">
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-[hsl(var(--campus-green))]/20 text-[hsl(var(--campus-green))] text-sm font-semibold rounded-full border border-[hsl(var(--campus-green))]/30 animate-breathe-dramatic">
              🎯 Join Today
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight" style={{
            textShadow: `
              0 0 2px hsl(var(--campus-green)),
              0 0 4px hsl(var(--campus-green)),
              2px 2px 4px hsl(220, 26%, 10%)
            `,
            transform: 'perspective(1000px) rotateX(5deg)',
            transformStyle: 'preserve-3d'
          }}>
            Ready to Transform Your Campus Experience?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
            Join thousands of students and clubs already using Campus Club Suite.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup">
              <Button size="lg" className="bg-[hsl(var(--campus-green))] hover:bg-[hsl(var(--campus-green))/90] text-[hsl(var(--campus-navy))] font-semibold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 group" style={{
                transform: 'perspective(1000px)',
                boxShadow: '0 10px 20px -5px hsl(var(--campus-green)), inset 0 1px 0 hsl(45, 100%, 65%)'
              }}>
                <span className="mr-2">Get Started Today</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
            <p className="text-gray-400 text-sm">Free forever. No credit card required.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700 bg-[hsl(var(--campus-navy))] text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/90">
            © 2025 Campus Club Suite. Built for students, by students.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
