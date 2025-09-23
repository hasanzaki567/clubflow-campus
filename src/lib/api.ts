const API_BASE_URL = 'http://localhost:3000/api';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  college: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    college: string;
    role: string;
  };
}

interface User {
  id: number;
  name: string;
  email: string;
  college: string;
  role: string;
  created_at: string;
  last_login: string;
  is_active: boolean;
}

interface Club {
  id: number;
  name: string;
  description: string;
  category: string;
  admin_id: number;
  member_count: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  admin_name: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  club_id: number;
  organizer_id: number;
  event_date: string;
  location: string;
  max_attendees: number;
  current_attendees: number;
  status: string;
  created_at: string;
  updated_at: string;
  club_name: string;
  organizer_name: string;
}

interface UserStats {
  total_users: number;
  new_users_30d: number;
  students: number;
  club_admins: number;
  college_admins: number;
}

interface ClubStats {
  total_clubs: number;
  new_clubs_30d: number;
  avg_members_per_club: number;
  total_members: number;
}

interface EventStats {
  total_events: number;
  upcoming_events: number;
  completed_events: number;
  pending_events: number;
}

// Chat interfaces
interface ChatConversation {
  id: string;
  title: string;
  category: 'event_support' | 'club_inquiry' | 'ai_assistance' | 'management' | 'general_inquiry';
  status: 'active' | 'archived' | 'blocked' | 'pending';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  created_by: number;
  created_at: string;
  updated_at: string;
  last_activity: string;
  unread_count: number;
  tags: string[];
  settings: {
    notifications: boolean;
    soundEnabled: boolean;
    autoTranslate: boolean;
    language: string;
  };
  participants?: ChatParticipant[];
  lastMessage?: ChatMessage;
}

interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
  type: 'user' | 'event_manager' | 'club_admin' | 'system_admin' | 'ai_assistant';
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

interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  sender: ChatParticipant;
  content: string;
  type: 'text' | 'image' | 'file' | 'system' | 'ai_suggestion';
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  metadata?: any;
  reactions?: Array<{
    emoji: string;
    count: number;
    users: string[];
  }>;
  aiContext?: {
    suggestionType?: string;
    confidence?: number;
    tags?: string[];
    relatedItems?: string[];
  };
}

interface CreateConversationRequest {
  title: string;
  category: string;
  participantIds: string[];
  priority?: string;
}

interface SendMessageRequest {
  content: string;
  messageType?: string;
  priority?: string;
  metadata?: any;
  replyToId?: string;
}

interface ChatStats {
  totalConversations: number;
  activeConversations: number;
  totalMessages: number;
  messages24h: number;
  activeChatUsers: number;
}

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async register(userData: RegisterRequest): Promise<{ message: string; userId: number }> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getClubs(): Promise<Club[]> {
    const response = await fetch(`${API_BASE_URL}/clubs`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getClub(id: string): Promise<Club> {
    const response = await fetch(`${API_BASE_URL}/clubs/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async createClub(clubData: { name: string; description?: string; category?: string }): Promise<{ message: string; clubId: number }> {
    const response = await fetch(`${API_BASE_URL}/clubs`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(clubData),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getEvents(): Promise<Event[]> {
    const response = await fetch(`${API_BASE_URL}/events`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getEvent(id: string): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async createEvent(eventData: {
    title: string;
    description?: string;
    club_id?: number;
    event_date: string;
    location?: string;
    max_attendees?: number;
  }): Promise<{ message: string; eventId: number }> {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async joinClub(clubId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/clubs/${clubId}/join`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async leaveClub(clubId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/clubs/${clubId}/leave`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getUserClubs(userId: string): Promise<Club[]> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/clubs`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getUserStats(): Promise<UserStats> {
    const response = await fetch(`${API_BASE_URL}/stats/users`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getClubStats(): Promise<ClubStats> {
    const response = await fetch(`${API_BASE_URL}/stats/clubs`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getEventStats(): Promise<EventStats> {
    const response = await fetch(`${API_BASE_URL}/stats/events`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  // Chat API methods
  async getChatConversations(): Promise<ChatConversation[]> {
    const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getChatConversation(id: string): Promise<ChatConversation> {
    const response = await fetch(`${API_BASE_URL}/chat/conversations/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async createChatConversation(conversationData: CreateConversationRequest): Promise<{ message: string; conversationId: string; conversation: ChatConversation }> {
    const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(conversationData),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getChatMessages(conversationId: string, limit?: number, offset?: number): Promise<ChatMessage[]> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());

    const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}/messages?${params}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async sendChatMessage(conversationId: string, messageData: SendMessageRequest): Promise<{ message: string; message: ChatMessage }> {
    const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(messageData),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async reactToChatMessage(messageId: string, emoji: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/chat/messages/${messageId}/reactions`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ emoji }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getMessageReactions(messageId: string): Promise<Array<{ emoji: string; count: number; user_ids: string }>> {
    const response = await fetch(`${API_BASE_URL}/chat/messages/${messageId}/reactions`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async uploadChatFile(conversationId: string, formData: FormData): Promise<{ message: string; messageId: string; fileId: string }> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}/files`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async searchChatConversations(query: string): Promise<ChatConversation[]> {
    const response = await fetch(`${API_BASE_URL}/chat/search/conversations?q=${encodeURIComponent(query)}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async searchChatMessages(query: string, conversationId?: string): Promise<ChatMessage[]> {
    const params = new URLSearchParams({ q: query });
    if (conversationId) params.append('conversationId', conversationId);

    const response = await fetch(`${API_BASE_URL}/chat/search/messages?${params}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getChatStats(): Promise<ChatStats> {
    const response = await fetch(`${API_BASE_URL}/chat/stats`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getAIChatResponse(message: string, conversationId?: string): Promise<{ message: string; response: ChatMessage }> {
    const response = await fetch(`${API_BASE_URL}/chat/ai-response`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ message, conversationId }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/chat/messages/${messageId}/read`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }
  }

  async markConversationAsRead(conversationId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}/read`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }
  }

  async archiveChatConversation(conversationId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}/archive`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async deleteChatConversation(conversationId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async updateChatConversationSettings(conversationId: string, settings: any): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}/settings`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  // Budget API methods
  async getBudgets(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/budgets`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getBudget(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/budgets/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async createBudget(budgetData: any): Promise<{ message: string; budget: any }> {
    const response = await fetch(`${API_BASE_URL}/budgets`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(budgetData),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async updateBudget(id: string, budgetData: any): Promise<{ message: string; budget: any }> {
    const response = await fetch(`${API_BASE_URL}/budgets/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(budgetData),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async approveBudget(id: string): Promise<{ message: string; budget: any }> {
    const response = await fetch(`${API_BASE_URL}/budgets/${id}/approve`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async deleteBudget(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/budgets/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getBudgetTransactions(budgetId: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/budgets/${budgetId}/transactions`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async createBudgetTransaction(budgetId: string, transactionData: any): Promise<{ message: string; transaction: any }> {
    const response = await fetch(`${API_BASE_URL}/budgets/${budgetId}/transactions`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getBudgetStats(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/budgets/stats`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  // Sponsorship API methods
  async getSponsorships(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/sponsorships`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getSponsorship(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/sponsorships/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async createSponsorship(sponsorshipData: any): Promise<{ message: string; sponsorship: any }> {
    const response = await fetch(`${API_BASE_URL}/sponsorships`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(sponsorshipData),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async updateSponsorship(id: string, sponsorshipData: any): Promise<{ message: string; sponsorship: any }> {
    const response = await fetch(`${API_BASE_URL}/sponsorships/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(sponsorshipData),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async approveSponsorship(id: string): Promise<{ message: string; sponsorship: any }> {
    const response = await fetch(`${API_BASE_URL}/sponsorships/${id}/approve`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async activateSponsorship(id: string): Promise<{ message: string; sponsorship: any }> {
    const response = await fetch(`${API_BASE_URL}/sponsorships/${id}/activate`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async deleteSponsorship(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/sponsorships/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getSponsorshipStats(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/sponsorships/stats`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();
