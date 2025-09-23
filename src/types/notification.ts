// Notification types and interfaces
export type NotificationType =
  | 'achievement'
  | 'event'
  | 'message'
  | 'reminder'
  | 'system'
  | 'social';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  read: boolean;
  createdAt: string;
  expiresAt?: string;
  actionUrl?: string;
  metadata?: {
    achievementId?: string;
    eventId?: string;
    senderId?: string;
    points?: number;
    icon?: string;
  };
}

export interface NotificationSettings {
  enableSound: boolean;
  enableDesktop: boolean;
  enableEmail: boolean;
  types: {
    achievement: boolean;
    event: boolean;
    message: boolean;
    reminder: boolean;
    system: boolean;
    social: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string;   // HH:MM format
  };
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  settings: NotificationSettings;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
}
