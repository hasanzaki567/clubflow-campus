import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Sparkles,
  Brain,
  TrendingUp,
  Clock,
  Users,
  MapPin,
  Star,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  RefreshCw,
  Settings,
  Filter,
  Eye,
  ThumbsUp,
  Calendar,
  Award,
  Target,
  Zap,
  Heart,
  ChevronRight,
  Info,
  BarChart3,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Cpu,
  Network,
  Database,
  Activity,
  PieChart,
  LineChart,
  BarChart,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  Search,
  SlidersHorizontal,
  X,
  Check,
  AlertTriangle,
  Shield,
  Lock,
  Globe,
  Wifi,
  Server,
  Share2
} from 'lucide-react';
import { useRecommendations } from '@/contexts/RecommendationContext';
import type { RecommendationItem, RecommendationType, UserPreferenceCategory } from '@/types/recommendation';

interface AIRecommendationSystemProps {
  className?: string;
  maxItems?: number;
  showExplanations?: boolean;
}

const AIRecommendationSystem: React.FC<AIRecommendationSystemProps> = ({
  className = '',
  maxItems = 6,
  showExplanations = true
}) => {
  const {
    recommendations,
    userPreferences,
    settings,
    isLoading,
    error,
    refreshRecommendations,
    recordInteraction,
    getRecommendationStats
  } = useRecommendations();

  const [selectedType, setSelectedType] = useState<RecommendationType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<UserPreferenceCategory | 'all'>('all');
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<string>>(new Set());

  // Interest input functionality
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [showInterestForm, setShowInterestForm] = useState(false);
  const [isAnalyzingInterests, setIsAnalyzingInterests] = useState(false);

  // Filter recommendations based on selected filters
  const filteredRecommendations = recommendations
    .filter(rec => selectedType === 'all' || rec.type === selectedType)
    .filter(rec => selectedCategory === 'all' || rec.category.includes(selectedCategory))
    .slice(0, maxItems);

  const stats = getRecommendationStats();

  const getTypeIcon = (type: RecommendationType) => {
    switch (type) {
      case 'event': return <Calendar className="h-4 w-4" />;
      case 'club': return <Users className="h-4 w-4" />;
      case 'activity': return <Target className="h-4 w-4" />;
      case 'course': return <Award className="h-4 w-4" />;
      case 'social': return <Heart className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: RecommendationType) => {
    switch (type) {
      case 'event': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'club': return 'bg-green-100 text-green-700 border-green-200';
      case 'activity': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'course': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'social': return 'bg-pink-100 text-pink-700 border-pink-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryColor = (category: UserPreferenceCategory) => {
    switch (category) {
      case 'academic': return 'bg-indigo-100 text-indigo-700';
      case 'technology': return 'bg-cyan-100 text-cyan-700';
      case 'sports': return 'bg-green-100 text-green-700';
      case 'arts': return 'bg-pink-100 text-pink-700';
      case 'social': return 'bg-purple-100 text-purple-700';
      case 'volunteer': return 'bg-yellow-100 text-yellow-700';
      case 'career': return 'bg-blue-100 text-blue-700';
      case 'wellness': return 'bg-emerald-100 text-emerald-700';
      case 'cultural': return 'bg-red-100 text-red-700';
      case 'outdoor': return 'bg-teal-100 text-teal-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getReasonIcon = (reasonType: string) => {
    switch (reasonType) {
      case 'user_history': return <Clock className="h-3 w-3" />;
      case 'similar_users': return <Users className="h-3 w-3" />;
      case 'trending': return <TrendingUp className="h-3 w-3" />;
      case 'category_match': return <Target className="h-3 w-3" />;
      case 'skill_level': return <Award className="h-3 w-3" />;
      case 'time_match': return <Calendar className="h-3 w-3" />;
      case 'diversity': return <Sparkles className="h-3 w-3" />;
      default: return <Info className="h-3 w-3" />;
    }
  };

  const handleBookmark = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newBookmarked = new Set(bookmarkedItems);
    if (newBookmarked.has(itemId)) {
      newBookmarked.delete(itemId);
    } else {
      newBookmarked.add(itemId);
      recordInteraction({
        itemId,
        itemType: recommendations.find(r => r.id === itemId)?.type || 'event',
        interactionType: 'bookmark'
      });
    }
    setBookmarkedItems(newBookmarked);
  };

  const handleCardClick = (recommendation: RecommendationItem) => {
    recordInteraction({
      itemId: recommendation.id,
      itemType: recommendation.type,
      interactionType: 'click'
    });

    // In a real app, this would navigate to the item details
    console.log('Clicked recommendation:', recommendation.title);
  };

  const handleView = (recommendation: RecommendationItem) => {
    recordInteraction({
      itemId: recommendation.id,
      itemType: recommendation.type,
      interactionType: 'view'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !userInterests.includes(newInterest.trim())) {
      setIsAnalyzingInterests(true);

      // Simulate AI analysis delay
      setTimeout(() => {
        setUserInterests(prev => [...prev, newInterest.trim()]);
        setNewInterest('');
        setShowInterestForm(false);
        setIsAnalyzingInterests(false);

        // In a real app, this would trigger recommendation refresh
        console.log('Added interest:', newInterest.trim());
        console.log('User interests updated:', [...userInterests, newInterest.trim()]);
      }, 1500);
    }
  };

  if (error) {
    return (
      <Card className={`border-red-200 bg-red-50 ${className}`}>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-700 mb-2">Recommendation Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={refreshRecommendations} variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Professional Header with Advanced Analytics */}
      <Card className="relative overflow-hidden border-2 border-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 shadow-xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5"></div>

        <CardHeader className="relative z-10 pb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title Section */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl blur opacity-20"></div>
                <div className="relative p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AI-Powered Recommendations
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 mt-2">
                  Intelligent suggestions powered by advanced machine learning algorithms
                </CardDescription>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Live System
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    <Cpu className="h-3 w-3" />
                    Neural Engine
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshRecommendations}
                disabled={isLoading}
                className="border-indigo-300 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-300 shadow-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh AI
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 transition-all duration-300 shadow-sm"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Fine-tune
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Advanced Analytics Dashboard */}
        <CardContent className="relative z-10 pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="group relative overflow-hidden p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-100 hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <BarChart3 className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    +12%
                  </div>
                </div>
                <div className="text-2xl font-bold text-indigo-600 mb-1">{stats.totalRecommendations}</div>
                <div className="text-sm text-gray-600">Smart Recommendations</div>
              </div>
            </div>

            <div className="group relative overflow-hidden p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-emerald-100 hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Target className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                    {stats.averageScore.toFixed(1)}/10
                  </div>
                </div>
                <div className="text-2xl font-bold text-emerald-600 mb-1">{stats.averageScore.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Avg. Match Score</div>
              </div>
            </div>

            <div className="group relative overflow-hidden p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-purple-100 hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <PieChart className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                    Primary
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-600 mb-1 capitalize">{stats.topCategories[0]}</div>
                <div className="text-sm text-gray-600">Top Interest</div>
              </div>
            </div>

            <div className="group relative overflow-hidden p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-orange-100 hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Activity className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                    {(stats.interactionRate * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="text-2xl font-bold text-orange-600 mb-1">{(stats.interactionRate * 100).toFixed(0)}%</div>
                <div className="text-sm text-gray-600">Engagement Rate</div>
              </div>
            </div>
          </div>

          {/* Advanced Filter System */}
          <div className="space-y-4">
            {/* Filter Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Smart Filters</span>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
                <Settings className="h-4 w-4 mr-2" />
                Advanced
              </Button>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant={selectedType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('all')}
                className={`transition-all duration-300 ${
                  selectedType === 'all'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
                    : 'border-gray-300 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
                }`}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                All Types ({recommendations.length})
              </Button>

              {(['event', 'club', 'activity', 'course', 'social'] as RecommendationType[]).map(type => (
                <Button
                  key={type}
                  variant={selectedType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  className={`capitalize transition-all duration-300 ${
                    selectedType === type
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
                      : 'border-gray-300 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  {getTypeIcon(type)}
                  <span className="ml-2">{type}</span>
                  <span className="ml-1 text-xs opacity-70">
                    ({recommendations.filter(r => r.type === type).length})
                  </span>
                </Button>
              ))}
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className={`transition-all duration-300 ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg hover:shadow-xl'
                    : 'border-gray-300 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                All Categories
              </Button>

              {stats.topCategories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`capitalize transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg hover:shadow-xl'
                      : 'border-gray-300 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full mr-2 ${getCategoryColor(category).split(' ')[0]}`}></div>
                  {category}
                  <span className="ml-1 text-xs opacity-70">
                    ({recommendations.filter(r => r.category.includes(category)).length})
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interest Input Section */}
      <Card className="relative overflow-hidden border-2 border-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-gradient-to-br from-emerald-50 via-teal-50/30 to-cyan-50/30 shadow-xl">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5"></div>

        <CardHeader className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl blur opacity-20"></div>
              <div className="relative p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                <Target className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Tell Us Your Interests
              </CardTitle>
              <CardDescription className="text-base text-gray-600 mt-2">
                Share your passions and preferences to get personalized recommendations tailored just for you
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 space-y-6">
          {/* Current Interests Display */}
          {userInterests.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Your Interests</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowInterestForm(!showInterestForm)}
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add More
                </Button>
              </div>

              <div className="flex flex-wrap gap-3">
                {userInterests.map((interest, index) => (
                  <Badge
                    key={index}
                    className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200 text-sm font-medium px-4 py-2 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
                  >
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 group-hover:scale-125 transition-transform duration-300"></div>
                    {interest}
                    <button
                      onClick={() => setUserInterests(prev => prev.filter((_, i) => i !== index))}
                      className="ml-2 hover:text-emerald-900 transition-colors duration-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Interest Input Form */}
          {showInterestForm && (
            <div className="space-y-4 p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-emerald-200 shadow-lg">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="interest-input" className="text-sm font-medium text-gray-700">
                    What are you interested in?
                  </Label>
                  <div className="mt-2">
                    <Input
                      id="interest-input"
                      placeholder="e.g., Machine Learning, Photography, Basketball, Music Production..."
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && newInterest.trim()) {
                          e.preventDefault();
                          handleAddInterest();
                        }
                      }}
                      className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-300"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Press Enter or click Add to include this interest in your profile
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAddInterest}
                    disabled={!newInterest.trim() || isAnalyzingInterests}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isAnalyzingInterests ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Add Interest
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowInterestForm(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Interest Suggestions */}
          {userInterests.length === 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Popular Interest Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {[
                  'Technology', 'Sports', 'Music', 'Art & Design', 'Photography',
                  'Cooking', 'Travel', 'Fitness', 'Reading', 'Gaming',
                  'Business', 'Science', 'Writing', 'Dancing', 'Yoga', 'Meditation'
                ].map((category) => (
                  <Button
                    key={category}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setUserInterests(prev => [...prev, category]);
                      setShowInterestForm(false);
                    }}
                    className="justify-start border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300"
                  >
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                    {category}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                onClick={() => setShowInterestForm(true)}
                className="w-full border-dashed border-2 border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Interest
              </Button>
            </div>
          )}

          {/* AI Analysis Status */}
          {userInterests.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Brain className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-blue-800">AI Analysis Active</p>
                  <p className="text-sm text-blue-600">
                    Analyzing {userInterests.length} interest{userInterests.length !== 1 ? 's' : ''} to provide personalized recommendations
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-600">Live</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Professional Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRecommendations.map((recommendation, index) => (
          <Card
            key={recommendation.id}
            className="group relative overflow-hidden border-2 border-gray-200 hover:border-indigo-300 hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
            onClick={() => handleCardClick(recommendation)}
            onMouseEnter={() => handleView(recommendation)}
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          >
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Professional Score Badge */}
            <div className="absolute top-4 right-4 z-20">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur opacity-30"></div>
                <Badge className="relative bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 font-bold shadow-lg px-3 py-1">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    {recommendation.score.overall}% match
                  </div>
                </Badge>
              </div>
            </div>

            {/* Enhanced Type Badge */}
            <div className="absolute top-4 left-4 z-20">
              <Badge className={`${getTypeColor(recommendation.type)} border-0 font-medium shadow-md px-3 py-1 backdrop-blur-sm`}>
                <div className="flex items-center gap-2">
                  {getTypeIcon(recommendation.type)}
                  <span className="capitalize font-semibold">{recommendation.type}</span>
                </div>
              </Badge>
            </div>

            <CardHeader className="relative z-10 pb-4 pt-16">
              <div className="space-y-3">
                <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300 leading-tight">
                  {recommendation.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                  {recommendation.description}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="relative z-10 space-y-5">
              {/* Enhanced Categories */}
              <div className="flex flex-wrap gap-2">
                {recommendation.category.slice(0, 3).map(category => (
                  <Badge
                    key={category}
                    className={`${getCategoryColor(category)} border-0 text-xs font-medium px-2 py-1 shadow-sm hover:shadow-md transition-shadow duration-200`}
                  >
                    <div className={`w-2 h-2 rounded-full mr-1 ${getCategoryColor(category).split(' ')[0].replace('bg-', 'bg-').replace('text-', 'bg-')}`}></div>
                    {category}
                  </Badge>
                ))}
                {recommendation.category.length > 3 && (
                  <Badge className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-0 text-xs font-medium px-2 py-1 shadow-sm">
                    +{recommendation.category.length - 3} more
                  </Badge>
                )}
              </div>

              {/* Professional Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {recommendation.metadata.duration && (
                  <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-2 rounded-lg">
                    <div className="p-1 bg-blue-100 rounded">
                      <Clock className="h-3 w-3 text-blue-600" />
                    </div>
                    <span className="font-medium">{formatDuration(recommendation.metadata.duration)}</span>
                  </div>
                )}
                {recommendation.metadata.location && (
                  <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-2 rounded-lg">
                    <div className="p-1 bg-green-100 rounded">
                      <MapPin className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="truncate font-medium">{recommendation.metadata.location}</span>
                  </div>
                )}
                {recommendation.metadata.cost !== undefined && (
                  <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-2 rounded-lg">
                    <div className="p-1 bg-purple-100 rounded">
                      <span className="text-xs font-bold text-purple-600">
                        {recommendation.metadata.cost === 0 ? 'FREE' : `$${recommendation.metadata.cost}`}
                      </span>
                    </div>
                    <span className="font-medium">
                      {recommendation.metadata.cost === 0 ? 'No Cost' : 'Fee'}
                    </span>
                  </div>
                )}
                {recommendation.metadata.capacity && (
                  <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-2 rounded-lg">
                    <div className="p-1 bg-orange-100 rounded">
                      <Users className="h-3 w-3 text-orange-600" />
                    </div>
                    <span className="font-medium">{recommendation.metadata.capacity} spots</span>
                  </div>
                )}
              </div>

              {/* Enhanced Rating Section */}
              {recommendation.interactionData.rating > 0 && (
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= Math.floor(recommendation.interactionData.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : star <= recommendation.interactionData.rating
                              ? 'fill-yellow-200 text-yellow-300'
                              : 'fill-gray-200 text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-lg text-gray-900">{recommendation.interactionData.rating.toFixed(1)}</span>
                  </div>
                  <div className="h-4 w-px bg-yellow-300"></div>
                  <span className="text-sm text-gray-600 font-medium">
                    {recommendation.interactionData.ratingCount} reviews
                  </span>
                </div>
              )}

              {/* Professional Explanations */}
              {showExplanations && recommendation.reasons.length > 0 && (
                <div className="space-y-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 text-sm font-semibold text-blue-800 mb-3">
                    <Lightbulb className="h-4 w-4" />
                    <span>AI Analysis</span>
                  </div>
                  {recommendation.reasons.slice(0, 2).map((reason, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <div className="flex-shrink-0 p-1 bg-blue-100 rounded">
                        {getReasonIcon(reason.type)}
                      </div>
                      <span className="text-gray-700 flex-1">{reason.description}</span>
                      <Badge className="bg-blue-100 text-blue-700 border-0 text-xs font-bold px-2 py-1">
                        {reason.confidence}%
                      </Badge>
                    </div>
                  ))}
                </div>
              )}

              {/* Enhanced Tags */}
              {recommendation.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {recommendation.tags.slice(0, 3).map(tag => (
                    <Badge
                      key={tag}
                      className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-0 text-xs font-medium px-3 py-1 hover:shadow-md transition-shadow duration-200"
                    >
                      #{tag}
                    </Badge>
                  ))}
                  {recommendation.tags.length > 3 && (
                    <Badge className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-600 border-0 text-xs font-medium px-3 py-1">
                      +{recommendation.tags.length - 3} tags
                    </Badge>
                  )}
                </div>
              )}

              {/* Professional Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleBookmark(recommendation.id, e)}
                    className="p-2 h-10 w-10 hover:bg-indigo-100 transition-colors duration-200"
                  >
                    {bookmarkedItems.has(recommendation.id) ? (
                      <BookmarkCheck className="h-5 w-5 text-indigo-600" />
                    ) : (
                      <Bookmark className="h-5 w-5 text-gray-400 hover:text-indigo-600 transition-colors duration-200" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 h-10 w-10 hover:bg-indigo-100 transition-colors duration-200"
                  >
                    <ExternalLink className="h-5 w-5 text-gray-400 hover:text-indigo-600 transition-colors duration-200" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 h-10 w-10 hover:bg-indigo-100 transition-colors duration-200"
                  >
                    <Share2 className="h-5 w-5 text-gray-400 hover:text-indigo-600 transition-colors duration-200" />
                  </Button>
                </div>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:via-purple-600 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-6"
                >
                  Explore Details
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </Card>
        ))}
      </div>

      {/* Load More / Empty State */}
      {filteredRecommendations.length === 0 && !isLoading && (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-8 text-center">
            <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No recommendations found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your filters or refresh to get new recommendations.
            </p>
            <Button onClick={refreshRecommendations} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Recommendations
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600 mr-2" />
          <span className="text-gray-600">Loading recommendations...</span>
        </div>
      )}
    </div>
  );
};

export default AIRecommendationSystem;
