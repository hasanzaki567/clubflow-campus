# Campbuzz Backend

This is the backend API server for the Campus Club Suite application. It provides RESTful endpoints for user authentication, club management, event management, and statistics.

## Features

- **User Authentication**: Login and registration with JWT tokens
- **Club Management**: Create and manage campus clubs
- **Event Management**: Create and track events
- **User-Club Relationships**: Join and leave clubs
- **Statistics**: Get user, club, and event statistics
- **Database**: SQLite with proper schema and relationships

## Tech Stack

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **SQLite**: Database with better-sqlite3
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing

## Setup

1. **Install Dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the server directory:
   ```
   PORT=3000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

3. **Database**:
   The database file `campus_club_suite.db` will be created automatically in the root directory when the server starts.

## Running the Server

### Development Mode:
```bash
npm run dev
```
This runs the server with hot reload using Node.js --watch.

### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:3000`.

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user (requires auth)

### Users
- `GET /api/users` - Get all users (requires auth)

### Clubs
- `GET /api/clubs` - Get all clubs
- `GET /api/clubs/:id` - Get club by ID
- `POST /api/clubs` - Create new club (requires auth)
- `POST /api/clubs/:id/join` - Join a club (requires auth)
- `DELETE /api/clubs/:id/leave` - Leave a club (requires auth)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event (requires auth)

### User Clubs
- `GET /api/users/:id/clubs` - Get user's clubs (requires auth)

### Statistics
- `GET /api/stats/users` - Get user statistics (requires auth)
- `GET /api/stats/clubs` - Get club statistics (requires auth)
- `GET /api/stats/events` - Get event statistics (requires auth)

### Health Check
- `GET /api/health` - Server health check

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Database Schema

### Users Table
- id (INTEGER, PRIMARY KEY)
- name (TEXT)
- email (TEXT, UNIQUE)
- college (TEXT)
- role (TEXT)
- password_hash (TEXT)
- created_at (DATETIME)
- updated_at (DATETIME)
- last_login (DATETIME)
- is_active (BOOLEAN)
- email_verified (BOOLEAN)

### Clubs Table
- id (INTEGER, PRIMARY KEY)
- name (TEXT)
- description (TEXT)
- category (TEXT)
- admin_id (INTEGER, FOREIGN KEY)
- member_count (INTEGER)
- created_at (DATETIME)
- updated_at (DATETIME)
- is_active (BOOLEAN)

### Events Table
- id (INTEGER, PRIMARY KEY)
- title (TEXT)
- description (TEXT)
- club_id (INTEGER, FOREIGN KEY)
- organizer_id (INTEGER, FOREIGN KEY)
- event_date (DATETIME)
- location (TEXT)
- max_attendees (INTEGER)
- current_attendees (INTEGER)
- status (TEXT)
- created_at (DATETIME)
- updated_at (DATETIME)

### User_Clubs Table (Junction)
- user_id (INTEGER, FOREIGN KEY)
- club_id (INTEGER, FOREIGN KEY)
- joined_at (DATETIME)
- role (TEXT)
- PRIMARY KEY (user_id, club_id)

## Default Admin User

When the server starts, it automatically creates a default admin user if one doesn't exist:

- **Email**: admin@university.edu
- **Password**: admin123
- **Role**: super_admin

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error

## Development

### Adding New Endpoints

1. Add the route in `server.js`
2. Add the corresponding database function in `database.js` if needed
3. Update the API client in the frontend (`src/lib/api.ts`)

### Database Changes

1. Update the schema in `database.js`
2. Add new prepared statements in `dbUtils`
3. Update the API client types and methods

## Production Deployment

1. Change the JWT_SECRET to a secure random string
2. Set NODE_ENV=production
3. Use a production database (PostgreSQL, MySQL, etc.)
4. Set up proper logging and monitoring
5. Configure CORS for your frontend domain
6. Set up SSL/TLS

## License

This project is part of the Campus Club Suite application.
