import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Mail, Smartphone, Megaphone, Send, Archive, Filter, Star, Users, Bell, Phone, Globe, Settings, Plus, Search, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Communication = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("messages");

  // Mock data for communication hub
  const messages = [
    {
      id: 1,
      sender: "Computer Science Club",
      subject: "Weekly Meeting Reminder",
      content: "Don't forget about our weekly meeting this Friday at 3 PM in Room 201...",
      time: "2 hours ago",
      unread: true,
      priority: "high"
    },
    {
      id: 2,
      sender: "Drama Society",
      subject: "Auditions Next Week",
      content: "We're holding auditions for the spring production next Tuesday...",
      time: "4 hours ago",
      unread: false,
      priority: "medium"
    },
    {
      id: 3,
      sender: "Photography Club",
      subject: "Photo Contest Winners",
      content: "Congratulations to our photo contest winners! Check out the results...",
      time: "1 day ago",
      unread: false,
      priority: "low"
    }
  ];

  const announcements = [
    {
      id: 1,
      title: "Campus-wide Event: Career Fair 2024",
      content: "Join us for the annual Career Fair featuring 50+ companies...",
      date: "Dec 15, 2024",
      reach: "1,247 students",
      status: "published"
    },
    {
      id: 2,
      title: "Library Extended Hours",
      content: "The main library will have extended hours during finals week...",
      date: "Dec 10, 2024",
      reach: "892 students",
      status: "draft"
    }
  ];

  const notifications = [
    {
      id: 1,
      type: "event_reminder",
      title: "Event Starting Soon",
      message: "Tech Talk 2024 starts in 30 minutes",
      time: "30 min ago",
      read: false
    },
    {
      id: 2,
      type: "club_update",
      title: "New Member Joined",
      message: "Sarah Johnson joined Computer Science Club",
      time: "1 hour ago",
      read: true
    },
    {
      id: 3,
      type: "system",
      title: "Weekly Report Ready",
      message: "Your weekly analytics report is available",
      time: "2 hours ago",
      read: false
    }
  ];

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-32" />
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  ))}
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
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Communication Hub</h1>
                <p className="text-muted-foreground">Manage all your campus communications</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Communication Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-elegant">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Messages</p>
                  <p className="text-2xl font-bold text-foreground">1,247</p>
                  <p className="text-sm text-green-600">+12% this week</p>
                </div>
                <div className="p-3 rounded-full bg-blue-500/10 text-blue-600">
                  <MessageSquare className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Announcements</p>
                  <p className="text-2xl font-bold text-foreground">23</p>
                  <p className="text-sm text-green-600">+3 this week</p>
                </div>
                <div className="p-3 rounded-full bg-purple-500/10 text-purple-600">
                  <Megaphone className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold text-foreground">892</p>
                  <p className="text-sm text-green-600">+8% this week</p>
                </div>
                <div className="p-3 rounded-full bg-green-500/10 text-green-600">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Notifications</p>
                  <p className="text-2xl font-bold text-foreground">156</p>
                  <p className="text-sm text-orange-600">+5% this week</p>
                </div>
                <div className="p-3 rounded-full bg-orange-500/10 text-orange-600">
                  <Bell className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          {[
            { id: "messages", label: "Messages", icon: MessageSquare },
            { id: "announcements", label: "Announcements", icon: Megaphone },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "settings", label: "Settings", icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="shadow-elegant">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Recent Messages
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm">
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                        message.unread ? "bg-blue-500/5 border-blue-500/20" : "bg-muted/30 border-muted"
                      }`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                              {message.sender.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{message.sender}</p>
                              <p className="text-sm text-muted-foreground">{message.time}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {message.unread && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            <Badge variant={message.priority === 'high' ? 'default' : message.priority === 'medium' ? 'secondary' : 'outline'}>
                              {message.priority}
                            </Badge>
                          </div>
                        </div>
                        <h4 className="font-medium text-foreground mb-1">{message.subject}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{message.content}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Message Actions Sidebar */}
            <div className="space-y-4">
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Send className="h-4 w-4 mr-2" />
                    Compose Message
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Bulk Message
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Messages
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle>Message Templates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-sm">Event Reminder</p>
                    <p className="text-xs text-muted-foreground">Standard event reminder template</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-sm">Meeting Notice</p>
                    <p className="text-xs text-muted-foreground">Club meeting announcement</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-sm">Welcome Message</p>
                    <p className="text-xs text-muted-foreground">New member welcome</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === "announcements" && (
          <div className="space-y-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5" />
                    Campus Announcements
                  </CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Announcement
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="p-4 border rounded-lg bg-muted/30">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">{announcement.title}</h4>
                          <p className="text-sm text-muted-foreground">{announcement.content}</p>
                        </div>
                        <Badge variant={announcement.status === 'published' ? 'default' : 'secondary'}>
                          {announcement.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>📅 {announcement.date}</span>
                        <span>👥 {announcement.reach}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Center
                </CardTitle>
                <CardDescription>Manage your notification preferences and history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`p-4 rounded-lg border transition-colors ${
                      !notification.read ? "bg-blue-500/5 border-blue-500/20" : "bg-muted/30 border-muted"
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`w-3 h-3 rounded-full mt-1 ${
                            notification.type === 'event_reminder' ? 'bg-blue-500' :
                            notification.type === 'club_update' ? 'bg-green-500' : 'bg-orange-500'
                          }`}></div>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{notification.title}</h4>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <Button variant="ghost" size="sm">
                            <Star className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Digest</p>
                    <p className="text-sm text-muted-foreground">Get weekly summary emails</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  SMS Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive urgent notifications via SMS</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Phone Number</p>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                  <Button variant="outline" size="sm">Update</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Push Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Browser Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mobile App</p>
                    <p className="text-sm text-muted-foreground">Push notifications on mobile</p>
                  </div>
                  <Button variant="outline" size="sm">Coming Soon</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Integration Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Integration</p>
                    <p className="text-sm text-muted-foreground">Connect with Gmail, Outlook, etc.</p>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Calendar Sync</p>
                    <p className="text-sm text-muted-foreground">Sync with Google Calendar, Outlook</p>
                  </div>
                  <Button variant="outline" size="sm">Sync</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Communication;
