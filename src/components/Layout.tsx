import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Calendar,
  Users,
  MessageSquare,
  Settings,
  GraduationCap,
  LogOut,
  Bell,
  Mail,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Download,
  UserCog,
  Activity,
  FileText,
  Search,
  Star,
  Plus,
  Moon,
  Sun,
  HelpCircle,
  Zap,
  TrendingUp,
  Clock,
  Bookmark,
  Palette,
  Globe,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  DollarSign,
  Handshake,
  Menu,
  X
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAdminExpanded, setIsAdminExpanded] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isFavoritesExpanded, setIsFavoritesExpanded] = useState(false);
  const [isNotificationsExpanded, setIsNotificationsExpanded] = useState(false);
  const [isQuickActionsExpanded, setIsQuickActionsExpanded] = useState(false);
  const [isThemeDark, setIsThemeDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Clubs", href: "/clubs", icon: Users },
    { name: "Budget Management", href: "/budget", icon: DollarSign },
    { name: "Sponsorships", href: "/sponsorships", icon: Handshake },
    { name: "Chat", href: "/chat", icon: MessageSquare },
    { name: "Collaboration", href: "/collaboration", icon: Users },
    { name: "Communication", href: "/communication", icon: Mail },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const adminTools = [
    { name: "Analytics", icon: BarChart3, action: "analytics" },
    { name: "Bulk Operations", icon: FileText, action: "bulk" },
    { name: "User Management", icon: UserCog, action: "users" },
    { name: "System Status", icon: Activity, action: "status" },
    { name: "Export Data", icon: Download, action: "export" },
  ];

  const isActive = (href: string) => location.pathname === href;

  const handleAdminAction = (action: string) => {
    // Handle admin actions here
    console.log(`Admin action: ${action}`);

    switch (action) {
      case 'analytics':
        showAnalyticsModal();
        break;
      case 'bulk':
        showBulkOperationsModal();
        break;
      case 'users':
        showUserManagementModal();
        break;
      case 'status':
        showSystemStatusModal();
        break;
      case 'export':
        showExportModal();
        break;
      default:
        console.log(`Unknown admin action: ${action}`);
    }
  };

  const showAnalyticsModal = () => {
    // Analytics modal functionality
    alert(`📊 Analytics Dashboard

🎯 Platform Overview:
• Total Users: 1,247
• Active Users: 892
• Platform Growth: +23% this month
• Most Popular Feature: Event Management

📈 Event Analytics:
• Total Events: 156
• Average Attendance: 45 students
• Most Popular: Tech Talks (35 events)
• RSVP Rate: 78%

👥 Club Analytics:
• Active Clubs: 23
• Average Members per Club: 54
• Fastest Growing: Computer Science Club (+15%)
• Most Active: Drama Society (12 events)

💬 Communication Analytics:
• Messages Sent: 2,847
• Announcements: 23
• Notification Opens: 94%
• Most Active Channel: In-app messaging

📊 System Performance:
• Uptime: 99.9%
• Average Load Time: 1.2s
• Error Rate: 0.1%
• Peak Usage: 450 concurrent users

Click OK to open detailed analytics dashboard.`);
  };

  const showBulkOperationsModal = () => {
    alert(`📄 Bulk Operations

Available bulk actions:
• Send announcements to multiple clubs
• Export user data for selected groups
• Update event permissions in bulk
• Manage club memberships at scale
• Archive old events and communications

Click OK to open bulk operations interface.`);
  };

  const showUserManagementModal = () => {
    alert(`👥 User Management

User administration features:
• View all registered students
• Manage user roles and permissions
• Bulk import/export user data
• User activity monitoring
• Account status management
• Communication preferences

Click OK to open user management dashboard.`);
  };

  const showSystemStatusModal = () => {
    alert(`⚡ System Status

Current system health:
• 🟢 Server Status: Online
• 🟢 Database: Connected
• 🟢 API Services: Operational
• 🟢 File Storage: Available
• 🟢 Email Services: Functional

Performance metrics:
• Response Time: 1.2s average
• CPU Usage: 34%
• Memory Usage: 67%
• Storage Used: 2.1GB / 10GB

Click OK to view detailed system monitoring.`);
  };

  const showExportModal = () => {
    alert(`📥 Export Data

Available export options:
• User data (CSV, Excel, PDF)
• Event reports (All formats)
• Club analytics (Charts included)
• Communication logs (Filtered)
• System reports (Technical data)
• Custom date range selection

Click OK to configure export settings.`);
  };

  const handleSignOutClick = () => {
    setShowSignOutModal(true);
  };

  const handleSignOutConfirm = async () => {
    setIsSigningOut(true);
    setShowSignOutModal(false);

    try {
      // Simulate sign out process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear user session data
      localStorage.removeItem('userToken');
      localStorage.removeItem('userSession');
      localStorage.removeItem('userPreferences');
      sessionStorage.clear();

      // Show professional success modal
      setShowSuccessModal(true);

      // Redirect after showing success message
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);

    } catch (error) {
      console.error('Sign out error:', error);
      alert(`❌ Sign Out Failed

There was an error signing you out. Please try again or contact support if the problem persists.`);

      setIsSigningOut(false);
    }
  };

  const handleSignOutCancel = () => {
    setShowSignOutModal(false);
  };

  return (
    <div className="min-h-screen bg-background">

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-card border-r border-border transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 p-6 border-b border-border flex-shrink-0">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">Campbuzz</h1>
              <p className="text-sm text-muted-foreground">Campus Management</p>
            </div>
          </div>

          {/* Scrollable Navigation Container */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/50">
            <nav className="p-4 space-y-2">
              {navigation.map((item) => (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className="w-full justify-start gap-3"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              ))}

            {/* Global Search Section */}
            <div className="pt-4 border-t border-border/30">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search everything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-muted/50 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder-muted-foreground"
                />
              </div>
            </div>

            {/* Favorites & Bookmarks */}
            <div className="pt-2">
              <Button
                variant="ghost"
                className="w-full justify-between text-muted-foreground hover:text-foreground"
                onClick={() => setIsFavoritesExpanded(!isFavoritesExpanded)}
              >
                <div className="flex items-center gap-3">
                  <Star className="h-4 w-4" />
                  <span className="text-sm font-medium">Favorites</span>
                </div>
                {isFavoritesExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>

              {isFavoritesExpanded && (
                <div className="mt-2 ml-4 space-y-1">
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-xs text-muted-foreground hover:text-foreground">
                    <Bookmark className="h-3 w-3" />
                    Computer Science Club
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-xs text-muted-foreground hover:text-foreground">
                    <Calendar className="h-3 w-3" />
                    Tech Talk 2024
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-xs text-muted-foreground hover:text-foreground">
                    <Users className="h-3 w-3" />
                    Drama Society
                  </Button>
                </div>
              )}
            </div>

            {/* Mini Dashboard Widgets */}
            <div className="pt-2">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Quick Stats</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs px-2 py-1 bg-muted/30 rounded">
                  <span className="text-muted-foreground">Events</span>
                  <span className="font-medium text-foreground">24</span>
                </div>
                <div className="flex items-center justify-between text-xs px-2 py-1 bg-muted/30 rounded">
                  <span className="text-muted-foreground">Members</span>
                  <span className="font-medium text-foreground">1,247</span>
                </div>
                <div className="flex items-center justify-between text-xs px-2 py-1 bg-muted/30 rounded">
                  <span className="text-muted-foreground">Growth</span>
                  <span className="font-medium text-green-600">+23%</span>
                </div>
              </div>
            </div>

            {/* Smart Notifications */}
            <div className="pt-2">
              <Button
                variant="ghost"
                className="w-full justify-between text-muted-foreground hover:text-foreground"
                onClick={() => setIsNotificationsExpanded(!isNotificationsExpanded)}
              >
                <div className="flex items-center gap-3">
                  <Bell className="h-4 w-4" />
                  <span className="text-sm font-medium">Notifications</span>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                {isNotificationsExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>

              {isNotificationsExpanded && (
                <div className="mt-2 ml-4 space-y-1">
                  <div className="flex items-start gap-2 p-2 bg-blue-500/10 rounded text-xs">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                    <div>
                      <p className="font-medium text-foreground">Event Starting</p>
                      <p className="text-muted-foreground">Tech Talk starts in 30 min</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-green-500/10 rounded text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1"></div>
                    <div>
                      <p className="font-medium text-foreground">New Member</p>
                      <p className="text-muted-foreground">Sarah joined CS Club</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions Panel */}
            <div className="pt-2">
              <Button
                variant="ghost"
                className="w-full justify-between text-muted-foreground hover:text-foreground"
                onClick={() => setIsQuickActionsExpanded(!isQuickActionsExpanded)}
              >
                <div className="flex items-center gap-3">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">Quick Actions</span>
                </div>
                {isQuickActionsExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>

              {isQuickActionsExpanded && (
                <div className="mt-2 ml-4 space-y-1">
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-xs text-muted-foreground hover:text-foreground">
                    <Plus className="h-3 w-3" />
                    Create Event
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-xs text-muted-foreground hover:text-foreground">
                    <Mail className="h-3 w-3" />
                    New Message
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-xs text-muted-foreground hover:text-foreground">
                    <Users className="h-3 w-3" />
                    Join Club
                  </Button>
                </div>
              )}
            </div>

            {/* Professional Features */}
            <div className="pt-2 border-t border-border/30">
              <div className="flex items-center justify-between mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setIsThemeDark(!isThemeDark)}
                >
                  {isThemeDark ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
                </Button>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                  <HelpCircle className="h-3 w-3" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground px-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Online</span>
                </div>
              </div>
            </div>

            {/* Administrative Tools Section */}
            <div className="pt-4 border-t border-border/50">
              <Button
                variant="ghost"
                className="w-full justify-between text-muted-foreground hover:text-foreground"
                onClick={() => setIsAdminExpanded(!isAdminExpanded)}
              >
                <div className="flex items-center gap-3">
                  <Settings className="h-4 w-4" />
                  <span className="text-sm font-medium">Admin Tools</span>
                </div>
                {isAdminExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>

              {isAdminExpanded && (
                <div className="mt-2 ml-4 space-y-1">
                  {adminTools.map((tool) => (
                    <Button
                      key={tool.name}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-2 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => handleAdminAction(tool.action)}
                    >
                      <tool.icon className="h-3 w-3" />
                      {tool.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            </nav>
          </div>

          {/* User Section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                JD
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">John Doe</p>
                <p className="text-xs text-muted-foreground">Student</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground"
              onClick={handleSignOutClick}
              disabled={isSigningOut}
            >
              {isSigningOut ? (
                <>
                  <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
                  Signing Out...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-16'}`}>
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center gap-4">
              {/* Sidebar Toggle Button */}
              <Button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="h-8 w-8 rounded-lg bg-muted hover:bg-muted/80 border-0 shadow-none"
                size="icon"
                variant="ghost"
              >
                {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
              <h2 className="text-lg font-semibold text-foreground">
                Campbuzz
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <NotificationDropdown />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>

      {/* Professional Sign Out Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={handleSignOutCancel}
          />

          {/* Modal */}
          <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all">
            {/* Header */}
            <div className="flex items-center gap-3 p-6 border-b border-border">
              <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center">
                <LogOut className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Sign Out</h2>
                <p className="text-sm text-muted-foreground">Confirm your sign out</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Secure Sign Out</p>
                    <p className="text-sm text-muted-foreground">
                      You will be securely signed out and redirected to the login page.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Session Data</p>
                    <p className="text-sm text-muted-foreground">
                      All session data will be cleared for security purposes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Safe Redirect</p>
                    <p className="text-sm text-muted-foreground">
                      You'll be taken to the login page to sign in again.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-6 pt-0">
              <Button
                variant="outline"
                onClick={handleSignOutCancel}
                className="flex-1"
                disabled={isSigningOut}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSignOutConfirm}
                disabled={isSigningOut}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {isSigningOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing Out...
                  </>
                ) : (
                  <>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Professional Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Success Modal */}
          <div className="relative bg-card border border-green-200 rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all">
            {/* Header */}
            <div className="flex items-center gap-3 p-6 border-b border-green-200">
              <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Successfully Signed Out</h2>
                <p className="text-sm text-muted-foreground">You have been securely logged out</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Secure Sign Out Complete</p>
                    <p className="text-sm text-muted-foreground">
                      You have been successfully signed out of Campus Club Management Suite.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Session Cleared</p>
                    <p className="text-sm text-muted-foreground">
                      All session data has been cleared for your security.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <LogOut className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Redirecting</p>
                    <p className="text-sm text-muted-foreground">
                      You will be redirected to the login page in a few seconds.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-0">
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Redirecting to login page...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
