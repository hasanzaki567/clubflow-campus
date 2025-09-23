import Database from 'better-sqlite3';
import path from 'path';

// Database file path
const DB_PATH = path.join(process.cwd(), 'campus_club_suite.db');

// Initialize database with error handling
let db: Database.Database;
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
  `)
};

// Password hashing utility (simple for demo - use bcrypt in production)
export const hashPassword = (password: string): string => {
  // Simple hash for demo - in production, use bcrypt or argon2
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
};

// Password verification utility
export const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

// Initialize database with default admin user
export const initializeDatabase = () => {
  try {
    // Check if admin user exists
    const existingAdmin = dbUtils.getUserByEmail.get('admin@university.edu');

    if (!existingAdmin) {
      // Create default admin user
      const adminPasswordHash = hashPassword('admin123');
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
