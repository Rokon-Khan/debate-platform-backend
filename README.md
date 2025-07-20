# Community Debate Arena — Backend

A full-featured backend for a debate platform built with Express.js, TypeScript, Mongoose, and JWT authentication.

# Live Deploy Link: https://debate-arena-server.vercel.app/

## Features

- **User Auth**: Register/Login with JWT
- **Debate Creation**: Title, description, tags, category, image, duration
- **Join Debate**: Select support/oppose side (only one side per debate)
- **Argument Posting**: Author info, timestamps, vote count, edit/delete within 5 min
- **Voting**: One vote per argument per user
- **Debate Countdown**: Auto-close and winner detection by votes
- **Scoreboard**: Leaderboard by votes, debates participated, filters
- **Auto-Moderation**: Banned word filter

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   - Copy `.env.example` to `.env` and set your MongoDB URI and JWT secret.

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **API Endpoints**
   - `POST   /api/auth/register` — Register
   - `POST   /api/auth/login` — Login
   - `POST   /api/debates/` — Create debate (auth)
   - `POST   /api/debates/:id/join` — Join debate (auth)
   - `GET    /api/debates/` — List debates
   - `GET    /api/debates/:id` — Get debate details
   - `POST   /api/arguments/:debateId` — Post argument (auth)
   - `GET    /api/arguments/:debateId` — List arguments
   - `PUT    /api/arguments/edit/:id` — Edit argument (auth, 5 min)
   - `DELETE /api/arguments/delete/:id` — Delete argument (auth, 5 min)
   - `POST   /api/votes/:id` — Vote on argument (auth)
   - `GET    /api/scoreboard?filter=weekly|monthly|all` — Scoreboard

## Notes

- All endpoints expect/return JSON.
- JWT authentication: send `Authorization: Bearer <token>` header.
- The system is modular and easily extensible for bonus features (public sharing, search, reply timer, etc).
