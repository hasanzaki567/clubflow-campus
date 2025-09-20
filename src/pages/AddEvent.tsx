import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock, ArrowLeft, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AddEvent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    club: "",
    date: "",
    time: "",
    location: "",
    maxAttendees: "",
    tags: [] as string[]
  });

  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Event title is required";
    if (!formData.description.trim()) newErrors.description = "Event description is required";
    if (!formData.club.trim()) newErrors.club = "Club name is required";
    if (!formData.date) newErrors.date = "Event date is required";
    if (!formData.time.trim()) newErrors.time = "Event time is required";
    if (!formData.location.trim()) newErrors.location = "Event location is required";
    if (!formData.maxAttendees || parseInt(formData.maxAttendees) <= 0) {
      newErrors.maxAttendees = "Valid maximum attendees is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send the data to your backend
    console.log("Event data:", formData);

    toast({
      title: "Event Created Successfully!",
      description: `"${formData.title}" has been created and is pending approval.`,
    });

    // Navigate back to events page
    navigate("/events");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/events")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create New Event</h1>
          <p className="text-muted-foreground">Fill in the details to create a new campus event</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Enter the main details of your event
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Tech Conference 2024"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your event..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
              </div>

              <div>
                <Label htmlFor="club">Organizing Club *</Label>
                <Input
                  id="club"
                  placeholder="e.g., Computer Science Club"
                  value={formData.club}
                  onChange={(e) => handleInputChange("club", e.target.value)}
                  className={errors.club ? "border-red-500" : ""}
                />
                {errors.club && <p className="text-sm text-red-500 mt-1">{errors.club}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Date & Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Date & Time
              </CardTitle>
              <CardDescription>
                Set when your event will take place
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="date">Event Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className={errors.date ? "border-red-500" : ""}
                />
                {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date}</p>}
              </div>

              <div>
                <Label htmlFor="time">Event Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                  className={errors.time ? "border-red-500" : ""}
                />
                {errors.time && <p className="text-sm text-red-500 mt-1">{errors.time}</p>}
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., Main Auditorium, Conference Room A"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className={errors.location ? "border-red-500" : ""}
                />
                {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location}</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Capacity & Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Capacity & Tags
            </CardTitle>
            <CardDescription>
              Set attendance limits and categorize your event
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="maxAttendees">Maximum Attendees *</Label>
              <Input
                id="maxAttendees"
                type="number"
                placeholder="e.g., 100"
                value={formData.maxAttendees}
                onChange={(e) => handleInputChange("maxAttendees", e.target.value)}
                className={errors.maxAttendees ? "border-red-500" : ""}
              />
              {errors.maxAttendees && <p className="text-sm text-red-500 mt-1">{errors.maxAttendees}</p>}
            </div>

            <div>
              <Label>Event Tags</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button type="button" onClick={handleAddTag} variant="outline">
                  Add
                </Button>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-red-500"
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Preview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Event Preview</CardTitle>
            <CardDescription>
              This is how your event will appear to others
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Card className="shadow-elegant">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant="default" className="mb-2">upcoming</Badge>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {formData.date || "Select date"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formData.time || "Select time"}
                    </p>
                  </div>
                </div>
                <CardTitle className="text-lg">
                  {formData.title || "Event Title"}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {formData.description || "Event description will appear here..."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{formData.club || "Club name"}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{formData.location || "Location"}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>0/{formData.maxAttendees || "0"} attendees</span>
                  </div>

                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/events")}
          >
            Cancel
          </Button>
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" />
            Create Event
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddEvent;
