import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { dbUtils, initializeDatabase, hashPassword, verifyPassword } from './database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const NODE_ENV = process.env.NODE_ENV || 'development';
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser requests (curl, server-to-server).
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.length === 0) {
      if (NODE_ENV === 'production') {
        return callback(new Error('CORS origin not configured'));
      }
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Initialize database
await initializeDatabase();

// Routes

// Health check
app.get('/api/health', async (req, res) => {
  res.json({ status: 'OK', message: 'Campbuzz API is running' });
});

// Readiness check (verifies DB connectivity)
app.get('/api/ready', async (req, res) => {
  try {
    await dbUtils.ping.get();
    res.json({ status: 'READY', database: 'connected' });
  } catch (error) {
    console.error('Readiness check failed:', error);
    res.status(503).json({ status: 'NOT_READY', database: 'disconnected' });
  }
});

// User authentication routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await dbUtils.getUserByEmail.get(email);

    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await dbUtils.updateUserLastLogin.run(user.id);

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        college: user.college,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, college, password } = req.body;

    if (!name || !email || !college || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await dbUtils.getUserByEmail.get(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const result = await dbUtils.createUser.run(name, email, college, 'student', passwordHash);

    res.status(201).json({ message: 'User created successfully', userId: result.lastInsertRowid });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected routes
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  const user = await dbUtils.getUserById.get(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    college: user.college,
    role: user.role,
    created_at: user.created_at,
    last_login: user.last_login,
    email_verified: user.email_verified
  });
});

// User routes
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = await dbUtils.getAllUsers.all();
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Club routes
app.get('/api/clubs', async (req, res) => {
  try {
    const clubs = await dbUtils.getAllClubs.all();
    res.json(clubs);
  } catch (error) {
    console.error('Get clubs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/clubs/:id', async (req, res) => {
  try {
    const club = await dbUtils.getClubById.get(req.params.id);
    if (!club) {
      return res.status(404).json({ error: 'Club not found' });
    }
    res.json(club);
  } catch (error) {
    console.error('Get club error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/clubs', authenticateToken, async (req, res) => {
  try {
    const { name, description, category } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Club name is required' });
    }

    const result = await dbUtils.createClub.run(name, description, category, req.user.id);

    res.status(201).json({ message: 'Club created successfully', clubId: result.lastInsertRowid });
  } catch (error) {
    console.error('Create club error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Event routes
app.get('/api/events', async (req, res) => {
  try {
    const events = await dbUtils.getAllEvents.all();
    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await dbUtils.getEventById.get(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/events', authenticateToken, async (req, res) => {
  try {
    const { title, description, club_id, event_date, location, max_attendees } = req.body;

    if (!title || !event_date) {
      return res.status(400).json({ error: 'Title and event date are required' });
    }

    const result = await dbUtils.createEvent.run(
      title,
      description,
      club_id,
      req.user.id,
      event_date,
      location,
      max_attendees,
      'pending'
    );

    res.status(201).json({ message: 'Event created successfully', eventId: result.lastInsertRowid });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User-Club relationships
app.post('/api/clubs/:id/join', authenticateToken, async (req, res) => {
  try {
    const result = await dbUtils.joinClub.run(req.user.id, req.params.id, 'member');
    if (result.changes === 0) {
      return res.status(409).json({ error: 'Already a member of this club' });
    }
    res.json({ message: 'Successfully joined the club' });
  } catch (error) {
    console.error('Join club error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/clubs/:id/leave', authenticateToken, async (req, res) => {
  try {
    const result = await dbUtils.leaveClub.run(req.user.id, req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Not a member of this club' });
    }
    res.json({ message: 'Successfully left the club' });
  } catch (error) {
    console.error('Leave club error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/users/:id/clubs', authenticateToken, async (req, res) => {
  try {
    const clubs = await dbUtils.getUserClubs.all(req.params.id);
    res.json(clubs);
  } catch (error) {
    console.error('Get user clubs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Statistics routes
app.get('/api/stats/users', authenticateToken, async (req, res) => {
  try {
    const stats = await dbUtils.getUserStats.get();
    res.json(stats);
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/stats/clubs', authenticateToken, async (req, res) => {
  try {
    const stats = await dbUtils.getClubStats.get();
    res.json(stats);
  } catch (error) {
    console.error('Get club stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/stats/events', authenticateToken, async (req, res) => {
  try {
    const stats = await dbUtils.getEventStats.get();
    res.json(stats);
  } catch (error) {
    console.error('Get event stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Chat API Routes
app.get('/api/chat/conversations', authenticateToken, async (req, res) => {
  try {
    const conversations = await dbUtils.getUserConversations.all(req.user.id);
    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/chat/conversations/:id', authenticateToken, async (req, res) => {
  try {
    const conversation = await dbUtils.getConversationById.get(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Check if user is a participant
    const participants = await dbUtils.getConversationParticipants.all(req.params.id);
    const isParticipant = participants.some(p => p.user_id === req.user.id);

    if (!isParticipant) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ ...conversation, participants });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/chat/conversations', authenticateToken, async (req, res) => {
  try {
    const { title, category, participantIds, priority = 'normal' } = req.body;

    if (!title || !category || !participantIds || !Array.isArray(participantIds)) {
      return res.status(400).json({ error: 'Title, category, and participantIds are required' });
    }

    // Create conversation
    const result = await dbUtils.createConversation.run(
      title,
      category,
      'active',
      priority,
      req.user.id,
      JSON.stringify([category]),
      JSON.stringify({ notifications: true, soundEnabled: true })
    );

    const conversationId = result.lastInsertRowid;

    // Add participants (including creator)
    const allParticipantIds = [...new Set([req.user.id, ...participantIds])];

    for (const userId of allParticipantIds) {
      const user = await dbUtils.getUserById.get(userId);
      if (user) {
        const participantType = userId === req.user.id ? 'user' : 'user';
        await dbUtils.addParticipant.run(conversationId, userId, participantType, 'member', 0);
      }
    }

    // Update conversation last activity
    await dbUtils.updateConversationLastActivity.run(conversationId);

    res.status(201).json({
      message: 'Conversation created successfully',
      conversationId,
      conversation: await dbUtils.getConversationById.get(conversationId)
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/chat/conversations/:id/messages', authenticateToken, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const messages = await dbUtils.getConversationMessages.all(req.params.id);

    // Mark messages as read
    await dbUtils.updateParticipantLastRead.run(req.params.id, req.user.id);

    // Update unread count
    const unreadCount = await dbUtils.getUnreadMessageCount.get(req.params.id, req.user.id);
    await dbUtils.updateConversationUnreadCount.run(unreadCount.unread_count, req.params.id);

    res.json(messages.slice(offset, offset + limit));
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/chat/conversations/:id/messages', authenticateToken, async (req, res) => {
  try {
    const { content, messageType = 'text', priority = 'normal', replyToId, metadata = {} } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Check if user is a participant
    const participants = await dbUtils.getConversationParticipants.all(req.params.id);
    const isParticipant = participants.some(p => p.user_id === req.user.id);

    if (!isParticipant) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Create message
    const result = await dbUtils.createMessage.run(
      req.params.id,
      req.user.id,
      content,
      messageType,
      priority,
      JSON.stringify(metadata),
      replyToId || null,
      JSON.stringify({})
    );

    const messageId = result.lastInsertRowid;

    // Update conversation last activity
    await dbUtils.updateConversationLastActivity.run(req.params.id);

    // Update unread count for other participants
    const otherParticipants = participants.filter(p => p.user_id !== req.user.id);
    for (const participant of otherParticipants) {
      const unreadCount = await dbUtils.getUnreadMessageCount.get(req.params.id, participant.user_id);
      await dbUtils.updateConversationUnreadCount.run(unreadCount.unread_count + 1, req.params.id);
    }

    // Get the created message with sender info
    const message = await dbUtils.getMessageById.get(messageId);

    res.status(201).json({
      message: 'Message sent successfully',
      message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/chat/messages/:id/reactions', authenticateToken, async (req, res) => {
  try {
    const { emoji } = req.body;

    if (!emoji) {
      return res.status(400).json({ error: 'Emoji is required' });
    }

    // Check if user has already reacted with this emoji
    const existingReaction = await dbUtils.getMessageReactions.get(req.params.id);
    const userReactions = existingReaction?.find(r => r.user_ids?.includes(req.user.id.toString()));

    if (userReactions && userReactions.emoji === emoji) {
      // Remove reaction
      await dbUtils.removeReaction.run(req.params.id, req.user.id, emoji);
      res.json({ message: 'Reaction removed' });
    } else {
      // Add reaction
      await dbUtils.addReaction.run(req.params.id, req.user.id, emoji);
      res.json({ message: 'Reaction added' });
    }
  } catch (error) {
    console.error('Reaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/chat/messages/:id/reactions', authenticateToken, async (req, res) => {
  try {
    const reactions = await dbUtils.getMessageReactions.all(req.params.id);
    res.json(reactions);
  } catch (error) {
    console.error('Get reactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/chat/conversations/:id/files', authenticateToken, async (req, res) => {
  try {
    const { fileName, fileSize, fileType, fileUrl } = req.body;

    if (!fileName || !fileUrl) {
      return res.status(400).json({ error: 'File name and URL are required' });
    }

    // Create a system message for the file
    const messageResult = await dbUtils.createMessage.run(
      req.params.id,
      req.user.id,
      `Shared file: ${fileName}`,
      'file',
      'normal',
      JSON.stringify({ fileName, fileSize, fileType }),
      null,
      JSON.stringify({})
    );

    const messageId = messageResult.lastInsertRowid;

    // Create file record
    await dbUtils.createFile.run(messageId, fileName, fileSize, fileType, fileUrl, req.user.id);

    // Update conversation last activity
    await dbUtils.updateConversationLastActivity.run(req.params.id);

    res.status(201).json({
      message: 'File uploaded successfully',
      messageId,
      fileId: messageId
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/chat/search/conversations', authenticateToken, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const conversations = await dbUtils.searchConversations.all(`%${q}%`, `%${q}%`);
    res.json(conversations);
  } catch (error) {
    console.error('Search conversations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/chat/search/messages', authenticateToken, async (req, res) => {
  try {
    const { q, conversationId } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const conversationFilter = Number(conversationId) || 0;
    const messages = await dbUtils.searchMessages.all(
      `%${q}%`,
      conversationFilter,
      conversationFilter
    );
    res.json(messages);
  } catch (error) {
    console.error('Search messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/chat/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await dbUtils.getChatStats.get();
    res.json(stats);
  } catch (error) {
    console.error('Get chat stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// AI Chat endpoint
app.post('/api/chat/ai-response', authenticateToken, async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Generate AI response based on message content
    const responses = [
      "I understand you're interested in that. Let me help you find the perfect match!",
      "That's a great question! Based on your interests, I recommend checking out these options.",
      "I'm here to help! Let me analyze your preferences and suggest the best activities for you.",
      "Excellent choice! I can see you're passionate about this area. Here are some tailored suggestions.",
      "I appreciate you sharing that with me. Let me provide you with personalized recommendations."
    ];

    const aiResponse = responses[Math.floor(Math.random() * responses.length)];

    // Create AI message in conversation
    const result = await dbUtils.createMessage.run(
      conversationId,
      req.user.id, // Using user ID for now, should be AI user ID
      aiResponse,
      'ai_suggestion',
      'normal',
      JSON.stringify({}),
      null,
      JSON.stringify({
        suggestionType: 'general_advice',
        confidence: 85 + Math.random() * 10,
        tags: ['ai_response', 'personalized']
      })
    );

    const messageId = result.lastInsertRowid;
    const messageData = await dbUtils.getMessageById.get(messageId);

    res.json({
      message: 'Message sent successfully',
      messageData
    });
  } catch (error) {
    console.error('AI response error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Budget API Routes
app.get('/api/budgets', authenticateToken, async (req, res) => {
  try {
    const budgets = await dbUtils.getAllBudgets.all();
    res.json(budgets);
  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/budgets/:id', authenticateToken, async (req, res) => {
  try {
    const budget = await dbUtils.getBudgetById.get(req.params.id);
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    res.json(budget);
  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/budgets', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      type,
      amount,
      currency = 'USD',
      status = 'pending',
      priority = 'medium',
      fiscal_year,
      fiscal_period,
      department,
      club_id,
      event_id,
      start_date,
      end_date,
      notes,
      tags = []
    } = req.body;

    if (!title || !category || !type || !amount || !fiscal_year || !fiscal_period) {
      return res.status(400).json({ error: 'Title, category, type, amount, fiscal_year, and fiscal_period are required' });
    }

    const result = await dbUtils.createBudget.run(
      title,
      description,
      category,
      type,
      amount,
      currency,
      status,
      priority,
      fiscal_year,
      fiscal_period,
      req.user.id, // allocated_by
      null, // approved_by
      req.user.id, // requested_by
      department,
      club_id,
      event_id,
      start_date,
      end_date,
      notes,
      JSON.stringify(tags)
    );

    const budgetId = result.lastInsertRowid;
    const budget = await dbUtils.getBudgetById.get(budgetId);

    res.status(201).json({
      message: 'Budget created successfully',
      budget
    });
  } catch (error) {
    console.error('Create budget error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/budgets/:id', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      type,
      amount,
      currency,
      status,
      priority,
      fiscal_year,
      fiscal_period,
      department,
      club_id,
      event_id,
      start_date,
      end_date,
      notes,
      tags
    } = req.body;

    const existingBudget = await dbUtils.getBudgetById.get(req.params.id);
    if (!existingBudget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    await dbUtils.updateBudget.run(
      title,
      description,
      category,
      type,
      amount,
      currency,
      status,
      priority,
      fiscal_year,
      fiscal_period,
      existingBudget.allocated_by,
      existingBudget.approved_by,
      existingBudget.requested_by,
      department,
      club_id,
      event_id,
      start_date,
      end_date,
      existingBudget.approved_at,
      existingBudget.spent_amount,
      existingBudget.remaining_amount,
      notes,
      JSON.stringify(tags),
      req.params.id
    );

    const updatedBudget = await dbUtils.getBudgetById.get(req.params.id);
    res.json({
      message: 'Budget updated successfully',
      budget: updatedBudget
    });
  } catch (error) {
    console.error('Update budget error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/budgets/:id/approve', authenticateToken, async (req, res) => {
  try {
    const budget = await dbUtils.getBudgetById.get(req.params.id);
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    await dbUtils.updateBudgetStatus.run('approved', req.user.id, req.params.id);

    const updatedBudget = await dbUtils.getBudgetById.get(req.params.id);
    res.json({
      message: 'Budget approved successfully',
      budget: updatedBudget
    });
  } catch (error) {
    console.error('Approve budget error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/budgets/:id', authenticateToken, async (req, res) => {
  try {
    const budget = await dbUtils.getBudgetById.get(req.params.id);
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    await dbUtils.deleteBudget.run(req.params.id);
    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Delete budget error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Budget Transactions API
app.get('/api/budgets/:id/transactions', authenticateToken, async (req, res) => {
  try {
    const transactions = await dbUtils.getBudgetTransactions.all(req.params.id);
    res.json(transactions);
  } catch (error) {
    console.error('Get budget transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/budgets/:id/transactions', authenticateToken, async (req, res) => {
  try {
    const {
      transaction_type,
      amount,
      description,
      category,
      vendor,
      invoice_number,
      receipt_url,
      transaction_date,
      notes
    } = req.body;

    if (!transaction_type || !amount || !transaction_date) {
      return res.status(400).json({ error: 'Transaction type, amount, and transaction date are required' });
    }

    const result = await dbUtils.createBudgetTransaction.run(
      req.params.id,
      transaction_type,
      amount,
      description,
      category,
      vendor,
      invoice_number,
      receipt_url,
      transaction_date,
      req.user.id, // processed_by
      null, // approved_by
      'pending',
      notes
    );

    const transactionId = result.lastInsertRowid;
    const transactions = await dbUtils.getBudgetTransactions.all(req.params.id);
    const transaction = transactions.find((t) => t.id === transactionId);

    res.status(201).json({
      message: 'Budget transaction created successfully',
      transaction
    });
  } catch (error) {
    console.error('Create budget transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sponsorship API Routes
app.get('/api/sponsorships', authenticateToken, async (req, res) => {
  try {
    const sponsorships = await dbUtils.getAllSponsorships.all();
    res.json(sponsorships);
  } catch (error) {
    console.error('Get sponsorships error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/sponsorships/:id', authenticateToken, async (req, res) => {
  try {
    const sponsorship = await dbUtils.getSponsorshipById.get(req.params.id);
    if (!sponsorship) {
      return res.status(404).json({ error: 'Sponsorship not found' });
    }
    res.json(sponsorship);
  } catch (error) {
    console.error('Get sponsorship error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/sponsorships', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      sponsor_name,
      sponsor_type,
      contact_person,
      contact_email,
      contact_phone,
      website,
      address,
      category,
      sponsorship_type,
      amount,
      currency = 'USD',
      status = 'prospecting',
      priority = 'medium',
      fiscal_year,
      start_date,
      end_date,
      duration_months,
      renewal_status = 'not_applicable',
      benefits = [],
      deliverables = [],
      contract_url,
      assigned_to,
      notes,
      tags = []
    } = req.body;

    if (!title || !sponsor_name || !sponsor_type || !category || !sponsorship_type || !fiscal_year) {
      return res.status(400).json({ error: 'Title, sponsor_name, sponsor_type, category, sponsorship_type, and fiscal_year are required' });
    }

    const result = await dbUtils.createSponsorship.run(
      title,
      description,
      sponsor_name,
      sponsor_type,
      contact_person,
      contact_email,
      contact_phone,
      website,
      address,
      category,
      sponsorship_type,
      amount,
      currency,
      status,
      priority,
      fiscal_year,
      start_date,
      end_date,
      duration_months,
      renewal_status,
      JSON.stringify(benefits),
      JSON.stringify(deliverables),
      contract_url,
      assigned_to,
      req.user.id, // created_by
      notes,
      JSON.stringify(tags)
    );

    const sponsorshipId = result.lastInsertRowid;
    const sponsorship = await dbUtils.getSponsorshipById.get(sponsorshipId);

    res.status(201).json({
      message: 'Sponsorship created successfully',
      sponsorship
    });
  } catch (error) {
    console.error('Create sponsorship error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/sponsorships/:id', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      sponsor_name,
      sponsor_type,
      contact_person,
      contact_email,
      contact_phone,
      website,
      address,
      category,
      sponsorship_type,
      amount,
      currency,
      status,
      priority,
      fiscal_year,
      start_date,
      end_date,
      duration_months,
      renewal_status,
      benefits,
      deliverables,
      contract_url,
      assigned_to,
      notes,
      tags
    } = req.body;

    const existingSponsorship = await dbUtils.getSponsorshipById.get(req.params.id);
    if (!existingSponsorship) {
      return res.status(404).json({ error: 'Sponsorship not found' });
    }

    await dbUtils.updateSponsorship.run(
      title,
      description,
      sponsor_name,
      sponsor_type,
      contact_person,
      contact_email,
      contact_phone,
      website,
      address,
      category,
      sponsorship_type,
      amount,
      currency,
      status,
      priority,
      fiscal_year,
      start_date,
      end_date,
      duration_months,
      renewal_status,
      JSON.stringify(benefits || []),
      JSON.stringify(deliverables || []),
      contract_url,
      assigned_to,
      existingSponsorship.approved_at,
      existingSponsorship.activated_at,
      existingSponsorship.completed_at,
      notes,
      JSON.stringify(tags || []),
      req.params.id
    );

    const updatedSponsorship = await dbUtils.getSponsorshipById.get(req.params.id);
    res.json({
      message: 'Sponsorship updated successfully',
      sponsorship: updatedSponsorship
    });
  } catch (error) {
    console.error('Update sponsorship error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/sponsorships/:id/approve', authenticateToken, async (req, res) => {
  try {
    const sponsorship = await dbUtils.getSponsorshipById.get(req.params.id);
    if (!sponsorship) {
      return res.status(404).json({ error: 'Sponsorship not found' });
    }

    await dbUtils.updateSponsorshipStatus.run('approved', null, null, req.params.id);

    const updatedSponsorship = await dbUtils.getSponsorshipById.get(req.params.id);
    res.json({
      message: 'Sponsorship approved successfully',
      sponsorship: updatedSponsorship
    });
  } catch (error) {
    console.error('Approve sponsorship error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/sponsorships/:id/activate', authenticateToken, async (req, res) => {
  try {
    const sponsorship = await dbUtils.getSponsorshipById.get(req.params.id);
    if (!sponsorship) {
      return res.status(404).json({ error: 'Sponsorship not found' });
    }

    await dbUtils.updateSponsorshipStatus.run('active', 'active', 'completed', req.params.id);

    const updatedSponsorship = await dbUtils.getSponsorshipById.get(req.params.id);
    res.json({
      message: 'Sponsorship activated successfully',
      sponsorship: updatedSponsorship
    });
  } catch (error) {
    console.error('Activate sponsorship error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/sponsorships/:id', authenticateToken, async (req, res) => {
  try {
    const sponsorship = await dbUtils.getSponsorshipById.get(req.params.id);
    if (!sponsorship) {
      return res.status(404).json({ error: 'Sponsorship not found' });
    }

    await dbUtils.deleteSponsorship.run(req.params.id);
    res.json({ message: 'Sponsorship deleted successfully' });
  } catch (error) {
    console.error('Delete sponsorship error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Budget and Sponsorship Statistics
app.get('/api/budgets/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await dbUtils.getBudgetStats.get();
    res.json(stats);
  } catch (error) {
    console.error('Get budget stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/sponsorships/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await dbUtils.getSponsorshipStats.get();
    res.json(stats);
  } catch (error) {
    console.error('Get sponsorship stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Campus Club Suite API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Chat API: http://localhost:${PORT}/api/chat/conversations`);
  console.log(`Budget API: http://localhost:${PORT}/api/budgets`);
  console.log(`Sponsorship API: http://localhost:${PORT}/api/sponsorships`);
});
