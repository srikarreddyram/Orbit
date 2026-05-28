# LifeOS (Orbit)

Orbit is a comprehensive personal life operating system built with React, Vite, TailwindCSS, and Supabase. It tracks tasks, workouts, sleep, nutrition, habits, finances, and mood, synthesizing them into a unified "LifeScore."

## Features
- **Dashboard**: High-level overview of your day, including your current LifeScore.
- **Tasks**: Todo list with natural language parsing (e.g., "dentist tomorrow high priority").
- **Sleep & Nutrition**: Track rest and dietary intake against personalized goals.
- **Workouts**: Log strength and cardio sessions, track personal records.
- **Habits & Mood**: Build streaks and reflect on daily energy and feelings.
- **Finance**: Monitor transactions against budget limits.
- **Command Palette**: Quickly navigate the app by pressing `Cmd+K` / `Ctrl+K`.

## Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) account

### Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Supabase**
   - Create a new project on Supabase.
   - Go to Project Settings -> API to find your URL and Anon Key.
   - Create a `.env` file in the root of the project:
     ```env
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```
   
3. **Initialize Database**
   - In the Supabase SQL Editor, run the contents of `supabase/schema.sql` to create all tables and policies.
   - Run the app, create an account using the Login page.
   - Find your new User ID in the Supabase Auth section.
   - Open `supabase/seed.sql`, replace `00000000-0000-0000-0000-000000000000` with your User ID, and run the script in the SQL Editor to populate dummy data.

4. **Run Locally**
   ```bash
   npm run dev
   ```

## Next Steps
- Connect UI components (which currently use mock data) directly to the generated `useTasks`, `useSleep`, etc., hooks for live database interaction.
- Adjust LifeScore weights in Settings to personalize scoring.

## Tech Stack
- React 18
- Vite
- Tailwind CSS v3
- Supabase (PostgreSQL, Auth, RLS)
- Zustand (Global State)
- TanStack React Query (Data Fetching)
- Framer Motion (Animations)
