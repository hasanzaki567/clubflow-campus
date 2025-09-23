// AI Recommendation System Types and Interfaces

export type RecommendationType = 'event' | 'club' | 'activity' | 'course' | 'social';

export type RecommendationAlgorithm = 'collaborative' | 'content_based' | 'hybrid' | 'trending' | 'personalized';

export type UserPreferenceCategory =
  | 'academic'
  | 'sports'
  | 'arts'
  | 'technology'
  | 'social'
  | 'volunteer'
  | 'career'
  | 'wellness'
  | 'cultural'
  | 'outdoor';

export interface UserPreferences {
  categories: UserPreferenceCategory[];
  timePreferences: {
    weekdays: boolean;
    weekends: boolean;
    mornings: boolean;
    afternoons: boolean;
    evenings: boolean;
  };
  locationPreferences: {
    onCampus: boolean;
    offCampus: boolean;
    virtual: boolean;
  };
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  groupSize: 'small' | 'medium' | 'large' | 'any';
  budget: 'free' | 'low' | 'medium' | 'high' | 'any';
}

export interface RecommendationScore {
  overall: number; // 0-100
  relevance: number; // 0-100
  popularity: number; // 0-100
  personalization: number; // 0-100
  timeliness: number; // 0-100
}

export interface RecommendationReason {
  type: 'user_history' | 'similar_users' | 'trending' | 'category_match' | 'skill_level' | 'time_match' | 'diversity';
  description: string;
  confidence: number; // 0-100
}

export interface RecommendationItem {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  imageUrl?: string;
  category: UserPreferenceCategory[];
  tags: string[];
  score: RecommendationScore;
  reasons: RecommendationReason[];
  metadata: {
    eventId?: string;
    clubId?: string;
    duration?: number; // in minutes
    capacity?: number;
    difficulty?: string;
    cost?: number;
    location?: string;
    startDate?: string;
    endDate?: string;
    prerequisites?: string[];
    skills?: string[];
  };
  interactionData: {
    views: number;
    clicks: number;
    bookmarks: number;
    registrations: number;
    rating: number; // 1-5
    ratingCount: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserInteraction {
  userId: string;
  itemId: string;
  itemType: RecommendationType;
  interactionType: 'view' | 'click' | 'bookmark' | 'register' | 'rate' | 'complete' | 'skip';
  timestamp: string;
  metadata?: {
    rating?: number;
    duration?: number;
    completionStatus?: 'partial' | 'complete' | 'abandoned';
  };
}

export interface RecommendationSettings {
  maxRecommendations: number;
  refreshInterval: number; // in minutes
  enableExplanations: boolean;
  diversityFactor: number; // 0-1, how diverse recommendations should be
  explorationRate: number; // 0-1, balance between exploration vs exploitation
  coldStartStrategy: 'popular' | 'diverse' | 'random' | 'category_based';
}

export interface RecommendationContextType {
  recommendations: RecommendationItem[];
  userPreferences: UserPreferences;
  settings: RecommendationSettings;
  isLoading: boolean;
  error: string | null;

  // Actions
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  updateSettings: (settings: Partial<RecommendationSettings>) => void;
  refreshRecommendations: () => Promise<void>;
  getRecommendations: (type?: RecommendationType, limit?: number) => RecommendationItem[];
  recordInteraction: (interaction: Omit<UserInteraction, 'userId' | 'timestamp'>) => void;
  getRecommendationStats: () => {
    totalRecommendations: number;
    averageScore: number;
    topCategories: UserPreferenceCategory[];
    interactionRate: number;
  };
}

// Event-specific recommendation interface
export interface EventRecommendation extends RecommendationItem {
  type: 'event';
  metadata: RecommendationItem['metadata'] & {
    eventId: string;
    organizer: string;
    registrationDeadline?: string;
    maxParticipants?: number;
    currentParticipants?: number;
    isVirtual?: boolean;
    requiresApproval?: boolean;
  };
}

// Club-specific recommendation interface
export interface ClubRecommendation extends RecommendationItem {
  type: 'club';
  metadata: RecommendationItem['metadata'] & {
    clubId: string;
    memberCount: number;
    meetingFrequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
    leadership: string[];
    achievements: string[];
    requirements?: string[];
  };
}
