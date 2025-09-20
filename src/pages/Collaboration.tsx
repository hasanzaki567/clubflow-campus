import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Plus, Search, Filter, Users } from "lucide-react";

const Collaboration = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);

  // Mock collaboration posts
  const posts = [
    {
      id: 1,
      author: "Tech Club - MIT",
      authorAvatar: "/placeholder.svg",
      college: "MIT",
      title: "Looking for React Developers for Hackathon",
      content: "We're organizing a 48-hour hackathon focused on social impact. Looking for passionate React developers to join our inter-college team. Great opportunity to network and build something meaningful!",
      type: "collaboration",
      tags: ["React", "Hackathon", "Social Impact"],
      likes: 24,
      comments: 8,
      timeAgo: "2 hours ago",
      deadline: "Dec 30, 2024"
    },
    {
      id: 2,
      author: "Art Society - Stanford",
      authorAvatar: "/placeholder.svg",
      college: "Stanford University",
      title: "Joint Art Exhibition Opportunity",
      content: "We're curating a joint art exhibition featuring works from multiple colleges. Artists from all mediums welcome! This is a fantastic opportunity to showcase your work to a broader audience.",
      type: "opportunity",
      tags: ["Art", "Exhibition", "Showcase"],
      likes: 18,
      comments: 12,
      timeAgo: "4 hours ago",
      deadline: "Jan 15, 2025"
    },
    {
      id: 3,
      author: "Music Club - UC Berkeley",
      authorAvatar: "/placeholder.svg",
      college: "UC Berkeley",
      title: "Virtual Concert Collaboration",
      content: "Planning a virtual concert featuring musicians from different colleges. We're looking for singers, instrumentalists, and sound engineers to make this event amazing!",
      type: "event",
      tags: ["Music", "Virtual", "Concert"],
      likes: 31,
      comments: 15,
      timeAgo: "6 hours ago",
      deadline: "Jan 5, 2025"
    },
    {
      id: 4,
      author: "Debate Society - Harvard",
      authorAvatar: "/placeholder.svg",
      college: "Harvard University",
      title: "Inter-College Debate Championship",
      content: "Announcing the annual Inter-College Debate Championship! Teams of 3 students each. Topic: 'The Role of AI in Future Education'. Registration now open.",
      type: "competition",
      tags: ["Debate", "Competition", "AI"],
      likes: 42,
      comments: 23,
      timeAgo: "1 day ago",
      deadline: "Jan 20, 2025"
    },
    {
      id: 5,
      author: "Environmental Club - Yale",
      authorAvatar: "/placeholder.svg",
      college: "Yale University",
      title: "Climate Action Research Collaboration",
      content: "Seeking research partners for a multi-campus climate action study. Looking for students with background in environmental science, data analysis, or policy studies.",
      type: "research",
      tags: ["Environment", "Research", "Climate"],
      likes: 27,
      comments: 9,
      timeAgo: "2 days ago",
      deadline: "Feb 1, 2025"
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "collaboration": return "default";
      case "opportunity": return "secondary";
      case "event": return "outline";
      case "competition": return "destructive";
      case "research": return "default";
      default: return "default";
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Collaboration Board</h1>
          <p className="text-muted-foreground">Connect and collaborate with clubs across colleges</p>
        </div>
        <Button onClick={() => setShowCreatePost(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle>Create Collaboration Post</CardTitle>
            <CardDescription>Share opportunities and connect with other clubs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Post title..." />
            <Textarea placeholder="Describe your collaboration opportunity..." rows={4} />
            <div className="flex gap-2">
              <Input placeholder="Add tags (comma separated)" />
              <Input type="date" placeholder="Deadline" />
            </div>
            <div className="flex gap-2">
              <Button>Post</Button>
              <Button variant="outline" onClick={() => setShowCreatePost(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts, opportunities, or tags..."
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

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {["All", "Collaboration", "Opportunity", "Event", "Competition", "Research"].map((filter) => (
          <Button key={filter} variant="outline" size="sm">
            {filter}
          </Button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">156</p>
                <p className="text-sm text-muted-foreground">Active Posts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold text-foreground">42</p>
                <p className="text-sm text-muted-foreground">Colleges</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">1.2k</p>
                <p className="text-sm text-muted-foreground">Connections</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Share2 className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">89</p>
                <p className="text-sm text-muted-foreground">Successful Collaborations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="shadow-elegant hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.authorAvatar} alt={post.author} />
                  <AvatarFallback>{post.author.split(' ')[0][0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-foreground">{post.author}</p>
                    <Badge variant="outline" className="text-xs">{post.college}</Badge>
                    <Badge variant={getTypeColor(post.type)} className="text-xs capitalize">
                      {post.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{post.timeAgo}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">Deadline</p>
                  <p className="text-sm text-muted-foreground">{post.deadline}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{post.title}</h3>
                  <p className="text-muted-foreground">{post.content}</p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Heart className="h-4 w-4" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <MessageCircle className="h-4 w-4" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                  <Button size="sm">
                    Connect
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

export default Collaboration;