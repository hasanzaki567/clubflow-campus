import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Calendar, Star, Search, Plus, TrendingUp } from "lucide-react";

const Clubs = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock clubs data
  const clubs = [
    {
      id: 1,
      name: "Computer Science Club",
      description: "Fostering innovation and technical excellence through coding competitions, hackathons, and tech talks.",
      category: "Technology",
      members: 245,
      events: 12,
      rating: 4.8,
      image: "/placeholder.svg",
      founded: "2019",
      president: "Sarah Johnson",
      trending: true,
      tags: ["Programming", "AI/ML", "Web Dev", "Open Source"]
    },
    {
      id: 2,
      name: "Drama Society",
      description: "Bringing stories to life through theatrical performances, workshops, and creative expression.",
      category: "Arts",
      members: 189,
      events: 8,
      rating: 4.7,
      image: "/placeholder.svg",
      founded: "2018",
      president: "Michael Chen",
      trending: false,
      tags: ["Theater", "Acting", "Storytelling", "Performance"]
    },
    {
      id: 3,
      name: "Photography Club",
      description: "Capturing moments and developing artistic vision through photography workshops and exhibitions.",
      category: "Arts",
      members: 156,
      events: 15,
      rating: 4.9,
      image: "/placeholder.svg",
      founded: "2020",
      president: "Emma Davis",
      trending: true,
      tags: ["Photography", "Digital Art", "Exhibitions", "Workshops"]
    },
    {
      id: 4,
      name: "Environmental Club",
      description: "Promoting sustainability and environmental awareness through campus initiatives and community outreach.",
      category: "Social",
      members: 134,
      events: 10,
      rating: 4.6,
      image: "/placeholder.svg",
      founded: "2017",
      president: "Alex Rivera",
      trending: false,
      tags: ["Sustainability", "Conservation", "Community", "Green Tech"]
    },
    {
      id: 5,
      name: "Music Club",
      description: "Creating harmony through various musical genres, performances, and collaborative compositions.",
      category: "Arts",
      members: 198,
      events: 20,
      rating: 4.8,
      image: "/placeholder.svg",
      founded: "2016",
      president: "Jordan Lee",
      trending: true,
      tags: ["Music", "Performance", "Composition", "Collaboration"]
    },
    {
      id: 6,
      name: "Business Club",
      description: "Developing entrepreneurial skills and business acumen through case studies, networking, and startup challenges.",
      category: "Business",
      members: 167,
      events: 9,
      rating: 4.5,
      image: "/placeholder.svg",
      founded: "2019",
      president: "Lisa Park",
      trending: false,
      tags: ["Entrepreneurship", "Networking", "Finance", "Innovation"]
    }
  ];

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const categories = ["All", "Technology", "Arts", "Business", "Social", "Sports"];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clubs</h1>
          <p className="text-muted-foreground">Explore and join campus organizations</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Club
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clubs, categories, or interests..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <Button key={category} variant="outline" size="sm">
            {category}
          </Button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{clubs.length}</p>
                <p className="text-sm text-muted-foreground">Active Clubs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold text-foreground">{clubs.filter(c => c.trending).length}</p>
                <p className="text-sm text-muted-foreground">Trending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{clubs.reduce((acc, club) => acc + club.events, 0)}</p>
                <p className="text-sm text-muted-foreground">Total Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">4.7</p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.map((club) => (
          <Card key={club.id} className="shadow-elegant hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={club.image} alt={club.name} />
                  <AvatarFallback>{club.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{club.name}</CardTitle>
                    {club.trending && (
                      <Badge variant="secondary" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  <Badge variant="outline" className="mt-1">
                    {club.category}
                  </Badge>
                </div>
              </div>
              <CardDescription className="line-clamp-2 mt-2">
                {club.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-foreground">{club.members}</p>
                    <p className="text-xs text-muted-foreground">Members</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{club.events}</p>
                    <p className="text-xs text-muted-foreground">Events</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                      <p className="text-lg font-bold text-foreground">{club.rating}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {club.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {club.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{club.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Club Info */}
                <div className="text-sm text-muted-foreground">
                  <p>President: {club.president}</p>
                  <p>Founded: {club.founded}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    Join Club
                  </Button>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Clubs;