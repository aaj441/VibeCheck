-- Migration: initial schema for Houses app

-- This migration file creates all necessary tables, constraints and indexes
-- for the MVP of the Houses neurodivergent dating application.

-- USERS TABLE
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  house_type VARCHAR(50) NOT NULL CHECK (house_type IN ('logic', 'creation', 'chaos', 'observation')),
  house_description TEXT,
  neurodivergent_types JSONB DEFAULT '[]',
  stim_preferences JSONB DEFAULT '{}',
  social_anxiety_level INT CHECK (social_anxiety_level BETWEEN 1 AND 10),
  dating_goals VARCHAR(100),
  bio TEXT,
  age INT,
  gender VARCHAR(50),
  location VARCHAR(255),
  avatar_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  lastfm_username VARCHAR(255),
  spotify_user_id VARCHAR(255),
  top_100_tracks JSONB,
  music_taste_summary TEXT,
  looking_for_relationship_type VARCHAR(100),
  dating_preferences JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- MATCHES TABLE
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_1 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_id_2 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  music_compatibility_score DECIMAL(3,2),
  house_alignment_score DECIMAL(3,2),
  neurodivergent_fit_score DECIMAL(3,2),
  overall_compatibility_score DECIMAL(3,2),
  status VARCHAR(50) DEFAULT 'potential' CHECK (status IN ('potential', 'liked', 'matched', 'rejected', 'archived')),
  initiated_by UUID REFERENCES users(id),
  compatibility_factors JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id_1, user_id_2),
  CHECK (user_id_1 < user_id_2)
);

-- QUESTS TABLE
CREATE TABLE quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  quest_type VARCHAR(50) NOT NULL CHECK (quest_type IN ('first_meeting', 'interview_prep', 'second_date', 'friendship', 'networking')),
  house_type VARCHAR(50),
  title VARCHAR(255),
  description TEXT,
  conversation_starters JSONB,
  exit_strategies JSONB,
  deep_dives JSONB,
  stim_breaks JSONB,
  red_flags JSONB,
  pacing_guide TEXT,
  status VARCHAR(50) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  generated_by_claude BOOLEAN DEFAULT TRUE,
  claude_model_version VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- CONVERSATIONS TABLE
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  last_message_at TIMESTAMP,
  message_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- MESSAGES TABLE
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text' CHECK (message_type IN ('text', 'prompt_suggestion', 'ai_coaching', 'music_share')),
  is_ai_suggested BOOLEAN DEFAULT FALSE,
  ai_confidence_score DECIMAL(3,2),
  reactions JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- MUSIC_ARTIFACTS TABLE
CREATE TABLE music_artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  artist_name VARCHAR(255) NOT NULL,
  track_name VARCHAR(255),
  album_name VARCHAR(255),
  scrobble_count INT,
  first_scrobble_date DATE,
  last_scrobble_date DATE,
  matches_with_user_ids JSONB DEFAULT '[]',
  spotify_uri VARCHAR(255),
  lastfm_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- HOUSE_CLASSIFICATIONS TABLE
CREATE TABLE house_classifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  house_name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  core_traits JSONB,
  conversation_style VARCHAR(255),
  dating_preferences JSONB,
  common_neurodivergences JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- USER_ACTIVITY TABLE
CREATE TABLE user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(50),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index definitions
CREATE INDEX idx_users_house_type ON users(house_type);
CREATE INDEX idx_users_lastfm_username ON users(lastfm_username);
CREATE INDEX idx_matches_user_1 ON matches(user_id_1);
CREATE INDEX idx_matches_user_2 ON matches(user_id_2);
CREATE INDEX idx_matches_compatibility_score ON matches(overall_compatibility_score DESC);
CREATE INDEX idx_quests_match_id ON quests(match_id);
CREATE INDEX idx_conversations_match_id ON conversations(match_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_music_artifacts_user_id ON music_artifacts(user_id);
CREATE INDEX idx_user_activity_user_id ON user_activity(user_id);