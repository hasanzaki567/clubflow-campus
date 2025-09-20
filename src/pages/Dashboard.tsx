import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Trophy, TrendingUp, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening in your campus.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/events/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-elegant">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full bg-background ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>Latest activities across all clubs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{event.name}</p>
                    <p className="text-sm text-muted-foreground">{event.club}</p>
                    <p className="text-sm text-muted-foreground">{event.attendees} attendees</p>
                  </div>
                  <div className="text-right">
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
            <div className="mt-4">
              <Link to="/events">
                <Button variant="outline" className="w-full">View All Events</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Top Clubs */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Top Performing Clubs</CardTitle>
            <CardDescription>Clubs with highest engagement this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topClubs.map((club, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{club.name}</p>
                    <p className="text-sm text-muted-foreground">{club.members} members</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">{club.growth}</Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link to="/clubs">
                <Button variant="outline" className="w-full">View All Clubs</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;