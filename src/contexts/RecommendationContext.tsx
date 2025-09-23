import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  RecommendationItem,
  UserPreferences,
  RecommendationSettings,
  RecommendationContextType,
  UserInteraction,
  RecommendationType,
  UserPreferenceCategory
} from '@/types/recommendation';

const RecommendationContext = createContext<RecommendationContextType | undefined>(undefined);

// Default user preferences
const defaultPreferences: UserPreferences = {
  categories: ['academic', 'technology', 'social'],
  timePreferences: {
    weekdays: true,
    weekends: true,
    mornings: false,
    afternoons: true,
    evenings: true,
  },
  locationPreferences: {
    onCampus: true,
    offCampus: false,
    virtual: true,
  },
  skillLevel: 'intermediate',
  groupSize: 'medium',
  budget: 'low',
};

// Default settings
const defaultSettings: RecommendationSettings = {
  maxRecommendations: 10,
  refreshInterval: 30,
  enableExplanations: true,
  diversityFactor: 0.7,
  explorationRate: 0.3,
  coldStartStrategy: 'popular',
};

// Sample recommendation data
const sampleRecommendations: RecommendationItem[] = [
  {
    id: 'rec_1',
    type: 'event',
    title: 'AI & Machine Learning Workshop',
    description: 'Learn the fundamentals of AI and ML with hands-on projects',
    category: ['technology', 'academic'],
    tags: ['AI', 'Machine Learning', 'Python', 'Data Science'],
    score: {
      overall: 95,
      relevance: 98,
      popularity: 92,
      personalization: 96,
      timeliness: 90,
    },
    reasons: [
      {
        type: 'category_match',
        description: 'Matches your interest in technology',
        confidence: 95,
      },
      {
        type: 'skill_level',
        description: 'Perfect for intermediate skill level',
        confidence: 90,
      },
    ],
    metadata: {
      eventId: 'event_1',
      duration: 120,
      capacity: 50,
      difficulty: 'intermediate',
      cost: 0,
      location: 'Computer Science Lab',
      startDate: '2024-01-15T14:00:00Z',
      endDate: '2024-01-15T16:00:00Z',
      prerequisites: ['Basic Python knowledge'],
      skills: ['Python', 'Machine Learning', 'Data Analysis'],
    },
    interactionData: {
      views: 245,
      clicks: 89,
      bookmarks: 34,
      registrations: 42,
      rating: 4.8,
      ratingCount: 28,
    },
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-12T15:30:00Z',
  },
  {
    id: 'rec_2',
    type: 'club',
    title: 'Tech Innovators Club',
    description: 'A community of tech enthusiasts working on innovative projects',
    category: ['technology', 'social'],
    tags: ['Innovation', 'Projects', 'Networking', 'Startups'],
    score: {
      overall: 88,
      relevance: 85,
      popularity: 90,
      personalization: 87,
      timeliness: 92,
    },
    reasons: [
      {
        type: 'similar_users',
        description: 'Popular among students with similar interests',
        confidence: 88,
      },
      {
        type: 'user_history',
        description: 'Based on your event participation history',
        confidence: 85,
      },
    ],
    metadata: {
      clubId: 'club_1',
      duration: 90,
      capacity: 30,
      difficulty: 'intermediate',
      cost: 0,
      location: 'Innovation Hub',
      startDate: '2024-01-20T18:00:00Z',
      endDate: '2024-01-20T19:30:00Z',
      skills: ['Project Management', 'Innovation', 'Teamwork'],
    },
    interactionData: {
      views: 189,
      clicks: 67,
      bookmarks: 23,
      registrations: 18,
      rating: 4.6,
      ratingCount: 15,
    },
    createdAt: '2024-01-08T09:00:00Z',
    updatedAt: '2024-01-12T14:20:00Z',
  },
  {
    id: 'rec_3',
    type: 'event',
    title: 'Campus Career Fair 2024',
    description: 'Meet top employers and explore career opportunities',
    category: ['career', 'academic'],
    tags: ['Career', 'Networking', 'Jobs', 'Internships'],
    score: {
      overall: 82,
      relevance: 78,
      popularity: 95,
      personalization: 75,
      timeliness: 88,
    },
    reasons: [
      {
        type: 'trending',
        description: 'Currently trending among students',
        confidence: 95,
      },
      {
        type: 'time_match',
        description: 'Scheduled for your preferred time',
        confidence: 88,
      },
    ],
    metadata: {
      eventId: 'event_2',
      duration: 180,
      capacity: 200,
      difficulty: 'beginner',
      cost: 0,
      location: 'Student Center',
      startDate: '2024-01-25T10:00:00Z',
      endDate: '2024-01-25T13:00:00Z',
      skills: ['Networking', 'Communication', 'Career Planning'],
    },
    interactionData: {
      views: 456,
      clicks: 123,
      bookmarks: 78,
      registrations: 156,
      rating: 4.4,
      ratingCount: 89,
    },
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-01-12T16:45:00Z',
  },
  {
    id: 'rec_4',
    type: 'activity',
    title: 'Photography Walk',
    description: 'Explore campus through the lens of photography',
    category: ['arts', 'outdoor'],
    tags: ['Photography', 'Art', 'Nature', 'Creative'],
    score: {
      overall: 75,
      relevance: 72,
      popularity: 78,
      personalization: 70,
      timeliness: 85,
    },
    reasons: [
      {
        type: 'category_match',
        description: 'Matches your interest in creative activities',
        confidence: 72,
      },
      {
        type: 'diversity',
        description: 'Adding variety to your recommendations',
        confidence: 75,
      },
    ],
    metadata: {
      duration: 120,
      capacity: 15,
      difficulty: 'beginner',
      cost: 0,
      location: 'Campus Gardens',
      startDate: '2024-01-18T15:00:00Z',
      endDate: '2024-01-18T17:00:00Z',
      skills: ['Photography', 'Creative Thinking', 'Observation'],
    },
    interactionData: {
      views: 98,
      clicks: 34,
      bookmarks: 12,
      registrations: 8,
      rating: 4.7,
      ratingCount: 6,
    },
    createdAt: '2024-01-09T13:00:00Z',
    updatedAt: '2024-01-12T12:10:00Z',
  },
];

export const RecommendationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(sampleRecommendations);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(defaultPreferences);
  const [settings, setSettings] = useState<RecommendationSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      try {
        setUserPreferences({ ...defaultPreferences, ...JSON.parse(savedPreferences) });
      } catch (error) {
        console.error('Failed to parse user preferences:', error);
      }
    }

    const savedSettings = localStorage.getItem('recommendationSettings');
    if (savedSettings) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
      } catch (error) {
        console.error('Failed to parse recommendation settings:', error);
      }
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
  }, [userPreferences]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('recommendationSettings', JSON.stringify(settings));
  }, [settings]);

  // Auto-refresh recommendations
  useEffect(() => {
    const interval = setInterval(() => {
      refreshRecommendations();
    }, settings.refreshInterval * 60 * 1000);

    return () => clearInterval(interval);
  }, [settings.refreshInterval]);

  const updatePreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
    setUserPreferences(prev => ({ ...prev, ...newPreferences }));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<RecommendationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const refreshRecommendations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real implementation, this would call an API
      // For now, we'll just shuffle and update the existing recommendations
      const shuffled = [...sampleRecommendations]
        .sort(() => Math.random() - 0.5)
        .slice(0, settings.maxRecommendations);

      setRecommendations(shuffled);
    } catch (err) {
      setError('Failed to refresh recommendations');
      console.error('Error refreshing recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  }, [settings.maxRecommendations]);

  const getRecommendations = useCallback((
    type?: RecommendationType,
    limit?: number
  ): RecommendationItem[] => {
    let filtered = recommendations;

    if (type) {
      filtered = filtered.filter(rec => rec.type === type);
    }

    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered.sort((a, b) => b.score.overall - a.score.overall);
  }, [recommendations]);

  const recordInteraction = useCallback((
    interaction: Omit<UserInteraction, 'userId' | 'timestamp'>
  ) => {
    const newInteraction: UserInteraction = {
      userId: 'current_user', // In a real app, this would come from auth context
      timestamp: new Date().toISOString(),
      ...interaction,
    };

    // In a real implementation, this would be sent to an API
    console.log('Recording interaction:', newInteraction);

    // Update local interaction data for demo purposes
    setRecommendations(prev =>
      prev.map(rec => {
        if (rec.id === interaction.itemId) {
          const updatedInteractionData = { ...rec.interactionData };

          switch (interaction.interactionType) {
            case 'view':
              updatedInteractionData.views++;
              break;
            case 'click':
              updatedInteractionData.clicks++;
              break;
            case 'bookmark':
              updatedInteractionData.bookmarks++;
              break;
            case 'register':
              updatedInteractionData.registrations++;
              break;
            case 'rate':
              if (interaction.metadata?.rating) {
                const currentTotal = updatedInteractionData.rating * updatedInteractionData.ratingCount;
                updatedInteractionData.ratingCount++;
                updatedInteractionData.rating = (currentTotal + interaction.metadata.rating) / updatedInteractionData.ratingCount;
              }
              break;
          }

          return {
            ...rec,
            interactionData: updatedInteractionData,
            updatedAt: new Date().toISOString(),
          };
        }
        return rec;
      })
    );
  }, []);

  const getRecommendationStats = useCallback(() => {
    const totalRecommendations = recommendations.length;
    const averageScore = recommendations.reduce((sum, rec) => sum + rec.score.overall, 0) / totalRecommendations;

    const categoryCount: Record<UserPreferenceCategory, number> = {
      academic: 0,
      sports: 0,
      arts: 0,
      technology: 0,
      social: 0,
      volunteer: 0,
      career: 0,
      wellness: 0,
      cultural: 0,
      outdoor: 0,
    };

    recommendations.forEach(rec => {
      rec.category.forEach(cat => {
        categoryCount[cat]++;
      });
    });

    const topCategories = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category as UserPreferenceCategory);

    const totalInteractions = recommendations.reduce((sum, rec) =>
      sum + rec.interactionData.views + rec.interactionData.clicks + rec.interactionData.registrations, 0
    );

    const interactionRate = totalInteractions / (totalRecommendations * 10); // Assuming 10 as base interaction count

    return {
      totalRecommendations,
      averageScore: Math.round(averageScore * 100) / 100,
      topCategories,
      interactionRate: Math.round(interactionRate * 100) / 100,
    };
  }, [recommendations]);

  const value: RecommendationContextType = {
    recommendations,
    userPreferences,
    settings,
    isLoading,
    error,
    updatePreferences,
    updateSettings,
    refreshRecommendations,
    getRecommendations,
    recordInteraction,
    getRecommendationStats,
  };

  return (
    <RecommendationContext.Provider value={value}>
      {children}
    </RecommendationContext.Provider>
  );
};

export const useRecommendations = () => {
  const context = useContext(RecommendationContext);
  if (context === undefined) {
    throw new Error('useRecommendations must be used within a RecommendationProvider');
  }
  return context;
};
