import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const DB_PATH = path.join(__dirname, '..', 'campus_club_suite.db');

// Initialize database with error handling
let db;
try {
  db = new Database(DB_PATH);
  // Enable WAL mode for better performance
  db.pragma('journal_mode = WAL');
} catch (error) {
  console.error('Failed to initialize database:', error);
  // Fallback to in-memory database for development
  db = new Database(':memory:');
}

// Create users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    college TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('student', 'club_admin', 'college_admin', 'super_admin')),
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    is_active BOOLEAN DEFAULT 1,
    email_verified BOOLEAN DEFAULT 0
  )
`);

// Create clubs table
db.exec(`
  CREATE TABLE IF NOT EXISTS clubs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    admin_id INTEGER,
    member_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1,
    FOREIGN KEY (admin_id) REFERENCES users (id)
  )
`);

// Create events table
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    club_id INTEGER,
    organizer_id INTEGER,
    event_date DATETIME NOT NULL,
    location TEXT,
    max_attendees INTEGER,
    current_attendees INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'ongoing', 'completed', 'cancelled')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (club_id) REFERENCES clubs (id),
    FOREIGN KEY (organizer_id) REFERENCES users (id)
  )
`);

// Create user_clubs junction table for many-to-many relationship
db.exec(`
  CREATE TABLE IF NOT EXISTS user_clubs (
    user_id INTEGER,
    club_id INTEGER,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    role TEXT DEFAULT 'member' CHECK(role IN ('member', 'moderator', 'admin')),
    PRIMARY KEY (user_id, club_id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (club_id) REFERENCES clubs (id)
  )
`);

// Create chat conversations table
db.exec(`
  CREATE TABLE IF NOT EXISTS chat_conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('event_support', 'club_inquiry', 'ai_assistance', 'management', 'general_inquiry')),
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'archived', 'blocked', 'pending')),
    priority TEXT DEFAULT 'normal' CHECK(priority IN ('low', 'normal', 'high', 'urgent')),
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
    unread_count INTEGER DEFAULT 0,
    tags TEXT DEFAULT '[]',
    settings TEXT DEFAULT '{}',
    FOREIGN KEY (created_by) REFERENCES users (id)
  )
`);

// Create chat participants table
db.exec(`
  CREATE TABLE IF NOT EXISTS chat_participants (
    conversation_id INTEGER,
    user_id INTEGER,
    participant_type TEXT NOT NULL CHECK(participant_type IN ('user', 'event_manager', 'club_admin', 'system_admin', 'ai_assistant')),
    role TEXT DEFAULT 'member',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_read_at DATETIME,
    is_online BOOLEAN DEFAULT 0,
    last_seen DATETIME,
    permissions TEXT DEFAULT '[]',
    PRIMARY KEY (conversation_id, user_id),
    FOREIGN KEY (conversation_id) REFERENCES chat_conversations (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
  )
`);

// Create chat messages table
db.exec(`
  CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER,
    sender_id INTEGER,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK(message_type IN ('text', 'image', 'file', 'system', 'ai_suggestion')),
    priority TEXT DEFAULT 'normal' CHECK(priority IN ('low', 'normal', 'high', 'urgent')),
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    metadata TEXT DEFAULT '{}',
    reply_to_id INTEGER,
    ai_context TEXT DEFAULT '{}',
    FOREIGN KEY (conversation_id) REFERENCES chat_conversations (id),
    FOREIGN KEY (sender_id) REFERENCES users (id),
    FOREIGN KEY (reply_to_id) REFERENCES chat_messages (id)
  )
`);

// Create chat reactions table
db.exec(`
  CREATE TABLE IF NOT EXISTS chat_reactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id INTEGER,
    user_id INTEGER,
    emoji TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES chat_messages (id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    UNIQUE(message_id, user_id, emoji)
  )
`);

// Create chat files table
db.exec(`
  CREATE TABLE IF NOT EXISTS chat_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id INTEGER,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    file_type TEXT,
    file_url TEXT NOT NULL,
    uploaded_by INTEGER,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES chat_messages (id),
    FOREIGN KEY (uploaded_by) REFERENCES users (id)
  )
`);

// Create budgets table
db.exec(`
  CREATE TABLE IF NOT EXISTS budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK(category IN ('events', 'clubs', 'infrastructure', 'academic', 'sports', 'cultural', 'other')),
    type TEXT NOT NULL CHECK(type IN ('allocated', 'requested', 'approved', 'spent', 'projected')),
    amount DECIMAL(12,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected', 'in_progress', 'completed', 'cancelled')),
    priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high', 'critical')),
    fiscal_year TEXT NOT NULL,
    fiscal_period TEXT NOT NULL,
    allocated_by INTEGER,
    approved_by INTEGER,
    requested_by INTEGER,
    department TEXT,
    club_id INTEGER,
    event_id INTEGER,
    start_date DATE,
    end_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    approved_at DATETIME,
    spent_amount DECIMAL(12,2) DEFAULT 0,
    remaining_amount DECIMAL(12,2) DEFAULT 0,
    notes TEXT,
    tags TEXT DEFAULT '[]',
    attachments TEXT DEFAULT '[]',
    FOREIGN KEY (allocated_by) REFERENCES users (id),
    FOREIGN KEY (approved_by) REFERENCES users (id),
    FOREIGN KEY (requested_by) REFERENCES users (id),
    FOREIGN KEY (club_id) REFERENCES clubs (id),
    FOREIGN KEY (event_id) REFERENCES events (id)
  )
`);

// Create budget_transactions table
db.exec(`
  CREATE TABLE IF NOT EXISTS budget_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    budget_id INTEGER,
    transaction_type TEXT NOT NULL CHECK(transaction_type IN ('allocation', 'expense', 'transfer', 'refund', 'adjustment')),
    amount DECIMAL(12,2) NOT NULL,
    description TEXT,
    category TEXT,
    vendor TEXT,
    invoice_number TEXT,
    receipt_url TEXT,
    transaction_date DATE NOT NULL,
    processed_by INTEGER,
    approved_by INTEGER,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected', 'processed')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    processed_at DATETIME,
    approved_at DATETIME,
    notes TEXT,
    FOREIGN KEY (budget_id) REFERENCES budgets (id),
    FOREIGN KEY (processed_by) REFERENCES users (id),
    FOREIGN KEY (approved_by) REFERENCES users (id)
  )
`);

// Create sponsorships table
db.exec(`
  CREATE TABLE IF NOT EXISTS sponsorships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    sponsor_name TEXT NOT NULL,
    sponsor_type TEXT NOT NULL CHECK(sponsor_type IN ('corporate', 'individual', 'alumni', 'government', 'foundation', 'other')),
    contact_person TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    website TEXT,
    address TEXT,
    category TEXT NOT NULL CHECK(category IN ('events', 'clubs', 'infrastructure', 'academic', 'sports', 'cultural', 'scholarships', 'other')),
    sponsorship_type TEXT NOT NULL CHECK(sponsorship_type IN ('monetary', 'in_kind', 'services', 'venue', 'equipment', 'other')),
    amount DECIMAL(12,2),
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'prospecting' CHECK(status IN ('prospecting', 'proposal_sent', 'negotiating', 'approved', 'active', 'completed', 'cancelled')),
    priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high', 'critical')),
    fiscal_year TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    duration_months INTEGER,
    renewal_status TEXT CHECK(renewal_status IN ('not_applicable', 'upcoming', 'renewed', 'expired')),
    benefits TEXT DEFAULT '[]',
    deliverables TEXT DEFAULT '[]',
    contract_url TEXT,
    assigned_to INTEGER,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    approved_at DATETIME,
    activated_at DATETIME,
    completed_at DATETIME,
    notes TEXT,
    tags TEXT DEFAULT '[]',
    FOREIGN KEY (assigned_to) REFERENCES users (id),
    FOREIGN KEY (created_by) REFERENCES users (id)
  )
`);

// Create sponsorship_benefits table
db.exec(`
  CREATE TABLE IF NOT EXISTS sponsorship_benefits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sponsorship_id INTEGER,
    benefit_type TEXT NOT NULL CHECK(benefit_type IN ('branding', 'naming_rights', 'advertising', 'product_placement', 'hospitality', 'networking', 'other')),
    description TEXT,
    value DECIMAL(12,2),
    currency TEXT DEFAULT 'USD',
    is_delivered BOOLEAN DEFAULT 0,
    delivery_date DATE,
    notes TEXT,
    FOREIGN KEY (sponsorship_id) REFERENCES sponsorships (id)
  )
`);

// Create sponsorship_deliverables table
db.exec(`
  CREATE TABLE IF NOT EXISTS sponsorship_deliverables (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sponsorship_id INTEGER,
    deliverable_type TEXT NOT NULL CHECK(deliverable_type IN ('logo_placement', 'banner_ads', 'social_media', 'email_blast', 'event_tickets', 'naming_rights', 'other')),
    description TEXT,
    due_date DATE,
    is_completed BOOLEAN DEFAULT 0,
    completed_date DATE,
    completion_notes TEXT,
    FOREIGN KEY (sponsorship_id) REFERENCES sponsorships (id)
  )
`);

// Create indexes for better performance
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
  CREATE INDEX IF NOT EXISTS idx_clubs_admin ON clubs(admin_id);
  CREATE INDEX IF NOT EXISTS idx_events_club ON events(club_id);
  CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
  CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
`);

// Database utility functions
export const dbUtils = {
  // User operations
  createUser: db.prepare(`
    INSERT INTO users (name, email, college, role, password_hash)
    VALUES (?, ?, ?, ?, ?)
  `),

  getUserByEmail: db.prepare(`
    SELECT * FROM users WHERE email = ? AND is_active = 1
  `),

  getUserById: db.prepare(`
    SELECT id, name, email, college, role, created_at, last_login, email_verified
    FROM users WHERE id = ? AND is_active = 1
  `),

  updateUserLastLogin: db.prepare(`
    UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?
  `),

  getAllUsers: db.prepare(`
    SELECT id, name, email, college, role, created_at, last_login, is_active
    FROM users ORDER BY created_at DESC
  `),

  // Club operations
  createClub: db.prepare(`
    INSERT INTO clubs (name, description, category, admin_id)
    VALUES (?, ?, ?, ?)
  `),

  getAllClubs: db.prepare(`
    SELECT c.*, u.name as admin_name
    FROM clubs c
    LEFT JOIN users u ON c.admin_id = u.id
    WHERE c.is_active = 1
    ORDER BY c.created_at DESC
  `),

  getClubById: db.prepare(`
    SELECT c.*, u.name as admin_name
    FROM clubs c
    LEFT JOIN users u ON c.admin_id = u.id
    WHERE c.id = ? AND c.is_active = 1
  `),

  // Event operations
  createEvent: db.prepare(`
    INSERT INTO events (title, description, club_id, organizer_id, event_date, location, max_attendees, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),

  getAllEvents: db.prepare(`
    SELECT e.*, c.name as club_name, u.name as organizer_name
    FROM events e
    LEFT JOIN clubs c ON e.club_id = c.id
    LEFT JOIN users u ON e.organizer_id = u.id
    ORDER BY e.event_date DESC
  `),

  getEventById: db.prepare(`
    SELECT e.*, c.name as club_name, u.name as organizer_name
    FROM events e
    LEFT JOIN clubs c ON e.club_id = c.id
    LEFT JOIN users u ON e.organizer_id = u.id
    WHERE e.id = ?
  `),

  // User-Club relationships
  joinClub: db.prepare(`
    INSERT OR IGNORE INTO user_clubs (user_id, club_id, role)
    VALUES (?, ?, ?)
  `),

  leaveClub: db.prepare(`
    DELETE FROM user_clubs WHERE user_id = ? AND club_id = ?
  `),

  getUserClubs: db.prepare(`
    SELECT c.*, uc.role, uc.joined_at
    FROM clubs c
    INNER JOIN user_clubs uc ON c.id = uc.club_id
    WHERE uc.user_id = ? AND c.is_active = 1
  `),

  // Statistics
  getUserStats: db.prepare(`
    SELECT
      COUNT(*) as total_users,
      COUNT(CASE WHEN created_at >= date('now', '-30 days') THEN 1 END) as new_users_30d,
      COUNT(CASE WHEN role = 'student' THEN 1 END) as students,
      COUNT(CASE WHEN role = 'club_admin' THEN 1 END) as club_admins,
      COUNT(CASE WHEN role = 'college_admin' THEN 1 END) as college_admins
    FROM users
    WHERE is_active = 1
  `),

  getClubStats: db.prepare(`
    SELECT
      COUNT(*) as total_clubs,
      COUNT(CASE WHEN created_at >= date('now', '-30 days') THEN 1 END) as new_clubs_30d,
      AVG(member_count) as avg_members_per_club,
      SUM(member_count) as total_members
    FROM clubs
    WHERE is_active = 1
  `),

  getEventStats: db.prepare(`
    SELECT
      COUNT(*) as total_events,
      COUNT(CASE WHEN event_date >= date('now') THEN 1 END) as upcoming_events,
      COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_events,
      COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_events
    FROM events
  `),

  // Chat operations
  createConversation: db.prepare(`
    INSERT INTO chat_conversations (title, category, status, priority, created_by, tags, settings)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `),

  getConversationById: db.prepare(`
    SELECT * FROM chat_conversations WHERE id = ?
  `),

  getUserConversations: db.prepare(`
    SELECT DISTINCT c.*, cp.participant_type, cp.role as user_role, cp.last_read_at
    FROM chat_conversations c
    INNER JOIN chat_participants cp ON c.id = cp.conversation_id
    WHERE cp.user_id = ?
    ORDER BY c.last_activity DESC
  `),

  getAllConversations: db.prepare(`
    SELECT c.*, u.name as created_by_name
    FROM chat_conversations c
    LEFT JOIN users u ON c.created_by = u.id
    ORDER BY c.last_activity DESC
  `),

  updateConversationLastActivity: db.prepare(`
    UPDATE chat_conversations
    SET last_activity = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),

  updateConversationUnreadCount: db.prepare(`
    UPDATE chat_conversations
    SET unread_count = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),

  addParticipant: db.prepare(`
    INSERT OR IGNORE INTO chat_participants (conversation_id, user_id, participant_type, role, is_online)
    VALUES (?, ?, ?, ?, ?)
  `),

  getConversationParticipants: db.prepare(`
    SELECT cp.*, u.name, u.email, u.role as user_role
    FROM chat_participants cp
    INNER JOIN users u ON cp.user_id = u.id
    WHERE cp.conversation_id = ?
  `),

  updateParticipantLastRead: db.prepare(`
    UPDATE chat_participants
    SET last_read_at = CURRENT_TIMESTAMP
    WHERE conversation_id = ? AND user_id = ?
  `),

  updateParticipantOnlineStatus: db.prepare(`
    UPDATE chat_participants
    SET is_online = ?, last_seen = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `),

  createMessage: db.prepare(`
    INSERT INTO chat_messages (conversation_id, sender_id, content, message_type, priority, metadata, reply_to_id, ai_context)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),

  getConversationMessages: db.prepare(`
    SELECT cm.*, u.name as sender_name, u.email as sender_email
    FROM chat_messages cm
    INNER JOIN users u ON cm.sender_id = u.id
    WHERE cm.conversation_id = ?
    ORDER BY cm.created_at ASC
  `),

  getMessageById: db.prepare(`
    SELECT cm.*, u.name as sender_name, u.email as sender_email
    FROM chat_messages cm
    INNER JOIN users u ON cm.sender_id = u.id
    WHERE cm.id = ?
  `),

  markMessageAsRead: db.prepare(`
    UPDATE chat_messages SET is_read = 1 WHERE id = ?
  `),

  getUnreadMessageCount: db.prepare(`
    SELECT COUNT(*) as unread_count
    FROM chat_messages
    WHERE conversation_id = ? AND sender_id != ? AND is_read = 0
  `),

  addReaction: db.prepare(`
    INSERT OR IGNORE INTO chat_reactions (message_id, user_id, emoji)
    VALUES (?, ?, ?)
  `),

  removeReaction: db.prepare(`
    DELETE FROM chat_reactions WHERE message_id = ? AND user_id = ? AND emoji = ?
  `),

  getMessageReactions: db.prepare(`
    SELECT emoji, COUNT(*) as count, GROUP_CONCAT(user_id) as user_ids
    FROM chat_reactions
    WHERE message_id = ?
    GROUP BY emoji
  `),

  createFile: db.prepare(`
    INSERT INTO chat_files (message_id, file_name, file_size, file_type, file_url, uploaded_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `),

  getMessageFiles: db.prepare(`
    SELECT * FROM chat_files WHERE message_id = ? ORDER BY uploaded_at ASC
  `),

  // Search operations
  searchConversations: db.prepare(`
    SELECT c.*, u.name as created_by_name
    FROM chat_conversations c
    LEFT JOIN users u ON c.created_by = u.id
    WHERE c.title LIKE ? OR c.tags LIKE ?
    ORDER BY c.last_activity DESC
  `),

  searchMessages: db.prepare(`
    SELECT cm.*, u.name as sender_name, c.title as conversation_title
    FROM chat_messages cm
    INNER JOIN users u ON cm.sender_id = u.id
    INNER JOIN chat_conversations c ON cm.conversation_id = c.id
    WHERE cm.content LIKE ? AND (? = 0 OR cm.conversation_id = ?)
    ORDER BY cm.created_at DESC
  `),

  // Statistics
  getChatStats: db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM chat_conversations) as total_conversations,
      (SELECT COUNT(*) FROM chat_conversations WHERE status = 'active') as active_conversations,
      (SELECT COUNT(*) FROM chat_messages) as total_messages,
      (SELECT COUNT(*) FROM chat_messages WHERE created_at >= date('now', '-24 hours')) as messages_24h,
      (SELECT COUNT(DISTINCT user_id) FROM chat_participants) as active_chat_users
  `),

  // Budget operations
  createBudget: db.prepare(`
    INSERT INTO budgets (title, description, category, type, amount, currency, status, priority, fiscal_year, fiscal_period, allocated_by, approved_by, requested_by, department, club_id, event_id, start_date, end_date, notes, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),

  getBudgetById: db.prepare(`
    SELECT b.*, u1.name as allocated_by_name, u2.name as approved_by_name, u3.name as requested_by_name, c.name as club_name, e.title as event_title
    FROM budgets b
    LEFT JOIN users u1 ON b.allocated_by = u1.id
    LEFT JOIN users u2 ON b.approved_by = u2.id
    LEFT JOIN users u3 ON b.requested_by = u3.id
    LEFT JOIN clubs c ON b.club_id = c.id
    LEFT JOIN events e ON b.event_id = e.id
    WHERE b.id = ?
  `),

  getAllBudgets: db.prepare(`
    SELECT b.*, u1.name as allocated_by_name, u2.name as approved_by_name, u3.name as requested_by_name, c.name as club_name, e.title as event_title
    FROM budgets b
    LEFT JOIN users u1 ON b.allocated_by = u1.id
    LEFT JOIN users u2 ON b.approved_by = u2.id
    LEFT JOIN users u3 ON b.requested_by = u3.id
    LEFT JOIN clubs c ON b.club_id = c.id
    LEFT JOIN events e ON b.event_id = e.id
    ORDER BY b.created_at DESC
  `),

  getBudgetsByStatus: db.prepare(`
    SELECT b.*, u1.name as allocated_by_name, u2.name as approved_by_name, u3.name as requested_by_name, c.name as club_name, e.title as event_title
    FROM budgets b
    LEFT JOIN users u1 ON b.allocated_by = u1.id
    LEFT JOIN users u2 ON b.approved_by = u2.id
    LEFT JOIN users u3 ON b.requested_by = u3.id
    LEFT JOIN clubs c ON b.club_id = c.id
    LEFT JOIN events e ON b.event_id = e.id
    WHERE b.status = ?
    ORDER BY b.created_at DESC
  `),

  getBudgetsByCategory: db.prepare(`
    SELECT b.*, u1.name as allocated_by_name, u2.name as approved_by_name, u3.name as requested_by_name, c.name as club_name, e.title as event_title
    FROM budgets b
    LEFT JOIN users u1 ON b.allocated_by = u1.id
    LEFT JOIN users u2 ON b.approved_by = u2.id
    LEFT JOIN users u3 ON b.requested_by = u3.id
    LEFT JOIN clubs c ON b.club_id = c.id
    LEFT JOIN events e ON b.event_id = e.id
    WHERE b.category = ?
    ORDER BY b.created_at DESC
  `),

  updateBudget: db.prepare(`
    UPDATE budgets
    SET title = ?, description = ?, category = ?, type = ?, amount = ?, currency = ?, status = ?, priority = ?, fiscal_year = ?, fiscal_period = ?, allocated_by = ?, approved_by = ?, requested_by = ?, department = ?, club_id = ?, event_id = ?, start_date = ?, end_date = ?, approved_at = ?, spent_amount = ?, remaining_amount = ?, notes = ?, tags = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),

  updateBudgetStatus: db.prepare(`
    UPDATE budgets
    SET status = ?, approved_by = ?, approved_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),

  updateBudgetSpentAmount: db.prepare(`
    UPDATE budgets
    SET spent_amount = ?, remaining_amount = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),

  deleteBudget: db.prepare(`
    DELETE FROM budgets WHERE id = ?
  `),

  // Budget transaction operations
  createBudgetTransaction: db.prepare(`
    INSERT INTO budget_transactions (budget_id, transaction_type, amount, description, category, vendor, invoice_number, receipt_url, transaction_date, processed_by, approved_by, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),

  getBudgetTransactions: db.prepare(`
    SELECT bt.*, u1.name as processed_by_name, u2.name as approved_by_name
    FROM budget_transactions bt
    LEFT JOIN users u1 ON bt.processed_by = u1.id
    LEFT JOIN users u2 ON bt.approved_by = u2.id
    WHERE bt.budget_id = ?
    ORDER BY bt.transaction_date DESC
  `),

  getAllBudgetTransactions: db.prepare(`
    SELECT bt.*, u1.name as processed_by_name, u2.name as approved_by_name, b.title as budget_title
    FROM budget_transactions bt
    LEFT JOIN users u1 ON bt.processed_by = u1.id
    LEFT JOIN users u2 ON bt.approved_by = u2.id
    LEFT JOIN budgets b ON bt.budget_id = b.id
    ORDER BY bt.transaction_date DESC
  `),

  updateBudgetTransactionStatus: db.prepare(`
    UPDATE budget_transactions
    SET status = ?, approved_by = ?, approved_at = CURRENT_TIMESTAMP, processed_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),

  // Sponsorship operations
  createSponsorship: db.prepare(`
    INSERT INTO sponsorships (title, description, sponsor_name, sponsor_type, contact_person, contact_email, contact_phone, website, address, category, sponsorship_type, amount, currency, status, priority, fiscal_year, start_date, end_date, duration_months, renewal_status, benefits, deliverables, contract_url, assigned_to, created_by, notes, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),

  getSponsorshipById: db.prepare(`
    SELECT s.*, u1.name as assigned_to_name, u2.name as created_by_name
    FROM sponsorships s
    LEFT JOIN users u1 ON s.assigned_to = u1.id
    LEFT JOIN users u2 ON s.created_by = u2.id
    WHERE s.id = ?
  `),

  getAllSponsorships: db.prepare(`
    SELECT s.*, u1.name as assigned_to_name, u2.name as created_by_name
    FROM sponsorships s
    LEFT JOIN users u1 ON s.assigned_to = u1.id
    LEFT JOIN users u2 ON s.created_by = u2.id
    ORDER BY s.created_at DESC
  `),

  getSponsorshipsByStatus: db.prepare(`
    SELECT s.*, u1.name as assigned_to_name, u2.name as created_by_name
    FROM sponsorships s
    LEFT JOIN users u1 ON s.assigned_to = u1.id
    LEFT JOIN users u2 ON s.created_by = u2.id
    WHERE s.status = ?
    ORDER BY s.created_at DESC
  `),

  getSponsorshipsByCategory: db.prepare(`
    SELECT s.*, u1.name as assigned_to_name, u2.name as created_by_name
    FROM sponsorships s
    LEFT JOIN users u1 ON s.assigned_to = u1.id
    LEFT JOIN users u2 ON s.created_by = u2.id
    WHERE s.category = ?
    ORDER BY s.created_at DESC
  `),

  updateSponsorship: db.prepare(`
    UPDATE sponsorships
    SET title = ?, description = ?, sponsor_name = ?, sponsor_type = ?, contact_person = ?, contact_email = ?, contact_phone = ?, website = ?, address = ?, category = ?, sponsorship_type = ?, amount = ?, currency = ?, status = ?, priority = ?, fiscal_year = ?, start_date = ?, end_date = ?, duration_months = ?, renewal_status = ?, benefits = ?, deliverables = ?, contract_url = ?, assigned_to = ?, approved_at = ?, activated_at = ?, completed_at = ?, notes = ?, tags = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),

  updateSponsorshipStatus: db.prepare(`
    UPDATE sponsorships
    SET status = ?, approved_at = CURRENT_TIMESTAMP, activated_at = CASE WHEN ? = 'active' THEN CURRENT_TIMESTAMP ELSE activated_at END, completed_at = CASE WHEN ? = 'completed' THEN CURRENT_TIMESTAMP ELSE completed_at END, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),

  deleteSponsorship: db.prepare(`
    DELETE FROM sponsorships WHERE id = ?
  `),

  // Sponsorship benefits and deliverables
  createSponsorshipBenefit: db.prepare(`
    INSERT INTO sponsorship_benefits (sponsorship_id, benefit_type, description, value, currency, is_delivered, delivery_date, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),

  getSponsorshipBenefits: db.prepare(`
    SELECT * FROM sponsorship_benefits WHERE sponsorship_id = ? ORDER BY delivery_date ASC
  `),

  updateSponsorshipBenefit: db.prepare(`
    UPDATE sponsorship_benefits
    SET benefit_type = ?, description = ?, value = ?, currency = ?, is_delivered = ?, delivery_date = ?, notes = ?
    WHERE id = ?
  `),

  createSponsorshipDeliverable: db.prepare(`
    INSERT INTO sponsorship_deliverables (sponsorship_id, deliverable_type, description, due_date, is_completed, completed_date, completion_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `),

  getSponsorshipDeliverables: db.prepare(`
    SELECT * FROM sponsorship_deliverables WHERE sponsorship_id = ? ORDER BY due_date ASC
  `),

  updateSponsorshipDeliverable: db.prepare(`
    UPDATE sponsorship_deliverables
    SET deliverable_type = ?, description = ?, due_date = ?, is_completed = ?, completed_date = ?, completion_notes = ?
    WHERE id = ?
  `),

  // Budget and Sponsorship Statistics
  getBudgetStats: db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM budgets) as total_budgets,
      (SELECT COUNT(*) FROM budgets WHERE status = 'approved') as approved_budgets,
      (SELECT COUNT(*) FROM budgets WHERE status = 'pending') as pending_budgets,
      (SELECT SUM(amount) FROM budgets WHERE status = 'approved') as total_allocated,
      (SELECT SUM(spent_amount) FROM budgets WHERE status = 'approved') as total_spent,
      (SELECT SUM(amount) FROM budgets WHERE status = 'approved') - (SELECT SUM(spent_amount) FROM budgets WHERE status = 'approved') as total_remaining
  `),

  getSponsorshipStats: db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM sponsorships) as total_sponsorships,
      (SELECT COUNT(*) FROM sponsorships WHERE status = 'active') as active_sponsorships,
      (SELECT COUNT(*) FROM sponsorships WHERE status = 'prospecting') as prospecting_sponsorships,
      (SELECT SUM(amount) FROM sponsorships WHERE status = 'active' AND sponsorship_type = 'monetary') as total_sponsored_amount,
      (SELECT COUNT(*) FROM sponsorships WHERE renewal_status = 'upcoming') as upcoming_renewals
  `)
};

// Password hashing utility (using bcryptjs for security)
import bcrypt from 'bcryptjs';

export const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Password verification utility
export const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Initialize database with default admin user
export const initializeDatabase = async () => {
  try {
    // Check if admin user exists
    const existingAdmin = dbUtils.getUserByEmail.get('admin@university.edu');

    if (!existingAdmin) {
      // Create default admin user
      const adminPasswordHash = await hashPassword('admin123');
      dbUtils.createUser.run('System Administrator', 'admin@university.edu', 'University Central', 'super_admin', adminPasswordHash);

      console.log('✅ Database initialized with default admin user');
      console.log('📧 Email: admin@university.edu');
      console.log('🔑 Password: admin123');
    } else {
      console.log('✅ Database already initialized');
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
};

// Close database connection
export const closeDatabase = () => {
  db.close();
};

export default db;
