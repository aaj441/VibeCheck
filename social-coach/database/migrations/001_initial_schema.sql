-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user profiles table for neurodivergent-specific information
CREATE TABLE IF NOT EXISTS user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    neurodivergent_types TEXT[], -- ['ADHD', 'ASD', 'social_anxiety', 'high_masking']
    sensory_preferences JSONB, -- {noise_sensitivity: 8, light_sensitivity: 5, etc}
    communication_preferences JSONB, -- {prefers_written: true, needs_processing_time: true}
    triggers TEXT[],
    comfort_strategies TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sessions table for tracking coaching sessions
CREATE TABLE IF NOT EXISTS coaching_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'date', 'interview', 'networking', 'casual', 'other'
    event_date TIMESTAMP,
    setting VARCHAR(50), -- 'in-person', 'online', 'group', 'one-on-one'
    participants TEXT,
    goal TEXT,
    status VARCHAR(50) DEFAULT 'planning', -- 'planning', 'in-progress', 'completed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create emotional states table
CREATE TABLE IF NOT EXISTS emotional_states (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES coaching_sessions(id) ON DELETE CASCADE,
    anxiety_level INTEGER CHECK (anxiety_level >= 1 AND anxiety_level <= 10),
    excitement_level INTEGER CHECK (excitement_level >= 1 AND excitement_level <= 10),
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
    focus_level INTEGER CHECK (focus_level >= 1 AND focus_level <= 10),
    specific_worries TEXT[],
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create checklists table
CREATE TABLE IF NOT EXISTS checklists (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES coaching_sessions(id) ON DELETE CASCADE,
    checklist_items JSONB NOT NULL, -- Array of {id, text, category, completed, priority}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create practice scenarios table
CREATE TABLE IF NOT EXISTS practice_scenarios (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    scenario_name VARCHAR(255) NOT NULL,
    description TEXT,
    example_dialogue JSONB, -- Array of {speaker, text, notes}
    suggested_responses JSONB, -- Array of responses with context
    difficulty_level INTEGER DEFAULT 1,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user practice sessions
CREATE TABLE IF NOT EXISTS user_practice_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_id INTEGER REFERENCES coaching_sessions(id) ON DELETE CASCADE,
    scenario_id INTEGER REFERENCES practice_scenarios(id),
    user_responses JSONB, -- Array of {timestamp, response, feedback}
    completion_rate FLOAT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create live interaction logs
CREATE TABLE IF NOT EXISTS live_interactions (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES coaching_sessions(id) ON DELETE CASCADE,
    interaction_text TEXT,
    sentiment_analysis JSONB, -- {score, magnitude, emotions}
    suggestions TEXT[],
    user_state VARCHAR(50), -- 'calm', 'anxious', 'overwhelmed', etc
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reflections table
CREATE TABLE IF NOT EXISTS session_reflections (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES coaching_sessions(id) ON DELETE CASCADE,
    what_worked TEXT[],
    what_was_tough TEXT[],
    overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 10),
    progress_notes TEXT,
    follow_up_actions TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create progress tracking table
CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    metric_type VARCHAR(100), -- 'conversation_duration', 'anxiety_reduction', etc
    metric_value FLOAT,
    context JSONB,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_coaching_sessions_user_id ON coaching_sessions(user_id);
CREATE INDEX idx_emotional_states_session_id ON emotional_states(session_id);
CREATE INDEX idx_checklists_session_id ON checklists(session_id);
CREATE INDEX idx_live_interactions_session_id ON live_interactions(session_id);
CREATE INDEX idx_session_reflections_session_id ON session_reflections(session_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);

-- Create update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update timestamp triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coaching_sessions_updated_at BEFORE UPDATE ON coaching_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_checklists_updated_at BEFORE UPDATE ON checklists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();