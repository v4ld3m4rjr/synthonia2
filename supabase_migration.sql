-- Create Daily Check-ins Table
CREATE TABLE IF NOT EXISTS daily_checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Biometrics
  sleep_hours NUMERIC,
  sleep_quality INTEGER, -- 0-100
  stress_level INTEGER, -- 0-100
  resting_hr INTEGER,
  
  -- Symptoms (0-10)
  energy_level INTEGER,
  depression_mood INTEGER,
  mania_euphoria INTEGER,
  irritability INTEGER,
  anxiety INTEGER,
  ocd_thoughts INTEGER,
  sensory_overload INTEGER,
  social_masking INTEGER,
  suicide_risk INTEGER,
  
  -- Routine
  meds_taken BOOLEAN DEFAULT false,
  notes TEXT,
  
  UNIQUE(user_id, date)
);

-- Create Weekly Check-ins Table
CREATE TABLE IF NOT EXISTS weekly_checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Scores
  phq9_score INTEGER,
  gad7_score INTEGER,
  asrm_score INTEGER,
  
  -- Vitals
  weight_kg NUMERIC,
  treatment_satisfaction INTEGER, -- 0-10
  
  UNIQUE(user_id, date)
);

-- Create Monthly Check-ins Table
CREATE TABLE IF NOT EXISTS monthly_checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- FAST Scale Items (0-3)
  fast_autonomy INTEGER,
  fast_work INTEGER,
  fast_cognition INTEGER,
  fast_finance INTEGER,
  fast_relations INTEGER,
  fast_leisure INTEGER,
  fast_total_score INTEGER,
  
  work_absences INTEGER,
  
  -- Other Scores
  ybocs_score INTEGER,
  eq5d_score INTEGER, -- 0-100
  tsqm_score INTEGER, -- 0-100
  
  UNIQUE(user_id, date)
);

-- Create Quarterly Check-ins Table
CREATE TABLE IF NOT EXISTS quarterly_checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  raads_r_score INTEGER,
  cat_q_score INTEGER,
  burnout_index INTEGER, -- 0-10
  
  UNIQUE(user_id, date)
);

-- Create Esketamine Sessions Table
CREATE TABLE IF NOT EXISTS esketamine_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  dose_mg NUMERIC,
  bp_pre_systolic INTEGER,
  bp_pre_diastolic INTEGER,
  bp_post_systolic INTEGER,
  bp_post_diastolic INTEGER,
  
  -- Experience
  dissociation_level INTEGER, -- 0-10
  physical_discomfort INTEGER, -- 0-10
  trip_quality TEXT, -- "Mística", "Assustadora", etc.
  insights TEXT,
  
  humor_24h_later INTEGER -- -5 to +5
);

-- Enable Row Level Security (RLS)
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE quarterly_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE esketamine_sessions ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can view their own daily checkins" ON daily_checkins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own daily checkins" ON daily_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own daily checkins" ON daily_checkins FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own weekly checkins" ON weekly_checkins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own weekly checkins" ON weekly_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own weekly checkins" ON weekly_checkins FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own monthly checkins" ON monthly_checkins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own monthly checkins" ON monthly_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own monthly checkins" ON monthly_checkins FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own quarterly checkins" ON quarterly_checkins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own quarterly checkins" ON quarterly_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own quarterly checkins" ON quarterly_checkins FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own esketamine sessions" ON esketamine_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own esketamine sessions" ON esketamine_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own esketamine sessions" ON esketamine_sessions FOR UPDATE USING (auth.uid() = user_id);
