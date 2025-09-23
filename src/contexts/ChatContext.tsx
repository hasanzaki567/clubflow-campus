import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import type {
  ChatConversation,
  ChatMessage,
  ChatParticipant,
  ChatContextType,
  ChatSettings,
  QuickAction,
  QUICK_ACTIONS,
  ChatMessageType
} from '@/types/chat';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Default chat settings
const defaultSettings: ChatSettings = {
  theme: 'auto',
  soundEnabled: true,
  notifications: true,
  autoTranslate: false,
  language: 'en',
  messagePreview: true,
  typingIndicators: true,
  readReceipts: true,
  fileUploadSize: 10,
  maxImageSize: 5,
  allowedFileTypes: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'gif']
};

// Sample participants
const sampleParticipants: ChatParticipant[] = [
  {
    id: 'admin_1',
    name: 'Dr. Sarah Johnson',
    avatar: '👩‍💼',
    type: 'system_admin',
    role: 'Campus Director',
    isOnline: true,
    department: 'Administration',
    contactInfo: {
      email: 'sarah.johnson@university.edu',
      phone: '+1-555-0123',
      office: 'Admin Building, Room 101'
    }
  },
  {
    id: 'event_manager_1',
    name: 'Mike Chen',
    avatar: '🎯',
    type: 'event_manager',
    role: 'Event Coordinator',
    isOnline: true,
    department: 'Student Activities',
    contactInfo: {
      email: 'mike.chen@university.edu',
      phone: '+1-555-0456',
      office: 'Student Center, Room 205'
    }
  },
  {
    id: 'club_admin_1',
    name: 'Emily Rodriguez',
    avatar: '🎨',
    type: 'club_admin',
    role: 'Art Club President',
    isOnline: false,
    lastSeen: '2024-01-12T14:30:00Z',
    department: 'Arts & Culture'
  },
  {
    id: 'ai_assistant',
    name: 'Campus AI Assistant',
    avatar: '🤖',
    type: 'ai_assistant',
    role: 'AI Support',
    isOnline: true,
    department: 'Artificial Intelligence'
  }
];

// Sample conversations
const sampleConversations: ChatConversation[] = [
  {
    id: 'conv_1',
    title: 'Event Registration Support',
    participants: [sampleParticipants[1]], // Event Manager
    lastMessage: {
      id: 'msg_1',
      conversationId: 'conv_1',
      senderId: 'event_manager_1',
      sender: sampleParticipants[1],
      content: 'Your registration for the AI Workshop has been confirmed!',
      type: 'text',
      timestamp: '2024-01-12T15:30:00Z',
      isRead: false,
      priority: 'normal'
    },
    lastActivity: '2024-01-12T15:30:00Z',
    status: 'active',
    unreadCount: 1,
    priority: 'normal',
    category: 'event_support',
    tags: ['registration', 'workshop', 'confirmation'],
    settings: {
      notifications: true,
      soundEnabled: true,
      autoTranslate: false,
      language: 'en'
    },
    createdAt: '2024-01-12T14:00:00Z',
    updatedAt: '2024-01-12T15:30:00Z'
  },
  {
    id: 'conv_2',
    title: 'AI Assistant - Campus Guide',
    participants: [sampleParticipants[3]], // AI Assistant
    lastMessage: {
      id: 'msg_2',
      conversationId: 'conv_2',
      senderId: 'ai_assistant',
      sender: sampleParticipants[3],
      content: 'I can help you find the perfect clubs and events based on your interests. What are you passionate about?',
      type: 'ai_suggestion',
      timestamp: '2024-01-12T16:00:00Z',
      isRead: true,
      priority: 'normal',
      aiContext: {
        suggestionType: 'general_advice',
        confidence: 95,
        tags: ['personalization', 'recommendations'],
        relatedItems: ['rec_1', 'rec_2']
      }
    },
    lastActivity: '2024-01-12T16:00:00Z',
    status: 'active',
    unreadCount: 0,
    priority: 'normal',
    category: 'ai_assistance',
    tags: ['ai', 'suggestions', 'guidance'],
    settings: {
      notifications: true,
      soundEnabled: true,
      autoTranslate: false,
      language: 'en'
    },
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-12T16:00:00Z'
  },
  {
    id: 'conv_3',
    title: 'Art Club Information',
    participants: [sampleParticipants[2]], // Club Admin
    lastMessage: {
      id: 'msg_3',
      conversationId: 'conv_3',
      senderId: 'club_admin_1',
      sender: sampleParticipants[2],
      content: 'Welcome to the Art Club! Our next meeting is scheduled for Friday at 3 PM in the Art Studio.',
      type: 'text',
      timestamp: '2024-01-12T12:15:00Z',
      isRead: true,
      priority: 'normal'
    },
    lastActivity: '2024-01-12T12:15:00Z',
    status: 'active',
    unreadCount: 0,
    priority: 'normal',
    category: 'club_inquiry',
    tags: ['art', 'club', 'meeting'],
    settings: {
      notifications: true,
      soundEnabled: true,
      autoTranslate: false,
      language: 'en'
    },
    createdAt: '2024-01-11T09:00:00Z',
    updatedAt: '2024-01-12T12:15:00Z'
  }
];

// Sample messages for conversations
const sampleMessages: ChatMessage[] = [
  {
    id: 'msg_1',
    conversationId: 'conv_1',
    senderId: 'event_manager_1',
    sender: sampleParticipants[1],
    content: 'Your registration for the AI Workshop has been confirmed!',
    type: 'text',
    timestamp: '2024-01-12T15:30:00Z',
    isRead: false,
    priority: 'normal'
  },
  {
    id: 'msg_2',
    conversationId: 'conv_2',
    senderId: 'ai_assistant',
    sender: sampleParticipants[3],
    content: 'I can help you find the perfect clubs and events based on your interests. What are you passionate about?',
    type: 'ai_suggestion',
    timestamp: '2024-01-12T16:00:00Z',
    isRead: true,
    priority: 'normal',
    aiContext: {
      suggestionType: 'general_advice',
      confidence: 95,
      tags: ['personalization', 'recommendations'],
      relatedItems: ['rec_1', 'rec_2']
    }
  },
  {
    id: 'msg_3',
    conversationId: 'conv_3',
    senderId: 'club_admin_1',
    sender: sampleParticipants[2],
    content: 'Welcome to the Art Club! Our next meeting is scheduled for Friday at 3 PM in the Art Studio.',
    type: 'text',
    timestamp: '2024-01-12T12:15:00Z',
    isRead: true,
    priority: 'normal'
  }
];

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadTotal, setUnreadTotal] = useState(0);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Calculate unread total
  useEffect(() => {
    const total = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
    setUnreadTotal(total);
  }, [conversations]);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      // Check if user is authenticated first
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No authentication token found, skipping conversation load');
        setError(null);
        return;
      }

      const response = await apiClient.getChatConversations();
      setConversations(response as unknown as ChatConversation[] || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load conversations:', err);
      // Don't set error for authentication issues
      if (err instanceof Error && err.message.includes('401')) {
        console.log('Authentication required for chat features');
        setError(null);
      } else {
        setError('Failed to load conversations');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createConversation = useCallback(async (
    participants: ChatParticipant[],
    category: ChatConversation['category'],
    title?: string
  ): Promise<ChatConversation> => {
    setIsLoading(true);
    setError(null);

    try {
      const participantIds = participants.map(p => p.id);
      const response = await apiClient.createChatConversation({
        title: title || `${participants[0].name} - ${category.replace('_', ' ').toUpperCase()}`,
        category,
        participantIds,
        priority: 'normal'
      });

      const newConversation = response.data.conversation;
      setConversations(prev => [newConversation, ...prev]);
      setActiveConversation(newConversation);

      return newConversation;
    } catch (err) {
      setError('Failed to create conversation');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (
    conversationId: string,
    content: string,
    type: ChatMessageType = 'text',
    metadata?: any
  ): Promise<ChatMessage> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.sendChatMessage(conversationId, {
        content,
        messageType: type,
        priority: 'normal',
        metadata: metadata || {},
        replyToId: metadata?.replyTo
      });

      const newMessage = response.data.message;

      // Update messages state
      setMessages(prev => [...prev, newMessage]);

      // Update conversation's last message and activity
      setConversations(prev => prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: newMessage,
            lastActivity: newMessage.timestamp,
            updatedAt: newMessage.timestamp
          };
        }
        return conv;
      }));

      // If this is an AI conversation, get AI response
      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation?.category === 'ai_assistance') {
        try {
          const aiResponse = await apiClient.getAIChatResponse(content, conversationId);
          if (aiResponse.data.response) {
            setMessages(prev => [...prev, aiResponse.data.response]);
            setConversations(prev => prev.map(conv => {
              if (conv.id === conversationId) {
                return {
                  ...conv,
                  lastMessage: aiResponse.data.response,
                  lastActivity: aiResponse.data.response.timestamp,
                  updatedAt: aiResponse.data.response.timestamp
                };
              }
              return conv;
            }));
          }
        } catch (aiError) {
          console.error('Failed to get AI response:', aiError);
        }
      }

      return newMessage;
    } catch (err) {
      setError('Failed to send message');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [conversations]);

  const markAsRead = useCallback(async (conversationId: string, messageId?: string) => {
    try {
      if (messageId) {
        // Mark specific message as read
        await apiClient.markMessageAsRead(messageId);
        setMessages(prev => prev.map(msg => {
          if (msg.id === messageId) {
            return { ...msg, isRead: true };
          }
          return msg;
        }));
      } else {
        // Mark all messages in conversation as read
        await apiClient.markConversationAsRead(conversationId);
        setConversations(prev => prev.map(conv => {
          if (conv.id === conversationId) {
            return { ...conv, unreadCount: 0 };
          }
          return conv;
        }));
      }
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  }, []);

  const archiveConversation = useCallback(async (conversationId: string) => {
    try {
      await apiClient.archiveChatConversation(conversationId);
      setConversations(prev => prev.map(conv => {
        if (conv.id === conversationId) {
          return { ...conv, status: 'archived' };
        }
        return conv;
      }));
    } catch (err) {
      console.error('Failed to archive conversation:', err);
      setError('Failed to archive conversation');
    }
  }, []);

  const deleteConversation = useCallback(async (conversationId: string) => {
    try {
      await apiClient.deleteChatConversation(conversationId);
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      setMessages(prev => prev.filter(msg => msg.conversationId !== conversationId));
      if (activeConversation?.id === conversationId) {
        setActiveConversation(null);
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
      setError('Failed to delete conversation');
    }
  }, [activeConversation]);

  const updateConversationSettings = useCallback(async (conversationId: string, settings: Partial<ChatConversation['settings']>) => {
    try {
      await apiClient.updateChatConversationSettings(conversationId, settings);
      setConversations(prev => prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            settings: { ...conv.settings, ...settings }
          };
        }
        return conv;
      }));
    } catch (err) {
      console.error('Failed to update conversation settings:', err);
      setError('Failed to update conversation settings');
    }
  }, []);

  const searchConversations = useCallback(async (query: string): Promise<ChatConversation[]> => {
    try {
      const response = await apiClient.searchChatConversations(query);
      return response.data || [];
    } catch (err) {
      console.error('Failed to search conversations:', err);
      return conversations.filter(conv =>
        conv.title.toLowerCase().includes(query.toLowerCase()) ||
        conv.participants.some(p => p.name.toLowerCase().includes(query.toLowerCase())) ||
        conv.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }
  }, [conversations]);

  const searchMessages = useCallback(async (query: string, conversationId?: string): Promise<ChatMessage[]> => {
    try {
      const response = await apiClient.searchChatMessages(query, conversationId);
      return response.data || [];
    } catch (err) {
      console.error('Failed to search messages:', err);
      let filteredMessages = messages;
      if (conversationId) {
        filteredMessages = filteredMessages.filter(msg => msg.conversationId === conversationId);
      }
      return filteredMessages.filter(msg =>
        msg.content.toLowerCase().includes(query.toLowerCase()) ||
        msg.sender.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  }, [messages]);

  const getAIResponse = useCallback(async (query: string, context?: string): Promise<string> => {
    setIsLoading(true);

    try {
      const response = await apiClient.getAIChatResponse(query, context ? activeConversation?.id : undefined);
      return response.data.response?.content || 'I understand your query. Let me help you with that!';
    } catch (err) {
      console.error('Failed to get AI response:', err);
      setError('Failed to get AI response');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [activeConversation]);

  const uploadFile = useCallback(async (file: File, conversationId: string): Promise<string> => {
    setIsLoading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversationId', conversationId);

      const response = await apiClient.uploadChatFile(conversationId, formData);
      return response.data.fileUrl;
    } catch (err) {
      console.error('Failed to upload file:', err);
      setError('Failed to upload file');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reactToMessage = useCallback(async (messageId: string, emoji: string) => {
    try {
      await apiClient.reactToChatMessage(messageId, emoji);
      // Update local state
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions?.find(r => r.emoji === emoji);
          if (existingReaction) {
            return {
              ...msg,
              reactions: msg.reactions?.map(r =>
                r.emoji === emoji
                  ? { ...r, count: r.count + 1, users: [...r.users, 'current_user'] }
                  : r
              )
            };
          } else {
            return {
              ...msg,
              reactions: [...(msg.reactions || []), {
                emoji,
                count: 1,
                users: ['current_user']
              }]
            };
          }
        }
        return msg;
      }));
    } catch (err) {
      console.error('Failed to react to message:', err);
      setError('Failed to react to message');
    }
  }, []);

  const replyToMessage = useCallback(async (messageId: string, content: string): Promise<ChatMessage> => {
    const originalMessage = messages.find(m => m.id === messageId);
    if (!originalMessage) throw new Error('Original message not found');

    const conversation = conversations.find(c => c.id === originalMessage.conversationId);
    if (!conversation) throw new Error('Conversation not found');

    const replyMessage = await sendMessage(
      originalMessage.conversationId,
      content,
      'text',
      { replyTo: messageId }
    );

    return replyMessage;
  }, [messages, conversations, sendMessage]);

  const getConversationStats = useCallback(async () => {
    try {
      const response = await apiClient.getChatStats();
      return response.data;
    } catch (err) {
      console.error('Failed to get conversation stats:', err);
      // Fallback to local calculation
      const totalConversations = conversations.length;
      const activeConversations = conversations.filter(c => c.status === 'active').length;
      const unreadMessages = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
      const averageResponseTime = 2.5; // hours (simulated)

      const categoryCount: Record<string, number> = {};
      conversations.forEach(conv => {
        categoryCount[conv.category] = (categoryCount[conv.category] || 0) + 1;
      });

      const topCategories = Object.entries(categoryCount)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        totalConversations,
        activeConversations,
        unreadMessages,
        averageResponseTime,
        topCategories
      };
    }
  }, [conversations]);

  const value: ChatContextType = {
    conversations,
    activeConversation,
    messages,
    isLoading,
    error,
    unreadTotal,
    createConversation,
    sendMessage,
    markAsRead,
    archiveConversation,
    deleteConversation,
    updateConversationSettings,
    searchConversations,
    searchMessages,
    getAIResponse,
    uploadFile,
    reactToMessage,
    replyToMessage,
    getConversationStats
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
