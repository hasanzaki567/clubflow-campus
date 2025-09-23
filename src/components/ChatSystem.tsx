import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  MessageCircle,
  Send,
  Plus,
  Search,
  MoreVertical,
  Phone,
  Video,
  Info,
  Users,
  Settings,
  Archive,
  Trash2,
  Pin,
  Smile,
  Paperclip,
  Image,
  FileText,
  X,
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  Lightbulb,
  Brain,
  UserCheck,
  Calendar,
  Trophy,
  HelpCircle,
  Star,
  Heart,
  ThumbsUp,
  Zap,
  Target,
  Sparkles,
  Bot,
  User,
  Shield,
  Bell,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Download,
  Upload,
  Reply,
  Forward,
  Copy,
  Flag,
  Bookmark,
  BookmarkCheck,
  Share2,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  PhoneOff,
  VideoOff,
  Minimize2,
  Maximize2,
  RefreshCw,
  Filter,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  Hash,
  AtSign,
  Link,
  Code,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Quote,
  ListOrdered,
  CheckSquare,
  Square,
  Minus,
  Plus as PlusIcon,
  ArrowLeft,
  ArrowRight,
  Home,
  Building,
  GraduationCap,
  Briefcase,
  Palette,
  Music,
  Gamepad2,
  Coffee,
  Dumbbell,
  BookOpen,
  Globe,
  Wifi,
  Server,
  Database,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info as InfoIcon
} from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import type { ChatConversation, ChatMessage, ChatParticipant, QuickAction } from '@/types/chat';
import { QUICK_ACTIONS } from '@/types/chat';

interface ChatSystemProps {
  className?: string;
  compact?: boolean;
  showHeader?: boolean;
  defaultOpen?: boolean;
}

const ChatSystem: React.FC<ChatSystemProps> = ({
  className = '',
  compact = false,
  showHeader = true,
  defaultOpen = true
}) => {
  const {
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
    searchConversations,
    searchMessages,
    getAIResponse,
    uploadFile,
    reactToMessage,
    replyToMessage,
    getConversationStats
  } = useChat();

  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(activeConversation);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [filteredConversations, setFilteredConversations] = useState(conversations);
  const [filteredMessages, setFilteredMessages] = useState<ChatMessage[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedConversation]);

  // Filter conversations based on search
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = searchConversations(searchQuery);
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchQuery, conversations, searchConversations]);

  // Filter messages for selected conversation
  useEffect(() => {
    if (selectedConversation) {
      const conversationMessages = messages.filter(m => m.conversationId === selectedConversation.id);
      setFilteredMessages(conversationMessages);
    } else {
      setFilteredMessages([]);
    }
  }, [selectedConversation, messages]);

  const handleConversationSelect = (conversation: ChatConversation) => {
    setSelectedConversation(conversation);
    markAsRead(conversation.id);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await sendMessage(selectedConversation.id, newMessage.trim());
      setNewMessage('');
      setIsTyping(false);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedConversation) return;

    try {
      const fileUrl = await uploadFile(file, selectedConversation.id);
      await sendMessage(selectedConversation.id, `Shared a file: ${file.name}`, 'file', {
        fileName: file.name,
        fileSize: file.size,
        fileUrl
      });
    } catch (error) {
      console.error('Failed to upload file:', error);
    }
  };

  const handleQuickAction = async (action: QuickAction) => {
    action.action();
    setShowQuickActions(false);

    // For AI suggestions, create a conversation with AI assistant
    if (action.category === 'ai') {
      const aiParticipant: ChatParticipant = {
        id: 'ai_assistant',
        name: 'Campus AI Assistant',
        avatar: '🤖',
        type: 'ai_assistant',
        role: 'AI Support',
        isOnline: true,
        department: 'Artificial Intelligence'
      };

      try {
        const conversation = await createConversation([aiParticipant], 'ai_assistance', 'AI Assistant');
        setSelectedConversation(conversation);
        await sendMessage(conversation.id, `I need help with: ${action.label}`);
      } catch (error) {
        console.error('Failed to create AI conversation:', error);
      }
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    reactToMessage(messageId, emoji);
  };

  const handleReply = async (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (!message || !selectedConversation) return;

    try {
      await replyToMessage(messageId, newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to reply:', error);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'ai_suggestion': return <Brain className="h-3 w-3 text-purple-500" />;
      case 'system': return <InfoIcon className="h-3 w-3 text-blue-500" />;
      case 'file': return <FileText className="h-3 w-3 text-gray-500" />;
      case 'image': return <Image className="h-3 w-3 text-green-500" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'normal': return 'border-gray-200 bg-white';
      case 'low': return 'border-gray-300 bg-gray-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'event_support': return <Calendar className="h-4 w-4" />;
      case 'club_inquiry': return <Users className="h-4 w-4" />;
      case 'ai_assistance': return <Brain className="h-4 w-4" />;
      case 'management': return <UserCheck className="h-4 w-4" />;
      case 'general_inquiry': return <HelpCircle className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'event_support': return 'bg-blue-100 text-blue-700';
      case 'club_inquiry': return 'bg-green-100 text-green-700';
      case 'ai_assistance': return 'bg-purple-100 text-purple-700';
      case 'management': return 'bg-orange-100 text-orange-700';
      case 'general_inquiry': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (error) {
    return (
      <Card className={`border-red-200 bg-red-50 ${className}`}>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-700 mb-2">Chat Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
            Refresh Chat
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`h-full ${className}`}>
      <Card className="h-full shadow-2xl border-2 border-indigo-200/50 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 backdrop-blur-xl">
        <CardHeader className="p-4 pb-2 bg-gradient-to-r from-slate-800/50 to-indigo-800/50 backdrop-blur-sm border-b border-indigo-200/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-white font-bold">Campus Chat</CardTitle>
                <CardDescription className="text-sm text-indigo-200">
                  {selectedConversation ? selectedConversation.title : 'Select a conversation'}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="p-2 text-indigo-200 hover:text-white hover:bg-indigo-500/20"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Actions Panel */}
          {showQuickActions && (
            <div className="mt-3 p-3 bg-gradient-to-br from-slate-800/80 to-indigo-800/80 backdrop-blur-sm rounded-lg border border-indigo-200/30">
              <div className="text-sm font-medium text-indigo-100 mb-2">Quick Actions</div>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_ACTIONS.slice(0, 4).map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action)}
                    className="text-xs h-8 border-indigo-200/30 text-indigo-100 hover:bg-indigo-500/20 hover:border-indigo-200/50"
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0 flex flex-col h-[calc(100%-80px)]">
          {!selectedConversation ? (
            /* Conversation List */
            <div className="flex-1 flex flex-col bg-gradient-to-b from-slate-800/30 to-indigo-800/30">
              {/* Search */}
              <div className="p-4 border-b border-indigo-200/20">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-indigo-300" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-indigo-200/30 text-white placeholder-indigo-300 focus:border-indigo-200/50"
                  />
                </div>
              </div>

              {/* Conversations */}
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-2">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => handleConversationSelect(conversation)}
                      className="p-3 rounded-lg hover:bg-indigo-500/20 cursor-pointer transition-all duration-300 border border-transparent hover:border-indigo-200/30 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                            {conversation.participants[0]?.avatar || conversation.participants[0]?.name[0]}
                          </div>
                          {conversation.participants[0]?.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800 animate-pulse"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate text-white">
                              {conversation.title}
                            </span>
                            <Badge className={`${getCategoryColor(conversation.category)} text-xs border-0 shadow-sm`}>
                              {getCategoryIcon(conversation.category)}
                            </Badge>
                          </div>
                          <div className="text-xs text-indigo-200 truncate">
                            {conversation.lastMessage?.content || 'No messages yet'}
                          </div>
                          <div className="text-xs text-indigo-300">
                            {formatTime(conversation.lastActivity)}
                          </div>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                            {conversation.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          ) : (
            /* Chat Interface */
            <div className="flex-1 flex flex-col bg-gradient-to-b from-slate-800/20 to-indigo-900/20">
              {/* Chat Header */}
              <div className="p-4 border-b border-indigo-200/20 bg-gradient-to-r from-slate-800/30 to-indigo-800/30 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedConversation(null)}
                      className="p-1 text-indigo-200 hover:text-white hover:bg-indigo-500/20"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {selectedConversation.participants[0]?.avatar || selectedConversation.participants[0]?.name[0]}
                      </div>
                      {selectedConversation.participants[0]?.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800 animate-pulse"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-white">
                        {selectedConversation.participants[0]?.name}
                      </div>
                      <div className="text-xs text-indigo-200">
                        {selectedConversation.participants[0]?.isOnline ? 'Online' : 'Offline'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="p-1 text-indigo-200 hover:text-white hover:bg-indigo-500/20">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-1 text-indigo-200 hover:text-white hover:bg-indigo-500/20">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-1 text-indigo-200 hover:text-white hover:bg-indigo-500/20">
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-slate-900/20 to-indigo-900/30">
                <div className="space-y-4">
                  {filteredMessages.map((message, index) => {
                    const isOwn = message.senderId === 'current_user';
                    const showAvatar = !isOwn && (index === 0 || filteredMessages[index - 1]?.senderId !== message.senderId);

                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isOwn && showAvatar && (
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                            {message.sender.avatar || message.sender.name[0]}
                          </div>
                        )}
                        {!isOwn && !showAvatar && <div className="w-8" />}

                        <div className={`max-w-[70%] ${isOwn ? 'order-first' : ''}`}>
                          <div
                            className={`p-3 rounded-lg shadow-lg ${
                              isOwn
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                                : 'bg-slate-800/80 border border-indigo-200/30 text-white backdrop-blur-sm'
                            }`}
                          >
                            {message.type === 'ai_suggestion' && (
                              <div className="flex items-center gap-2 mb-2">
                                <Brain className="h-4 w-4 text-purple-300" />
                                <span className="text-xs font-medium">AI Suggestion</span>
                                {message.aiContext?.confidence && (
                                  <Badge className="bg-purple-500/20 text-purple-200 border-purple-200/30 text-xs">
                                    {message.aiContext.confidence}% confidence
                                  </Badge>
                                )}
                              </div>
                            )}

                            <div className="text-sm whitespace-pre-wrap">
                              {message.content}
                            </div>

                            {message.metadata?.replyTo && (
                              <div className="mt-2 p-2 bg-slate-700/50 rounded text-xs border border-indigo-200/20">
                                Replying to: {messages.find(m => m.id === message.metadata.replyTo)?.content}
                              </div>
                            )}

                            <div className="flex items-center justify-between mt-2">
                              <div className="text-xs opacity-70">
                                {formatMessageTime(message.timestamp)}
                              </div>
                              {isOwn && (
                                <div className="flex items-center gap-1">
                                  {message.isRead ? (
                                    <CheckCheck className="h-3 w-3 text-indigo-200" />
                                  ) : (
                                    <Check className="h-3 w-3 text-indigo-200" />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Reactions */}
                          {message.reactions && message.reactions.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {message.reactions.map((reaction) => (
                                <Button
                                  key={reaction.emoji}
                                  variant="outline"
                                  size="sm"
                                  className="h-6 px-2 text-xs border-indigo-200/30 text-indigo-200 hover:bg-indigo-500/20"
                                  onClick={() => handleReaction(message.id, reaction.emoji)}
                                >
                                  {reaction.emoji} {reaction.count}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                      <div className="bg-slate-800/80 p-3 rounded-lg border border-indigo-200/30 backdrop-blur-sm">
                        <div className="text-sm text-indigo-200">Typing...</div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-indigo-200/20 bg-gradient-to-r from-slate-800/50 to-indigo-800/50 backdrop-blur-sm">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Textarea
                      ref={textareaRef}
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        setIsTyping(e.target.value.length > 0);
                      }}
                      onKeyPress={handleKeyPress}
                      className="min-h-[40px] max-h-32 resize-none pr-12 bg-slate-700/50 border-indigo-200/30 text-white placeholder-indigo-300 focus:border-indigo-200/50 backdrop-blur-sm"
                      rows={1}
                    />
                    <div className="absolute right-2 bottom-2 flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="h-6 w-6 p-0 text-indigo-300 hover:text-white hover:bg-indigo-500/20"
                      >
                        <Smile className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-6 w-6 p-0 text-indigo-300 hover:text-white hover:bg-indigo-500/20"
                      >
                        <Paperclip className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isLoading}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatSystem;
