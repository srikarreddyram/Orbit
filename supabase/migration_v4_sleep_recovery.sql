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
