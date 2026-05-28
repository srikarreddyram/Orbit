-- LifeOS Database Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users PRIMARY KEY,
  name text,
  avatar_url text,
  daily_calorie_goal int DEFAULT 2000,
  daily_water_goal int DEFAULT 8,
  weekly_workout_goal int DEFAULT 4,
  sleep_target_hours numeric DEFAULT 8,
  monthly_budget numeric DEFAULT 2500,
  currency text DEFAULT 'USD',
  lifescore_weights jsonb DEFAULT '{"tasks":20,"workouts":20,"sleep":20,"calories":20,"habits":20}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS currency text DEFAULT 'USD';
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- TASKS
-- ============================================
CREATE TABLE IF NOT EXISTS tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  due_date date,
  priority text CHECK (priority IN ('low','medium','high')) DEFAULT 'medium',
  category text CHECK (category IN ('work','personal','health','finance','other')) DEFAULT 'personal',
  completed boolean DEFAULT false,
  completed_at timestamptz,
  position int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own tasks" ON tasks FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- WORKOUTS
-- ============================================
CREATE TABLE IF NOT EXISTS workouts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  type text CHECK (type IN ('cardio','strength','yoga','sports','other')) NOT NULL,
  duration_minutes int NOT NULL,
  calories_burned int,
  notes text,
  logged_at timestamptz DEFAULT now()
);

ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own workouts" ON workouts FOR ALL USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS workout_sets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id uuid REFERENCES workouts ON DELETE CASCADE,
  exercise_name text NOT NULL,
  sets int,
  reps int,
  weight_kg numeric
);

ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own workout_sets" ON workout_sets FOR ALL USING (
  EXISTS (SELECT 1 FROM workouts WHERE workouts.id = workout_sets.workout_id AND workouts.user_id = auth.uid())
);

-- ============================================
-- SLEEP
-- ============================================
CREATE TABLE IF NOT EXISTS sleep_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  bedtime timestamptz NOT NULL,
  wake_time timestamptz NOT NULL,
  duration_hours numeric GENERATED ALWAYS AS (EXTRACT(EPOCH FROM (wake_time - bedtime))/3600) STORED,
  quality int CHECK (quality BETWEEN 1 AND 5),
  notes text,
  logged_at date DEFAULT CURRENT_DATE
);

ALTER TABLE sleep_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own sleep_logs" ON sleep_logs FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- NUTRITION
-- ============================================
CREATE TABLE IF NOT EXISTS meals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  meal_type text CHECK (meal_type IN ('breakfast','lunch','dinner','snack')) NOT NULL,
  food_item text NOT NULL,
  calories int NOT NULL,
  protein_g numeric DEFAULT 0,
  carbs_g numeric DEFAULT 0,
  fat_g numeric DEFAULT 0,
  logged_at date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own meals" ON meals FOR ALL USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS water_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  glasses int DEFAULT 1,
  logged_at date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own water_logs" ON water_logs FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- FINANCE
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  type text CHECK (type IN ('income','expense')) NOT NULL,
  amount numeric NOT NULL,
  category text CHECK (category IN ('food','transport','entertainment','bills','savings','health','shopping','other')) NOT NULL,
  note text,
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own transactions" ON transactions FOR ALL USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS budget_limits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  category text NOT NULL,
  monthly_limit numeric NOT NULL,
  UNIQUE(user_id, category)
);

ALTER TABLE budget_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own budget_limits" ON budget_limits FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- HABITS
-- ============================================
CREATE TABLE IF NOT EXISTS habits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  emoji text DEFAULT '✅',
  frequency text CHECK (frequency IN ('daily','weekdays','weekends','custom')) DEFAULT 'daily',
  custom_days int[] DEFAULT NULL,
  category text DEFAULT 'general',
  archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own habits" ON habits FOR ALL USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS habit_completions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id uuid REFERENCES habits ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users NOT NULL,
  completed_on date DEFAULT CURRENT_DATE,
  UNIQUE(habit_id, completed_on)
);

ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own habit_completions" ON habit_completions FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- MOOD & JOURNAL
-- ============================================
CREATE TABLE IF NOT EXISTS mood_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  mood int CHECK (mood BETWEEN 1 AND 5) NOT NULL,
  energy int CHECK (energy BETWEEN 1 AND 5),
  note text,
  journal_entry text,
  logged_at date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own mood_logs" ON mood_logs FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- PERSONAL RECORDS
-- ============================================
CREATE TABLE IF NOT EXISTS personal_records (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  exercise_name text NOT NULL,
  record_type text CHECK (record_type IN ('weight','reps','duration','distance')),
  value numeric NOT NULL,
  achieved_at date DEFAULT CURRENT_DATE
);

ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own personal_records" ON personal_records FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX idx_tasks_user_date ON tasks(user_id, due_date);
CREATE INDEX idx_workouts_user_date ON workouts(user_id, logged_at);
CREATE INDEX idx_sleep_user_date ON sleep_logs(user_id, logged_at);
CREATE INDEX idx_meals_user_date ON meals(user_id, logged_at);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date);
CREATE INDEX idx_habits_user ON habits(user_id);
CREATE INDEX idx_habit_completions_date ON habit_completions(habit_id, completed_on);
CREATE INDEX idx_mood_user_date ON mood_logs(user_id, logged_at);

-- ============================================
-- ORBIT V2: AI & PERSISTENT CUSTOM DATA SCHEMA
-- ============================================
-- Run this in your Supabase SQL Editor

-- 1. USER METRICS
-- Stores physiological data to power AI estimations (BMR, calorie burn, macros)
CREATE TABLE IF NOT EXISTS user_metrics (
  user_id uuid REFERENCES auth.users PRIMARY KEY,
  height_cm numeric,
  weight_kg numeric,
  age int,
  gender text CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  activity_level text CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active')),
  body_fat_percentage numeric,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own metrics" ON user_metrics FOR ALL USING (auth.uid() = user_id);

-- 2. CUSTOM EXERCISES
-- Allows users to permanently persist custom exercises
CREATE TABLE IF NOT EXISTS custom_exercises (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  category text CHECK (category IN ('strength', 'cardio', 'yoga', 'sports', 'rehab', 'other')) DEFAULT 'strength',
  target_muscles text[], -- e.g., ['chest', 'triceps']
  equipment text[], -- e.g., ['barbell', 'bench']
  difficulty text CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  instructions text,
  base_met numeric, -- Estimated Metabolic Equivalent of Task for calorie burn
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, name)
);

ALTER TABLE custom_exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own custom exercises" ON custom_exercises FOR ALL USING (auth.uid() = user_id);

-- 3. CUSTOM FOODS
-- Allows users to permanently persist custom food items/recipes
CREATE TABLE IF NOT EXISTS custom_foods (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  serving_size text, -- e.g., '100g', '1 scoop'
  calories int NOT NULL,
  protein_g numeric DEFAULT 0,
  carbs_g numeric DEFAULT 0,
  fat_g numeric DEFAULT 0,
  barcode text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, name)
);

ALTER TABLE custom_foods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own custom foods" ON custom_foods FOR ALL USING (auth.uid() = user_id);

-- 4. WORKOUT TEMPLATES
-- Allows users to save a predefined list of exercises as a routine
CREATE TABLE IF NOT EXISTS workout_templates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  exercises_json jsonb NOT NULL, -- Array of objects: [{ exercise_name, sets, reps }]
  created_at timestamptz DEFAULT now()
);

ALTER TABLE workout_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own workout templates" ON workout_templates FOR ALL USING (auth.uid() = user_id);

-- 5. AI COACHING LOGS
-- Stores historical AI recommendations to prevent repetition and build context
CREATE TABLE IF NOT EXISTS ai_coaching_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  context_type text CHECK (context_type IN ('workout', 'nutrition', 'recovery', 'general')),
  prompt_summary text,
  recommendation text NOT NULL,
  generated_at timestamptz DEFAULT now()
);

ALTER TABLE ai_coaching_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own ai coaching logs" ON ai_coaching_logs FOR ALL USING (auth.uid() = user_id);
-- ============================================
-- MIGRATION V4: INTELLIGENT SLEEP & RECOVERY
-- ============================================

-- Expand the existing sleep_logs table to support detailed behavioral 
-- factors and morning recovery check-ins.

ALTER TABLE sleep_logs 
  ADD COLUMN IF NOT EXISTS sleep_onset_time timestamptz,
  ADD COLUMN IF NOT EXISTS awakenings_count int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS awake_duration_minutes int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS restfulness text CHECK (restfulness IN ('fragmented', 'moderate', 'restful')),
  ADD COLUMN IF NOT EXISTS used_screens_late boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS consumed_caffeine_late boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS felt_stressed_anxious boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS took_naps boolean DEFAULT false,
  
  -- Morning Recovery Questionnaire (Scale 1-10)
  ADD COLUMN IF NOT EXISTS energy_upon_waking int CHECK (energy_upon_waking BETWEEN 1 AND 10),
  ADD COLUMN IF NOT EXISTS mental_clarity int CHECK (mental_clarity BETWEEN 1 AND 10),
  ADD COLUMN IF NOT EXISTS mood int CHECK (mood BETWEEN 1 AND 10),
  ADD COLUMN IF NOT EXISTS muscle_soreness int CHECK (muscle_soreness BETWEEN 1 AND 10),
  ADD COLUMN IF NOT EXISTS motivation_to_train int CHECK (motivation_to_train BETWEEN 1 AND 10),
  ADD COLUMN IF NOT EXISTS subjective_quality int CHECK (subjective_quality BETWEEN 1 AND 10),
  
  -- AI Evaluated Metrics
  ADD COLUMN IF NOT EXISTS recovery_score numeric,
  ADD COLUMN IF NOT EXISTS sleep_efficiency numeric,
  ADD COLUMN IF NOT EXISTS insights_json jsonb;

-- ============================================
-- MIGRATION V5: FINANCE OVERHAUL (DYNAMIC CATEGORIES)
-- ============================================

CREATE TABLE IF NOT EXISTS transaction_categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  type text CHECK (type IN ('income', 'expense')) NOT NULL,
  color text DEFAULT '#60a5fa',
  icon text DEFAULT 'Package',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, name, type)
);

ALTER TABLE transaction_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own transaction_categories" ON transaction_categories FOR ALL USING (auth.uid() = user_id);

ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_category_check;

CREATE TABLE IF NOT EXISTS accounts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  type text CHECK (type IN ('checking', 'savings', 'credit', 'investment', 'cash', 'other')) NOT NULL,
  balance numeric DEFAULT 0,
  currency text DEFAULT 'USD',
  icon text DEFAULT 'Wallet',
  color text DEFAULT '#60a5fa',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own accounts" ON accounts FOR ALL USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS recurring_transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  amount numeric NOT NULL,
  type text CHECK (type IN ('income', 'expense')) NOT NULL,
  category text NOT NULL,
  frequency text CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')) NOT NULL,
  next_date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE recurring_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own recurring_transactions" ON recurring_transactions FOR ALL USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION bootstrap_default_categories(uid uuid)
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM transaction_categories WHERE user_id = uid) THEN
    INSERT INTO transaction_categories (user_id, name, type, color, icon) VALUES 
      (uid, 'food', 'expense', '#f59e0b', 'UtensilsCrossed'),
      (uid, 'transport', 'expense', '#60a5fa', 'Car'),
      (uid, 'entertainment', 'expense', '#7c6af7', 'Film'),
      (uid, 'bills', 'expense', '#f87171', 'Zap'),
      (uid, 'health', 'expense', '#ec4899', 'Heart'),
      (uid, 'shopping', 'expense', '#fb923c', 'ShoppingCart'),
      (uid, 'housing', 'expense', '#14b8a6', 'Home'),
      (uid, 'coffee', 'expense', '#8b5cf6', 'Coffee'),
      (uid, 'travel', 'expense', '#0ea5e9', 'Plane'),
      (uid, 'tech', 'expense', '#64748b', 'Laptop'),
      (uid, 'other', 'expense', '#94a3b8', 'Package');
      
    INSERT INTO transaction_categories (user_id, name, type, color, icon) VALUES 
      (uid, 'salary', 'income', '#34d399', 'ArrowDownRight'),
      (uid, 'savings', 'income', '#10b981', 'PiggyBank'),
      (uid, 'investment', 'income', '#059669', 'ArrowUpRight'),
      (uid, 'other_income', 'income', '#a7f3d0', 'Package');
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION rpc_bootstrap_categories()
RETURNS void AS $$
BEGIN
  PERFORM bootstrap_default_categories(auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
