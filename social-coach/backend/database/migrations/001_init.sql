-- Social Interaction Coach Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    preferences TEXT, -- JSON blob
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Coaching sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    current_phase TEXT NOT NULL,
    context TEXT, -- JSON blob
    emotional TEXT, -- JSON blob
    checklist TEXT, -- JSON blob
    practice_scenarios TEXT, -- JSON blob
    live_supports TEXT, -- JSON blob
    reflection TEXT, -- JSON blob
    completed INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Session activity log for tracking progress
CREATE TABLE IF NOT EXISTS activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    phase TEXT NOT NULL,
    action TEXT NOT NULL,
    data TEXT, -- JSON blob
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_log_session_id ON activity_log(session_id);
