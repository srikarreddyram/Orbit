# Orbit

Orbit is a comprehensive personal life operating system built with React, Vite, TailwindCSS, Express, and MongoDB. It tracks tasks, workouts, sleep, nutrition, habits, finances, and mood, synthesizing them into a unified "LifeScore."

## Features
- **Dashboard**: High-level overview of your day, including your current LifeScore.
- **Tasks**: Todo list with natural language parsing (e.g., "dentist tomorrow high priority").
- **Sleep & Nutrition**: Track rest and dietary intake against personalized goals.
- **Workouts**: Log strength and cardio sessions, track personal records.
- **Habits & Mood**: Build streaks and reflect on daily energy and feelings.
- **Finance**: Monitor transactions against budget limits.
- **Command Palette**: Quickly navigate the app by pressing `Cmd+K` / `Ctrl+K`.

## Architecture

Orbit is split into two apps:
- `/` — the React + Vite frontend (this directory)
- `/server` — an Express + MongoDB (Mongoose) API that handles auth (JWT) and all data

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB instance — either local (via Docker, see below) or a hosted one like [MongoDB Atlas](https://www.mongodb.com/atlas)

### 1. Start MongoDB (local dev)

```bash
docker run -d --name orbit-mongo -p 27017:27017 -v orbit-mongo-data:/data/db mongo:7
```

Or point `MONGODB_URI` at an Atlas connection string instead.

### 2. Backend API

```bash
cd server
npm install
cp .env.example .env   # set MONGODB_URI and a real JWT_SECRET
npm run dev
```

The API listens on `http://localhost:4000` by default.

### 3. Frontend

From the project root:

```bash
npm install
cp .env.example .env   # set VITE_API_URL and VITE_GEMINI_API_KEY
npm run dev
```

Visit `http://localhost:5173`, and create an account from the Login page — no separate signup flow needed.

## Environment variables

**Frontend (`.env`)**
- `VITE_API_URL` — base URL of the backend API (e.g. `http://localhost:4000/api`)
- `VITE_GEMINI_API_KEY` — used client-side for the AI quick-log assistant; get one from [Google AI Studio](https://aistudio.google.com/)

**Backend (`server/.env`)**
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — long random string used to sign auth tokens
- `CLIENT_ORIGIN` — frontend origin allowed by CORS
- `PORT` — API port (default `4000`)

Never commit either `.env` file — both are gitignored, and `.env.example` documents the shape without real secrets.

## Tech Stack
- React 19
- Vite
- Tailwind CSS v3
- Express + MongoDB (Mongoose) + JWT auth
- Zustand (Global State)
- TanStack React Query (Data Fetching)
- Framer Motion (Animations)
