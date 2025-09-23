# Campbuzz

A comprehensive campus club management platform built with modern web technologies. This application helps students and administrators manage clubs, events, and inter-college collaborations efficiently.

## Features

- **Club Management**: Create, manage, and organize campus clubs
- **Event Planning**: Plan, track, and manage events with RSVP functionality
- **User Authentication**: Secure login and registration system
- **Inter-College Collaboration**: Connect and collaborate with clubs from other colleges
- **Analytics & Insights**: Track engagement and get AI-powered recommendations
- **Modern UI**: Beautiful glass morphism design with responsive layout

## Tech Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components
- **React Router**: Client-side routing
- **React Query**: Data fetching and caching

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework for API
- **SQLite**: Lightweight database with better-sqlite3
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing

## Project Structure

```
├── src/                    # Frontend source code
│   ├── components/         # Reusable React components
│   ├── contexts/           # React contexts (UserContext)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries (api.ts, database.ts)
│   ├── pages/              # Page components
│   └── ...
├── server/                 # Backend API server
│   ├── database.js         # Database setup and utilities
│   ├── server.js           # Express server and routes
│   ├── package.json        # Backend dependencies
│   └── README.md           # Backend documentation
├── public/                 # Static assets
└── campus_club_suite.db    # SQLite database file
```

## Setup and Installation

### Prerequisites

- Node.js (v18 or higher) - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm or yarn package manager

### Frontend Setup

1. **Clone the repository**:
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Start the frontend development server**:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

### Backend Setup

1. **Install backend dependencies**:
   ```bash
   npm run install-server
   ```

2. **Start the backend server**:
   ```bash
   npm run server:dev
   ```

   The backend API will be available at `http://localhost:3000`

### Running Both Frontend and Backend

To run both servers simultaneously:

1. **Terminal 1 - Frontend**:
   ```bash
   npm run dev
   ```

2. **Terminal 2 - Backend**:
   ```bash
   npm run server:dev
   ```

## Default Admin User

When the backend starts, it automatically creates a default admin user:

- **Email**: admin@university.edu
- **Password**: admin123
- **Role**: super_admin

## API Documentation

The backend provides RESTful API endpoints. See `server/README.md` for detailed API documentation.

### Key Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/clubs` - Get all clubs
- `POST /api/clubs` - Create new club
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event

## Development

### Available Scripts

- `npm run dev` - Start frontend development server
- `npm run build` - Build frontend for production
- `npm run server` - Start backend server
- `npm run server:dev` - Start backend with hot reload
- `npm run install-server` - Install backend dependencies

### Making Changes

1. **Frontend Changes**: Edit files in the `src/` directory
2. **Backend Changes**: Edit files in the `server/` directory
3. **Database Changes**: Modify schema in `server/database.js`

## Deployment

### Frontend Deployment

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to your hosting provider

### Backend Deployment

1. Set environment variables:
   ```
   PORT=3000
   JWT_SECRET=your-secure-secret-key
   NODE_ENV=production
   ```

2. Deploy the `server/` directory to your server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For support, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for campus communities**
