import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Users, Clock, Plus, Search, Filter, Grid3X3 } from "lucide-react";
import { Link } from "react-router-dom";
import EventCalendar from "@/components/EventCalendar";

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("grid");

  // Mock events data
  const events = [
    {
      id: 1,
      title: "Tech Conference 2024",
      description: "Annual technology conference featuring industry leaders and cutting-edge innovations.",
      club: "Computer Science Club",
      date: "Dec 28, 2024",
      time: "9:00 AM - 5:00 PM",
      location: "Main Auditorium",
      attendees: 245,
      maxAttendees: 300,
      status: "upcoming",
      tags: ["Technology", "Conference", "Networking"]
    },
    {
      id: 2,
      title: "Art Exhibition Opening",
      description: "Showcase of student artwork featuring paintings, sculptures, and digital art.",
      club: "Fine Arts Society",
      date: "Dec 25, 2024",
      time: "6:00 PM - 9:00 PM",
      location: "Art Gallery",
      attendees: 89,
      maxAttendees: 150,
      status: "upcoming",
      tags: ["Art", "Exhibition", "Culture"]
    },
    {
      id: 3,
      title: "Basketball Championship",
      description: "Inter-college basketball tournament final match.",
      club: "Sports Club",
      date: "Dec 23, 2024",
      time: "3:00 PM - 6:00 PM",
      location: "Sports Complex",
      attendees: 450,
      maxAttendees: 500,
      status: "ongoing",
      tags: ["Sports", "Tournament", "Basketball"]
    },
    {
      id: 4,
      title: "Entrepreneurship Workshop",
      description: "Learn the basics of starting your own business from successful entrepreneurs.",
      club: "Business Club",
      date: "Dec 20, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "Conference Room A",
      attendees: 67,
      maxAttendees: 80,
      status: "completed",
      tags: ["Business", "Workshop", "Entrepreneurship"]
    }
  ];

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.club.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "default";
      case "ongoing": return "secondary";
      case "completed": return "outline";
      default: return "default";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Events</h1>
          <p className="text-muted-foreground">Discover and manage campus events</p>
        </div>
        <Link to="/events/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events or clubs..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* View Toggle */}
      <div className="flex justify-center">
        <div className="flex bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="rounded-md"
          >
            <Grid3X3 className="h-4 w-4 mr-2" />
            Grid View
          </Button>
          <Button
            variant={viewMode === "calendar" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("calendar")}
            className="rounded-md"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </Button>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="shadow-elegant hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant={getStatusColor(event.status)} className="mb-2">
                    {event.status}
                  </Badge>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{event.date}</p>
                    <p className="text-xs text-muted-foreground">{event.time}</p>
                  </div>
                </div>
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <CardDescription className="line-clamp-2">{event.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{event.club}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{event.attendees}/{event.maxAttendees} attendees</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {event.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1">
                      {event.status === "upcoming" ? "RSVP" : event.status === "ongoing" ? "Join Now" : "View Details"}
                    </Button>
                    <Button size="sm" variant="outline">
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EventCalendar events={filteredEvents} />
      )}
    </div>
  );
};

export default Events;
