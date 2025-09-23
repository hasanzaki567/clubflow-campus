// Chat System Types and Interfaces

export type ChatMessageType = 'text' | 'image' | 'file' | 'system' | 'ai_suggestion';

export type ChatParticipantType = 'user' | 'event_manager' | 'club_admin' | 'system_admin' | 'ai_assistant';

export type ChatStatus = 'active' | 'archived' | 'blocked' | 'pending';

export type MessagePriority = 'low' | 'normal' | 'high' | 'urgent';

export interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
  type: ChatParticipantType;
  role?: string;
  isOnline: boolean;
  lastSeen?: string;
  department?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    office?: string;
  };
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  sender: ChatParticipant;
  content: string;
  type: ChatMessageType;
  timestamp: string;
  isRead: boolean;
  priority: MessagePriority;
  metadata?: {
    fileName?: string;
    fileSize?: number;
    fileUrl?: string;
    imageUrl?: string;
    imageAlt?: string;
    replyTo?: string; // message ID being replied to
    edited?: boolean;
    editedAt?: string;
  };
  reactions?: {
    emoji: string;
    count: number;
    users: string[]; // user IDs who reacted
  }[];
  aiContext?: {
    suggestionType?: 'event_recommendation' | 'club_suggestion' | 'general_advice';
    confidence?: number;
    tags?: string[];
    relatedItems?: string[]; // IDs of related events/clubs
  };
}

export interface ChatConversation {
  id: string;
  title: string;
  participants: ChatParticipant[];
  lastMessage?: ChatMessage;
  lastActivity: string;
  status: ChatStatus;
  unreadCount: number;
  priority: MessagePriority;
  category: 'event_support' | 'club_inquiry' | 'general_inquiry' | 'ai_assistance' | 'management';
  tags: string[];
  metadata?: {
    eventId?: string;
    clubId?: string;
    department?: string;
    urgency?: string;
    assignedTo?: string[];
  };
  settings: {
    notifications: boolean;
    soundEnabled: boolean;
    autoTranslate: boolean;
    language: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ChatContextType {
  conversations: ChatConversation[];
  activeConversation: ChatConversation | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  unreadTotal: number;

  // Actions
  createConversation: (participants: ChatParticipant[], category: ChatConversation['category'], title?: string) => Promise<ChatConversation>;
  sendMessage: (conversationId: string, content: string, type?: ChatMessageType, metadata?: any) => Promise<ChatMessage>;
  markAsRead: (conversationId: string, messageId?: string) => void;
  archiveConversation: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
  updateConversationSettings: (conversationId: string, settings: Partial<ChatConversation['settings']>) => void;
  searchConversations: (query: string) => ChatConversation[];
  searchMessages: (query: string, conversationId?: string) => ChatMessage[];
  getAIResponse: (query: string, context?: string) => Promise<string>;
  uploadFile: (file: File, conversationId: string) => Promise<string>;
  reactToMessage: (messageId: string, emoji: string) => void;
  replyToMessage: (messageId: string, content: string) => Promise<ChatMessage>;
  getConversationStats: () => {
    totalConversations: number;
    activeConversations: number;
    unreadMessages: number;
    averageResponseTime: number;
    topCategories: Array<{ category: string; count: number }>;
  };
}

export interface ChatSettings {
  theme: 'light' | 'dark' | 'auto';
  soundEnabled: boolean;
  notifications: boolean;
  autoTranslate: boolean;
  language: string;
  messagePreview: boolean;
  typingIndicators: boolean;
  readReceipts: boolean;
  fileUploadSize: number; // in MB
  maxImageSize: number; // in MB
  allowedFileTypes: string[];
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  category: 'event' | 'club' | 'ai' | 'management';
  shortcut?: string;
}

export interface AIChatContext {
  userProfile: {
    interests: string[];
    preferences: string[];
    history: string[];
    role: string;
  };
  currentContext: {
    activeEvents: string[];
    enrolledClubs: string[];
    recentActivity: string[];
  };
  systemKnowledge: {
    campusPolicies: string[];
    eventGuidelines: string[];
    clubRegulations: string[];
    faq: Array<{ question: string; answer: string }>;
  };
}

// Predefined quick actions for common inquiries
export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'event_registration',
    label: 'Register for Event',
    icon: 'Calendar',
    category: 'event',
    action: () => console.log('Navigate to event registration')
  },
  {
    id: 'club_join',
    label: 'Join a Club',
    icon: 'Users',
    category: 'club',
    action: () => console.log('Navigate to club directory')
  },
  {
    id: 'ai_suggestions',
    label: 'Get AI Suggestions',
    icon: 'Brain',
    category: 'ai',
    action: () => console.log('Open AI assistant')
  },
  {
    id: 'report_issue',
    label: 'Report an Issue',
    icon: 'AlertTriangle',
    category: 'management',
    action: () => console.log('Open issue reporting')
  },
  {
    id: 'event_info',
    label: 'Event Information',
    icon: 'Info',
    category: 'event',
    action: () => console.log('Show event details')
  },
  {
    id: 'club_info',
    label: 'Club Information',
    icon: 'Info',
    category: 'club',
    action: () => console.log('Show club details')
  },
  {
    id: 'ai_help',
    label: 'AI Help & Support',
    icon: 'HelpCircle',
    category: 'ai',
    action: () => console.log('Open AI help system')
  },
  {
    id: 'contact_admin',
    label: 'Contact Admin',
    icon: 'UserCheck',
    category: 'management',
    action: () => console.log('Open admin contact')
  }
];

// AI suggestion categories
export const AI_SUGGESTION_CATEGORIES = [
  'event_recommendations',
  'club_suggestions',
  'career_advice',
  'academic_guidance',
  'social_activities',
  'skill_development',
  'networking_opportunities',
  'campus_resources'
] as const;

export type AISuggestionCategory = typeof AI_SUGGESTION_CATEGORIES[number];
