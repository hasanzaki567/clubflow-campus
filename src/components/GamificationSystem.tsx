import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Trophy,
  Star,
  Target,
  Flame,
  Award,
  TrendingUp,
  Users,
  Calendar,
  Zap,
  Gift,
  Crown,
  Medal,
  Shield,
  Sword,
  Heart,
  Sparkles,
  ChevronRight,
  Lock,
  CheckCircle2,
  Clock,
  BarChart3,
  Gem,
  Coins,
  Sparkle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useNotifications, createAchievementNotification } from '@/contexts/NotificationContext';

// Achievement types and definitions
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'engagement' | 'achievement' | 'social' | 'learning';
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedDate?: string;
}

interface UserStats {
  totalPoints: number;
  level: number;
  experience: number;
  experienceToNext: number;
  currentStreak: number;
  longestStreak: number;
  achievementsUnlocked: number;
  totalAchievements: number;
  rank: number;
  totalUsers: number;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  points: number;
  level: number;
  achievements: number;
  rank: number;
  trend: 'up' | 'down' | 'same';
}

// Sample achievements data
const achievements: Achievement[] = [
  {
    id: 'first_login',
    title: 'Welcome Aboard!',
    description: 'Complete your first login',
    icon: <Star className="h-4 w-4" />,
    category: 'engagement',
    points: 10,
    rarity: 'common',
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    unlockedDate: new Date().toISOString()
  },
  {
    id: 'join_club',
    title: 'Club Explorer',
    description: 'Join your first club',
    icon: <Users className="h-4 w-4" />,
    category: 'social',
    points: 25,
    rarity: 'common',
    unlocked: true,
    progress: 1,
    maxProgress: 1
  },
  {
    id: 'attend_event',
    title: 'Event Enthusiast',
    description: 'Attend 5 events',
    icon: <Calendar className="h-4 w-4" />,
    category: 'engagement',
    points: 50,
    rarity: 'common',
    unlocked: false,
    progress: 2,
    maxProgress: 5
  },
  {
    id: 'create_event',
    title: 'Event Organizer',
    description: 'Create 3 events',
    icon: <Target className="h-4 w-4" />,
    category: 'achievement',
    points: 75,
    rarity: 'rare',
    unlocked: false,
    progress: 1,
    maxProgress: 3
  },
  {
    id: 'week_streak',
    title: 'Dedicated Member',
    description: 'Maintain a 7-day streak',
    icon: <Flame className="h-4 w-4" />,
    category: 'engagement',
    points: 100,
    rarity: 'rare',
    unlocked: false,
    progress: 3,
    maxProgress: 7
  },
  {
    id: 'mentor',
    title: 'Mentor',
    description: 'Help 10 new members',
    icon: <Crown className="h-4 w-4" />,
    category: 'social',
    points: 150,
    rarity: 'epic',
    unlocked: false,
    progress: 4,
    maxProgress: 10
  },
  {
    id: 'legend',
    title: 'Campus Legend',
    description: 'Reach level 50',
    icon: <Medal className="h-4 w-4" />,
    category: 'achievement',
    points: 500,
    rarity: 'legendary',
    unlocked: false,
    progress: 25,
    maxProgress: 50
  }
];

// Sample leaderboard data
const leaderboardData: LeaderboardEntry[] = [
  { id: '1', name: 'Alex Johnson', avatar: '👑', points: 2840, level: 28, achievements: 45, rank: 1, trend: 'up' },
  { id: '2', name: 'Sarah Chen', avatar: '🎓', points: 2650, level: 26, achievements: 42, rank: 2, trend: 'same' },
  { id: '3', name: 'Mike Wilson', avatar: '⚡', points: 2390, level: 24, achievements: 38, rank: 3, trend: 'up' },
  { id: '4', name: 'Emma Davis', avatar: '🌟', points: 2150, level: 22, achievements: 35, rank: 4, trend: 'down' },
  { id: '5', name: 'You', avatar: '🎯', points: 1890, level: 19, achievements: 28, rank: 5, trend: 'up' },
];

const GamificationSystem: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { addNotification } = useNotifications();
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 1890,
    level: 19,
    experience: 1890,
    experienceToNext: 210,
    currentStreak: 5,
    longestStreak: 12,
    achievementsUnlocked: 28,
    totalAchievements: 50,
    rank: 5,
    totalUsers: 1247
  });

  // Filter achievements by category
  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(achievement => achievement.category === selectedCategory);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'secondary';
      case 'rare': return 'default';
      case 'epic': return 'destructive';
      case 'legendary': return 'outline';
      default: return 'secondary';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'engagement': return <Target className="h-4 w-4" />;
      case 'achievement': return <Trophy className="h-4 w-4" />;
      case 'social': return <Users className="h-4 w-4" />;
      case 'learning': return <Award className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const experiencePercentage = (userStats.experience % 100);

  // Demo: Add some sample notifications on component mount
  useEffect(() => {
    // Add a sample achievement notification after 2 seconds
    const timer1 = setTimeout(() => {
      addNotification(createAchievementNotification(
        'Welcome Achievement!',
        'welcome_bonus',
        50,
        '🎉'
      ));
    }, 2000);

    // Add a sample event notification after 4 seconds
    const timer2 = setTimeout(() => {
      addNotification({
        type: 'event',
        title: 'Event Starting Soon',
        message: 'Tech Talk 2024 starts in 30 minutes. Don\'t forget to join!',
        priority: 'medium',
        metadata: {
          eventId: 'tech_talk_2024',
        },
      });
    }, 4000);

    // Add a sample reminder notification after 6 seconds
    const timer3 = setTimeout(() => {
      addNotification({
        type: 'reminder',
        title: 'Daily Goal Reminder',
        message: 'You\'re almost at your daily XP goal! Complete one more activity to earn bonus points.',
        priority: 'low',
      });
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [addNotification]);

  return (
    <div className="space-y-8 p-1">
      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, Champion! 🏆</h1>
              <p className="text-indigo-100">Your journey to greatness continues...</p>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <Sparkle className="h-4 w-4" />
              <span className="text-sm font-medium">Level Up!</span>
            </div>
          </div>

          {/* User Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white/15 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 bg-yellow-400/20 rounded-lg">
                    <Coins className="h-5 w-5 text-yellow-300" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-yellow-300">{userStats.totalPoints.toLocaleString()}</div>
                <div className="text-sm text-indigo-100">Total Points</div>
              </CardContent>
            </Card>

            <Card className="bg-white/15 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 bg-green-400/20 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-300" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-300">Level {userStats.level}</div>
                <div className="text-sm text-indigo-100">Current Level</div>
              </CardContent>
            </Card>

            <Card className="bg-white/15 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 bg-orange-400/20 rounded-lg">
                    <Flame className="h-5 w-5 text-orange-300" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-orange-300">{userStats.currentStreak}</div>
                <div className="text-sm text-indigo-100">Day Streak</div>
              </CardContent>
            </Card>

            <Card className="bg-white/15 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 bg-purple-400/20 rounded-lg">
                    <Trophy className="h-5 w-5 text-purple-300" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-300">#{userStats.rank}</div>
                <div className="text-sm text-indigo-100">Global Rank</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <Card className="border-2 border-gradient-to-r from-indigo-200 to-purple-200 bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-bold">
                Level Progress
              </span>
              <div className="text-sm font-normal text-muted-foreground mt-1">
                {userStats.experienceToNext} XP needed for Level {userStats.level + 1}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-indigo-700">Level {userStats.level}</span>
              <span className="text-purple-700">Level {userStats.level + 1}</span>
            </div>
            <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${experiencePercentage}%` }}
              ></div>
              <div className="absolute inset-0 bg-white/20 rounded-full"></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span className="font-medium">{userStats.experience.toLocaleString()} XP</span>
              <span className="font-medium">{(userStats.experience + userStats.experienceToNext).toLocaleString()} XP</span>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-indigo-200">
            <div className="text-center">
              <div className="text-lg font-bold text-indigo-600">{userStats.achievementsUnlocked}</div>
              <div className="text-xs text-muted-foreground">Achievements</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{userStats.longestStreak}</div>
              <div className="text-xs text-muted-foreground">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-pink-600">{userStats.totalUsers.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Total Users</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Gamification Tabs */}
      <Tabs defaultValue="achievements" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Challenges
          </TabsTrigger>
        </TabsList>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          {/* Achievement Categories */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All ({achievements.length})
            </Button>
            <Button
              variant={selectedCategory === 'engagement' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('engagement')}
            >
              <Target className="h-3 w-3 mr-1" />
              Engagement ({achievements.filter(a => a.category === 'engagement').length})
            </Button>
            <Button
              variant={selectedCategory === 'achievement' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('achievement')}
            >
              <Trophy className="h-3 w-3 mr-1" />
              Achievement ({achievements.filter(a => a.category === 'achievement').length})
            </Button>
            <Button
              variant={selectedCategory === 'social' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('social')}
            >
              <Users className="h-3 w-3 mr-1" />
              Social ({achievements.filter(a => a.category === 'social').length})
            </Button>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement) => {
              const getRarityGradient = (rarity: string) => {
                switch (rarity) {
                  case 'common': return 'from-gray-400 to-gray-600';
                  case 'rare': return 'from-blue-400 to-blue-600';
                  case 'epic': return 'from-purple-400 to-purple-600';
                  case 'legendary': return 'from-yellow-400 to-orange-500';
                  default: return 'from-gray-400 to-gray-600';
                }
              };

              const getRarityIconBg = (rarity: string) => {
                switch (rarity) {
                  case 'common': return 'bg-gray-100 text-gray-600';
                  case 'rare': return 'bg-blue-100 text-blue-600';
                  case 'epic': return 'bg-purple-100 text-purple-600';
                  case 'legendary': return 'bg-yellow-100 text-yellow-600';
                  default: return 'bg-gray-100 text-gray-600';
                }
              };

              return (
                <Card
                  key={achievement.id}
                  className={`relative group transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    achievement.unlocked
                      ? 'border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md'
                      : 'border-2 border-gray-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  {/* Achievement Glow Effect */}
                  {achievement.unlocked && (
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-lg blur-sm"></div>
                  )}

                  <CardHeader className="pb-4 relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl transition-all duration-300 ${getRarityIconBg(achievement.rarity)} ${
                          achievement.unlocked ? 'shadow-lg' : 'group-hover:shadow-md'
                        }`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg font-bold mb-1">{achievement.title}</CardTitle>
                          <Badge
                            variant={getRarityBadgeColor(achievement.rarity)}
                            className={`text-xs font-semibold px-2 py-1 ${
                              achievement.rarity === 'legendary' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0' :
                              achievement.rarity === 'epic' ? 'bg-gradient-to-r from-purple-400 to-purple-600 text-white border-0' :
                              achievement.rarity === 'rare' ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white border-0' :
                              'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {achievement.rarity.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      {achievement.unlocked && (
                        <div className="p-1 bg-green-100 rounded-full">
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 relative z-10">
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{achievement.description}</p>

                    {/* Progress Bar */}
                    {achievement.maxProgress > 1 && (
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-gray-600">Progress</span>
                          <span className="text-indigo-600 font-bold">{achievement.progress}/{achievement.maxProgress}</span>
                        </div>
                        <div className="relative">
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                achievement.unlocked
                                  ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                  : 'bg-gradient-to-r from-indigo-400 to-purple-500'
                              }`}
                              style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                            ></div>
                          </div>
                          {!achievement.unlocked && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-yellow-100 rounded-lg">
                          <Star className="h-4 w-4 text-yellow-600" />
                        </div>
                        <span className="font-bold text-yellow-600 text-lg">{achievement.points} XP</span>
                      </div>
                      {achievement.unlocked && achievement.unlockedDate && (
                        <div className="flex items-center gap-1 text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Unlocked {new Date(achievement.unlockedDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Achievement Rarity Border Effect */}
                    <div className={`absolute inset-0 rounded-lg border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      achievement.rarity === 'legendary' ? 'border-yellow-400 shadow-yellow-400/50' :
                      achievement.rarity === 'epic' ? 'border-purple-400 shadow-purple-400/50' :
                      achievement.rarity === 'rare' ? 'border-blue-400 shadow-blue-400/50' :
                      'border-gray-300 shadow-gray-300/50'
                    } shadow-lg`}></div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6">
          <Card className="border-2 border-gradient-to-r from-indigo-200 to-purple-200 bg-gradient-to-br from-indigo-50/50 to-purple-50/50">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-bold">
                  Global Leaderboard
                </span>
              </CardTitle>
              <CardDescription className="text-base">Top performers across all campus activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboardData.map((entry, index) => {
                  const getRankGradient = (rank: number) => {
                    switch (rank) {
                      case 1: return 'from-yellow-400 to-orange-500';
                      case 2: return 'from-gray-300 to-gray-500';
                      case 3: return 'from-amber-400 to-amber-600';
                      default: return 'from-indigo-400 to-purple-500';
                    }
                  };

                  const getRankBg = (rank: number) => {
                    switch (rank) {
                      case 1: return 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-yellow-400/50';
                      case 2: return 'bg-gradient-to-br from-gray-300 to-gray-500 shadow-gray-400/50';
                      case 3: return 'bg-gradient-to-br from-amber-400 to-amber-600 shadow-amber-400/50';
                      default: return 'bg-gradient-to-br from-indigo-400 to-purple-500 shadow-indigo-400/50';
                    }
                  };

                  return (
                    <div
                      key={entry.id}
                      className={`group relative flex items-center justify-between p-6 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                        entry.name === 'You'
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-md'
                          : 'bg-white border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      {/* Rank Badge */}
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getRankBg(entry.rank)} text-white font-bold text-lg shadow-lg`}>
                          {entry.rank}
                        </div>
                        <div className="text-3xl">{entry.avatar}</div>
                        <div>
                          <p className="font-bold text-lg text-gray-900">{entry.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Level {entry.level} • {entry.achievements} achievements
                          </p>
                        </div>
                      </div>

                      {/* Points and Trend */}
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-bold text-2xl text-indigo-600">{entry.points.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground font-medium">points</p>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                          entry.trend === 'up' ? 'bg-green-100 text-green-700' :
                          entry.trend === 'down' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {entry.trend === 'up' && <TrendingUp className="h-4 w-4" />}
                          {entry.trend === 'down' && <TrendingUp className="h-4 w-4 rotate-180" />}
                          {entry.trend === 'same' && <div className="h-4 w-4 text-center">—</div>}
                          <span className="text-sm font-medium">
                            {entry.trend === 'up' ? 'Rising' : entry.trend === 'down' ? 'Falling' : 'Stable'}
                          </span>
                        </div>
                      </div>

                      {/* Hover Effect Border */}
                      <div className={`absolute inset-0 rounded-xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        entry.rank === 1 ? 'border-yellow-400 shadow-yellow-400/50' :
                        entry.rank === 2 ? 'border-gray-400 shadow-gray-400/50' :
                        entry.rank === 3 ? 'border-amber-400 shadow-amber-400/50' :
                        'border-indigo-400 shadow-indigo-400/50'
                      } shadow-lg`}></div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Challenges Tab */}
        <TabsContent value="challenges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">
                    Daily Challenges
                  </span>
                </CardTitle>
                <CardDescription className="text-base">Complete these tasks to earn bonus points</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="group flex items-center justify-between p-4 border-2 border-blue-100 rounded-xl bg-white/70 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Attend an Event</p>
                      <p className="text-sm text-blue-600 font-medium">+25 XP</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300">
                    Complete
                  </Button>
                </div>

                <div className="group flex items-center justify-between p-4 border-2 border-green-100 rounded-xl bg-white/70 hover:border-green-300 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Join a Club</p>
                      <p className="text-sm text-green-600 font-medium">+50 XP</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300">
                    Complete
                  </Button>
                </div>

                <div className="group flex items-center justify-between p-4 border-2 border-purple-100 rounded-xl bg-white/70 hover:border-purple-300 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Flame className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">5-Day Streak</p>
                      <p className="text-sm text-purple-600 font-medium">+100 XP</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300">
                    Complete
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50/50 to-orange-50/50 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent font-bold">
                    Weekly Challenges
                  </span>
                </CardTitle>
                <CardDescription className="text-base">Longer-term goals with bigger rewards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="group flex items-center justify-between p-4 border-2 border-yellow-100 rounded-xl bg-white/70 hover:border-yellow-300 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Star className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Create 3 Events</p>
                      <p className="text-sm text-yellow-600 font-medium">+200 XP</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative w-20 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500" style={{ width: '33%' }}></div>
                    </div>
                    <span className="text-sm font-bold text-yellow-600">1/3</span>
                  </div>
                </div>

                <div className="group flex items-center justify-between p-4 border-2 border-red-100 rounded-xl bg-white/70 hover:border-red-300 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Crown className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Help 5 New Members</p>
                      <p className="text-sm text-red-600 font-medium">+150 XP</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative w-20 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-400 to-pink-500 rounded-full transition-all duration-500" style={{ width: '80%' }}></div>
                    </div>
                    <span className="text-sm font-bold text-red-600">4/5</span>
                  </div>
                </div>

                <div className="group flex items-center justify-between p-4 border-2 border-indigo-100 rounded-xl bg-white/70 hover:border-indigo-300 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Medal className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Reach Level 25</p>
                      <p className="text-sm text-indigo-600 font-medium">+300 XP</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative w-20 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full transition-all duration-500" style={{ width: '76%' }}></div>
                    </div>
                    <span className="text-sm font-bold text-indigo-600">19/25</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamificationSystem;
