-- Migration for v3 Finance features

-- 1. Add currency to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS currency text DEFAULT 'USD';

-- 2. Accounts Table
CREATE TABLE IF NOT EXISTS accounts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  type text CHECK (type IN ('bank','credit','cash','investment','savings')) DEFAULT 'cash',
  balance numeric DEFAULT 0,
  currency text DEFAULT 'USD',
  color text DEFAULT '#7c6af7',
  institution text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own accounts" ON accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own accounts" ON accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own accounts" ON accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own accounts" ON accounts FOR DELETE USING (auth.uid() = user_id);

-- 3. Recurring Transactions Table
CREATE TABLE IF NOT EXISTS recurring_transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  amount numeric NOT NULL,
  category text DEFAULT 'other',
  frequency text CHECK (frequency IN ('daily','weekly','biweekly','monthly','yearly')) DEFAULT 'monthly',
  next_date date,
  is_active boolean DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE recurring_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own recurring" ON recurring_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recurring" ON recurring_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own recurring" ON recurring_transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own recurring" ON recurring_transactions FOR DELETE USING (auth.uid() = user_id);
