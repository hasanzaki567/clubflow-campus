import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  Notification,
  NotificationSettings,
  NotificationContextType,
  NotificationType,
  NotificationPriority
} from '@/types/notification';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const defaultSettings: NotificationSettings = {
  enableSound: true,
  enableDesktop: true,
  enableEmail: false,
  types: {
    achievement: true,
    event: true,
    message: true,
    reminder: true,
    system: true,
    social: true,
  },
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
  },
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
      } catch (error) {
        console.error('Failed to parse notification settings:', error);
      }
    }

    // Load notifications from localStorage (in a real app, this would come from API)
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error('Failed to parse notifications:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  }, [settings]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const addNotification = useCallback((
    notificationData: Omit<Notification, 'id' | 'createdAt' | 'read'>
  ) => {
    const now = new Date().toISOString();
    const newNotification: Notification = {
      ...notificationData,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Play notification sound if enabled
    if (settings.enableSound) {
      playNotificationSound(newNotification.priority);
    }

    // Show desktop notification if enabled
    if (settings.enableDesktop && settings.types[newNotification.type]) {
      showDesktopNotification(newNotification);
    }
  }, [settings]);

  // Helper function to play notification sound
  const playNotificationSound = (priority: NotificationPriority) => {
    try {
      // Create audio context for different priority sounds
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Different frequencies for different priorities
      const frequencies = {
        low: 400,
        medium: 600,
        high: 800,
        urgent: 1000,
      };

      oscillator.frequency.setValueAtTime(frequencies[priority], audioContext.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('Failed to play notification sound:', error);
    }
  };

  // Helper function to show desktop notification
  const showDesktopNotification = (notification: Notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const desktopNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id,
      });

      desktopNotification.onclick = () => {
        if (notification.actionUrl) {
          window.location.href = notification.actionUrl;
        }
        desktopNotification.close();
      };

      // Auto-close after 5 seconds
      setTimeout(() => {
        desktopNotification.close();
      }, 5000);
    }
  };

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    settings,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    updateSettings,
    addNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Helper functions for creating specific notification types
export const createAchievementNotification = (
  title: string,
  achievementId: string,
  points: number,
  icon?: string
) => ({
  type: 'achievement' as NotificationType,
  title,
  message: `Congratulations! You've earned ${points} XP for this achievement!`,
  priority: 'high' as NotificationPriority,
  metadata: {
    achievementId,
    points,
    icon,
  },
});

export const createEventNotification = (
  title: string,
  message: string,
  eventId: string,
  priority: NotificationPriority = 'medium'
) => ({
  type: 'event' as NotificationType,
  title,
  message,
  priority,
  metadata: {
    eventId,
  },
});

export const createReminderNotification = (
  title: string,
  message: string,
  priority: NotificationPriority = 'medium'
) => ({
  type: 'reminder' as NotificationType,
  title,
  message,
  priority,
});
