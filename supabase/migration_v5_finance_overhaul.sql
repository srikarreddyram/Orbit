-- ============================================
-- MIGRATION V5: FINANCE OVERHAUL (DYNAMIC CATEGORIES)
-- ============================================

-- 1. Create the custom categories table
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

-- 2. Drop the restrictive CHECK constraints on existing tables
-- By dropping these constraints, we allow users to insert custom text as categories.
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_category_check;
ALTER TABLE recurring_transactions DROP CONSTRAINT IF EXISTS recurring_transactions_category_check;

-- Note: In a production environment with millions of rows, we might migrate data.
-- But since we are just unblocking the frontend from the restrictive CHECK constraint,
-- dropping the constraint is sufficient. The frontend will sync transactions.category 
-- strings to transaction_categories.name.

-- 3. Bootstrap Trigger: Auto-create default categories for a user if they don't exist
CREATE OR REPLACE FUNCTION bootstrap_default_categories(uid uuid)
RETURNS void AS $$
BEGIN
  -- Check if they already have categories, if not, insert defaults
  IF NOT EXISTS (SELECT 1 FROM transaction_categories WHERE user_id = uid) THEN
    -- Expenses
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
      
    -- Incomes
    INSERT INTO transaction_categories (user_id, name, type, color, icon) VALUES 
      (uid, 'salary', 'income', '#34d399', 'ArrowDownRight'),
      (uid, 'savings', 'income', '#10b981', 'PiggyBank'),
      (uid, 'investment', 'income', '#059669', 'ArrowUpRight'),
      (uid, 'other_income', 'income', '#a7f3d0', 'Package');
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Expose an RPC so the frontend can call this explicitly if needed, or we just call it when fetching
-- But a simpler approach is to call it on user creation, OR we can just let the frontend call an RPC 
-- to bootstrap defaults if categories are empty.
CREATE OR REPLACE FUNCTION rpc_bootstrap_categories()
RETURNS void AS $$
BEGIN
  PERFORM bootstrap_default_categories(auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
