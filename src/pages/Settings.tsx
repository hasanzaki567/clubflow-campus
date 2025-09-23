import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Download,
  HelpCircle,
  Trash2,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  Mail,
  MessageSquare,
  Calendar,
  Lock,
  Key,
  AlertTriangle,
  CheckCircle,
  Settings as SettingsIcon,
  Camera,
  Edit,
  Save,
  X,
  ChevronRight,
  Star,
  Database,
  FileText,
  Users,
  Activity
} from "lucide-react";

const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    profile: {
      name: "John Doe",
      email: "john.doe@university.edu",
      bio: "Computer Science student passionate about technology and innovation.",
      avatar: "JD",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      graduationYear: "2025"
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      eventReminders: true,
      clubUpdates: true,
      systemUpdates: false,
      weeklyDigest: true,
      marketingEmails: false
    },
    privacy: {
      profileVisibility: "public",
      showEmail: false,
      showPhone: false,
      allowMessaging: true,
      dataCollection: true,
      analyticsTracking: true
    },
    appearance: {
      theme: "system",
      language: "en",
      timezone: "America/New_York",
      dateFormat: "MM/DD/YYYY",
      compactMode: false
    },
    platform: {
      defaultClubView: "grid",
      eventRSVP: true,
      autoJoinClubs: false,
      showInactiveClubs: false,
      calendarIntegration: true
    }
  });

  const updateSetting = (category: string, key: string, value: unknown) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "account", label: "Account", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Lock },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "platform", label: "Platform", icon: SettingsIcon },
    { id: "data", label: "Data & Export", icon: Database },
    { id: "support", label: "Support", icon: HelpCircle }
  ];

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
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
            <div className="md:col-span-3 space-y-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </Card>
              ))}
            </div>
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
                <SettingsIcon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground">Manage your account and platform preferences</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Settings
              </Button>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="space-y-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className="w-full justify-start gap-3"
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="md:col-span-3 space-y-6">
            {/* Profile Settings */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <Card className="shadow-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal information and profile details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold">
                          {settings.profile.avatar}
                        </div>
                        <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                          <Camera className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{settings.profile.name}</h3>
                        <p className="text-muted-foreground">{settings.profile.email}</p>
                        <Button variant="ghost" size="sm" className="mt-2">
                          <Edit className="h-4 w-4 mr-2" />
                          Change Avatar
                        </Button>
                      </div>
                    </div>

                    {/* Profile Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={settings.profile.name}
                            onChange={(e) => updateSetting("profile", "name", e.target.value)}
                            className="flex-1 px-3 py-2 border border-input rounded-md bg-background"
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <input
                          type="email"
                          value={settings.profile.email}
                          onChange={(e) => updateSetting("profile", "email", e.target.value)}
                          className="w-full px-3 py-2 border border-input rounded-md bg-background"
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Phone Number</label>
                        <input
                          type="tel"
                          value={settings.profile.phone}
                          onChange={(e) => updateSetting("profile", "phone", e.target.value)}
                          className="w-full px-3 py-2 border border-input rounded-md bg-background"
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Graduation Year</label>
                        <input
                          type="text"
                          value={settings.profile.graduationYear}
                          onChange={(e) => updateSetting("profile", "graduationYear", e.target.value)}
                          className="w-full px-3 py-2 border border-input rounded-md bg-background"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bio</label>
                      <textarea
                        value={settings.profile.bio}
                        onChange={(e) => updateSetting("profile", "bio", e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[100px]"
                        disabled={!isEditing}
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="flex gap-3">
                      {isEditing ? (
                        <>
                          <Button onClick={() => setIsEditing(false)}>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => setIsEditing(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Account Settings */}
            {activeTab === "account" && (
              <div className="space-y-6">
                <Card className="shadow-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Account Security
                    </CardTitle>
                    <CardDescription>
                      Manage your account security and authentication
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Password</p>
                          <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                        </div>
                        <Button variant="outline">
                          <Key className="h-4 w-4 mr-2" />
                          Change Password
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                        </div>
                        <Button variant="outline">
                          <Shield className="h-4 w-4 mr-2" />
                          Enable 2FA
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Login Sessions</p>
                          <p className="text-sm text-muted-foreground">Manage active sessions</p>
                        </div>
                        <Button variant="outline">
                          <Activity className="h-4 w-4 mr-2" />
                          View Sessions
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-elegant border-red-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="h-5 w-5" />
                      Danger Zone
                    </CardTitle>
                    <CardDescription>
                      Irreversible actions that affect your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Delete Account</p>
                        <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                      </div>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <Card className="shadow-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notification Preferences
                    </CardTitle>
                    <CardDescription>
                      Choose how you want to be notified about platform activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                          </div>
                        </div>
                        <Button
                          variant={settings.notifications.emailNotifications ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateSetting("notifications", "emailNotifications", !settings.notifications.emailNotifications)}
                        >
                          {settings.notifications.emailNotifications ? "Enabled" : "Disabled"}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Smartphone className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-medium">Push Notifications</p>
                            <p className="text-sm text-muted-foreground">Browser and mobile push notifications</p>
                          </div>
                        </div>
                        <Button
                          variant={settings.notifications.pushNotifications ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateSetting("notifications", "pushNotifications", !settings.notifications.pushNotifications)}
                        >
                          {settings.notifications.pushNotifications ? "Enabled" : "Disabled"}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <MessageSquare className="h-5 w-5 text-purple-500" />
                          <div>
                            <p className="font-medium">SMS Notifications</p>
                            <p className="text-sm text-muted-foreground">Text message notifications</p>
                          </div>
                        </div>
                        <Button
                          variant={settings.notifications.smsNotifications ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateSetting("notifications", "smsNotifications", !settings.notifications.smsNotifications)}
                        >
                          {settings.notifications.smsNotifications ? "Enabled" : "Disabled"}
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-4">Notification Types</h4>
                      <div className="space-y-3">
                        {[
                          { key: "eventReminders", label: "Event Reminders", icon: Calendar },
                          { key: "clubUpdates", label: "Club Updates", icon: Users },
                          { key: "systemUpdates", label: "System Updates", icon: SettingsIcon },
                          { key: "weeklyDigest", label: "Weekly Digest", icon: FileText },
                          { key: "marketingEmails", label: "Marketing Emails", icon: Mail }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <item.icon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{item.label}</span>
                            </div>
                            <Button
                              variant={settings.notifications[item.key as keyof typeof settings.notifications] ? "default" : "outline"}
                              size="sm"
                              onClick={() => updateSetting("notifications", item.key, !settings.notifications[item.key as keyof typeof settings.notifications])}
                            >
                              {settings.notifications[item.key as keyof typeof settings.notifications] ? "On" : "Off"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === "privacy" && (
              <div className="space-y-6">
                <Card className="shadow-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Privacy & Security
                    </CardTitle>
                    <CardDescription>
                      Control your privacy settings and data sharing preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Profile Visibility</label>
                        <div className="flex gap-2 mt-2">
                          {[
                            { value: "public", label: "Public" },
                            { value: "clubs", label: "Club Members" },
                            { value: "private", label: "Private" }
                          ].map((option) => (
                            <Button
                              key={option.value}
                              variant={settings.privacy.profileVisibility === option.value ? "default" : "outline"}
                              size="sm"
                              onClick={() => updateSetting("privacy", "profileVisibility", option.value)}
                            >
                              {option.label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {[
                          { key: "showEmail", label: "Show email address", icon: Mail },
                          { key: "showPhone", label: "Show phone number", icon: Smartphone },
                          { key: "allowMessaging", label: "Allow direct messaging", icon: MessageSquare }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <item.icon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{item.label}</span>
                            </div>
                            <Button
                              variant={settings.privacy[item.key as keyof typeof settings.privacy] ? "default" : "outline"}
                              size="sm"
                              onClick={() => updateSetting("privacy", item.key, !settings.privacy[item.key as keyof typeof settings.privacy])}
                            >
                              {settings.privacy[item.key as keyof typeof settings.privacy] ? "Visible" : "Hidden"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-4">Data & Analytics</h4>
                      <div className="space-y-3">
                        {[
                          { key: "dataCollection", label: "Allow data collection for platform improvement" },
                          { key: "analyticsTracking", label: "Enable analytics tracking" }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <span className="text-sm">{item.label}</span>
                            <Button
                              variant={settings.privacy[item.key as keyof typeof settings.privacy] ? "default" : "outline"}
                              size="sm"
                              onClick={() => updateSetting("privacy", item.key, !settings.privacy[item.key as keyof typeof settings.privacy])}
                            >
                              {settings.privacy[item.key as keyof typeof settings.privacy] ? "Allowed" : "Blocked"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === "appearance" && (
              <div className="space-y-6">
                <Card className="shadow-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Appearance & Display
                    </CardTitle>
                    <CardDescription>
                      Customize the look and feel of your platform experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Theme</label>
                        <div className="flex gap-2 mt-2">
                          {[
                            { value: "light", label: "Light", icon: Sun },
                            { value: "dark", label: "Dark", icon: Moon },
                            { value: "system", label: "System", icon: Monitor }
                          ].map((option) => (
                            <Button
                              key={option.value}
                              variant={settings.appearance.theme === option.value ? "default" : "outline"}
                              size="sm"
                              onClick={() => updateSetting("appearance", "theme", option.value)}
                              className="flex items-center gap-2"
                            >
                              <option.icon className="h-4 w-4" />
                              {option.label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Language</label>
                          <select
                            value={settings.appearance.language}
                            onChange={(e) => updateSetting("appearance", "language", e.target.value)}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background"
                          >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Timezone</label>
                          <select
                            value={settings.appearance.timezone}
                            onChange={(e) => updateSetting("appearance", "timezone", e.target.value)}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background"
                          >
                            <option value="America/New_York">Eastern Time</option>
                            <option value="America/Chicago">Central Time</option>
                            <option value="America/Denver">Mountain Time</option>
                            <option value="America/Los_Angeles">Pacific Time</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Compact Mode</p>
                          <p className="text-sm text-muted-foreground">Reduce spacing and padding for more content</p>
                        </div>
                        <Button
                          variant={settings.appearance.compactMode ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateSetting("appearance", "compactMode", !settings.appearance.compactMode)}
                        >
                          {settings.appearance.compactMode ? "Enabled" : "Disabled"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Platform Settings */}
            {activeTab === "platform" && (
              <div className="space-y-6">
                <Card className="shadow-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <SettingsIcon className="h-5 w-5" />
                      Platform Preferences
                    </CardTitle>
                    <CardDescription>
                      Customize your platform experience and default behaviors
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Default Club View</label>
                        <div className="flex gap-2">
                          {[
                            { value: "grid", label: "Grid View" },
                            { value: "list", label: "List View" }
                          ].map((option) => (
                            <Button
                              key={option.value}
                              variant={settings.platform.defaultClubView === option.value ? "default" : "outline"}
                              size="sm"
                              onClick={() => updateSetting("platform", "defaultClubView", option.value)}
                            >
                              {option.label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {[
                          { key: "eventRSVP", label: "Auto-RSVP to club events", description: "Automatically RSVP to events from clubs you follow" },
                          { key: "autoJoinClubs", label: "Auto-join suggested clubs", description: "Automatically join clubs based on your interests" },
                          { key: "showInactiveClubs", label: "Show inactive clubs", description: "Display clubs that haven't been active recently" },
                          { key: "calendarIntegration", label: "Calendar integration", description: "Sync events with your personal calendar" }
                        ].map((item) => (
                          <div key={item.key} className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">{item.label}</p>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                            <Button
                              variant={settings.platform[item.key as keyof typeof settings.platform] ? "default" : "outline"}
                              size="sm"
                              onClick={() => updateSetting("platform", item.key, !settings.platform[item.key as keyof typeof settings.platform])}
                            >
                              {settings.platform[item.key as keyof typeof settings.platform] ? "On" : "Off"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Data & Export */}
            {activeTab === "data" && (
              <div className="space-y-6">
                <Card className="shadow-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Data Management
                    </CardTitle>
                    <CardDescription>
                      Manage your data and export your information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Export Your Data</p>
                          <p className="text-sm text-muted-foreground">Download all your data in various formats</p>
                        </div>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Export Data
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Data Usage</p>
                          <p className="text-sm text-muted-foreground">View how your data is being used</p>
                        </div>
                        <Button variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View Usage
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Storage Used</p>
                          <p className="text-sm text-muted-foreground">2.1 GB of 10 GB used</p>
                        </div>
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="w-5/12 h-full bg-primary rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Support */}
            {activeTab === "support" && (
              <div className="space-y-6">
                <Card className="shadow-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5" />
                      Help & Support
                    </CardTitle>
                    <CardDescription>
                      Get help and contact our support team
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Help Center</p>
                          <p className="text-sm text-muted-foreground">Browse our comprehensive help documentation</p>
                        </div>
                        <Button variant="outline">
                          <HelpCircle className="h-4 w-4 mr-2" />
                          Visit Help Center
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Contact Support</p>
                          <p className="text-sm text-muted-foreground">Get in touch with our support team</p>
                        </div>
                        <Button variant="outline">
                          <Mail className="h-4 w-4 mr-2" />
                          Contact Support
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Feature Requests</p>
                          <p className="text-sm text-muted-foreground">Suggest new features and improvements</p>
                        </div>
                        <Button variant="outline">
                          <Star className="h-4 w-4 mr-2" />
                          Request Feature
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-4">Quick Links</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Button variant="ghost" className="justify-start">
                          <FileText className="h-4 w-4 mr-2" />
                          User Guide
                        </Button>
                        <Button variant="ghost" className="justify-start">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Community Forum
                        </Button>
                        <Button variant="ghost" className="justify-start">
                          <Activity className="h-4 w-4 mr-2" />
                          Status Page
                        </Button>
                        <Button variant="ghost" className="justify-start">
                          <Globe className="h-4 w-4 mr-2" />
                          API Documentation
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
