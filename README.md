# ClubFlow Campus

A modern, full-stack campus club management platform built to improve student engagement, simplify event operations, and strengthen collaboration across campus communities.

## Live Deployment

The app is live at:

**🌐 https://club-flow-campus.onrender.com/**

## Overview

ClubFlow Campus helps students discover clubs, join communities, participate in events, and stay connected with campus life through a single streamlined platform.

For organizers and administrators, it provides practical workflows for club operations, event planning, participation tracking, and community management.

### Core Focus Areas

- Centralized campus club and event ecosystem
- Better discoverability of clubs and opportunities
- Smoother communication between members and organizers
- Scalable architecture for future campus-wide features

## Key Features

- Club creation and management
- Event planning and participation workflows
- User authentication and role-aware flows
- Cross-community collaboration support
- Analytics-ready structure for growth insights

## Tech Stack

Primary language distribution in this repository:

- **TypeScript** — 89.6%
- **JavaScript** — 8.1%
- **CSS** — 2.2%
- **HTML** — 0.1%

### Application Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express
- **Data Layer:** SQLite/PostgreSQL-ready architecture
- **Auth & Security:** JWT, bcrypt

## Future Scope (Open Contribution Areas)

This project is designed to grow, and contributions are highly welcome. High-impact areas include:

- **Role-based permissions refinement** (super admin / club admin / member)
- **Advanced event management** (waitlists, reminders, attendance analytics)
- **Notification system** (email + in-app updates)
- **Smart search and filtering** for clubs, events, and members
- **Dashboard analytics** for engagement and retention insights
- **Accessibility improvements** (WCAG-aligned UX and keyboard navigation)
- **Testing and CI/CD maturity** (unit, integration, e2e pipelines)
- **Performance optimization** for large campus datasets and real-time interactions

If you’d like to contribute in any of these areas, feel free to open an issue or submit a pull request.

## Contributing

Contributions are appreciated and encouraged.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make focused, well-documented changes
4. Commit with clear messages
5. Push and open a Pull Request

Please ensure your changes are tested and aligned with the project’s overall direction.

## Setup

Follow these steps to run the project locally.

### Prerequisites

- Node.js (v18+ recommended)
- npm

### 1) Clone the repository

```bash
git clone https://github.com/hasanzaki567/clubflow-campus.git
cd clubflow-campus
```

### 2) Install frontend dependencies

```bash
npm install
```

### 3) Install backend dependencies

```bash
npm run install-server
```

### 4) Run the frontend

```bash
npm run dev
```

Frontend will typically run at: `http://localhost:5173`

### 5) Run the backend (new terminal)

```bash
npm run server:dev
```

Backend will typically run at: `http://localhost:3000`

## License

This project is open source. Add or update the LICENSE file as needed for your preferred license.

---

Built to empower campus communities with better digital collaboration.