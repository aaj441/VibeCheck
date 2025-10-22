// User and Profile Types
export interface User {
  id: number;
  email: string;
  username: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserProfile {
  id: number;
  user_id: number;
  neurodivergent_types: NeurodivergentType[];
  sensory_preferences: SensoryPreferences;
  communication_preferences: CommunicationPreferences;
  triggers: string[];
  comfort_strategies: string[];
  created_at: Date;
  updated_at: Date;
}

export type NeurodivergentType = 'ADHD' | 'ASD' | 'social_anxiety' | 'high_masking';

export interface SensoryPreferences {
  noise_sensitivity: number; // 1-10
  light_sensitivity: number; // 1-10
  touch_sensitivity: number; // 1-10
  smell_sensitivity: number; // 1-10
  crowd_tolerance: number; // 1-10
  preferred_environments: string[];
}

export interface CommunicationPreferences {
  prefers_written: boolean;
  needs_processing_time: boolean;
  prefers_direct_communication: boolean;
  struggles_with_eye_contact: boolean;
  prefers_structured_conversations: boolean;
  needs_clear_expectations: boolean;
}

// Session Types
export type EventType = 'date' | 'interview' | 'networking' | 'casual' | 'other';
export type Setting = 'in-person' | 'online' | 'group' | 'one-on-one';
export type SessionStatus = 'planning' | 'in-progress' | 'completed';

export interface CoachingSession {
  id: number;
  user_id: number;
  event_type: EventType;
  event_date: Date;
  setting: Setting;
  participants: string;
  goal: string;
  status: SessionStatus;
  created_at: Date;
  updated_at: Date;
}

export interface EmotionalState {
  id: number;
  session_id: number;
  anxiety_level: number; // 1-10
  excitement_level: number; // 1-10
  energy_level: number; // 1-10
  focus_level: number; // 1-10
  specific_worries: string[];
  recorded_at: Date;
}

// Checklist Types
export interface ChecklistItem {
  id: string;
  text: string;
  category: ChecklistCategory;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  tips?: string;
  adaptations?: NeurodivergentAdaptation[];
}

export type ChecklistCategory = 
  | 'preparation'
  | 'hygiene'
  | 'outfit'
  | 'materials'
  | 'conversation'
  | 'boundaries'
  | 'comfort'
  | 'exit_strategies'
  | 'grounding';

export interface NeurodivergentAdaptation {
  for_type: NeurodivergentType;
  modification: string;
}

export interface Checklist {
  id: number;
  session_id: number;
  checklist_items: ChecklistItem[];
  created_at: Date;
  updated_at: Date;
}

// Practice and Scenario Types
export interface DialogueExample {
  speaker: 'you' | 'them' | 'narrator';
  text: string;
  notes?: string;
}

export interface PracticeScenario {
  id: number;
  event_type: EventType;
  scenario_name: string;
  description: string;
  example_dialogue: DialogueExample[];
  suggested_responses: SuggestedResponse[];
  difficulty_level: number;
  tags: string[];
  created_at: Date;
}

export interface SuggestedResponse {
  context: string;
  response: string;
  why_it_works: string;
  variations: string[];
}

export interface UserPracticeSession {
  id: number;
  user_id: number;
  session_id: number;
  scenario_id: number;
  user_responses: UserResponse[];
  completion_rate: number;
  notes: string;
  created_at: Date;
}

export interface UserResponse {
  timestamp: Date;
  response: string;
  feedback: Feedback;
}

export interface Feedback {
  strengths: string[];
  suggestions: string[];
  encouragement: string;
  score?: number;
}

// Live Interaction Types
export interface LiveInteraction {
  id: number;
  session_id: number;
  interaction_text: string;
  sentiment_analysis: SentimentAnalysis;
  suggestions: string[];
  user_state: UserState;
  timestamp: Date;
}

export interface SentimentAnalysis {
  score: number; // -1 to 1
  magnitude: number; // 0 to infinity
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
  };
  tone: 'positive' | 'negative' | 'neutral' | 'mixed';
}

export type UserState = 'calm' | 'anxious' | 'overwhelmed' | 'excited' | 'focused' | 'distracted';

// Reflection Types
export interface SessionReflection {
  id: number;
  session_id: number;
  what_worked: string[];
  what_was_tough: string[];
  overall_rating: number; // 1-10
  progress_notes: string;
  follow_up_actions: string[];
  created_at: Date;
}

// Progress Tracking Types
export interface UserProgress {
  id: number;
  user_id: number;
  metric_type: ProgressMetricType;
  metric_value: number;
  context: any;
  recorded_at: Date;
}

export type ProgressMetricType = 
  | 'conversation_duration'
  | 'anxiety_reduction'
  | 'successful_interactions'
  | 'comfort_level_increase'
  | 'practice_completion'
  | 'boundary_assertion'
  | 'self_advocacy';

// API Request/Response Types
export interface ContextCheckInRequest {
  event_type: EventType;
  feelings: string;
  setting: Setting;
  participants: string;
  goal: string;
}

export interface EmotionalCalibrationRequest {
  anxiety_level: number;
  excitement_level: number;
  energy_level: number;
  focus_level: number;
  specific_worries: string[];
}

export interface GenerateChecklistRequest {
  session_id: number;
  user_profile?: UserProfile;
}

export interface PracticeRequest {
  scenario_id: number;
  response: string;
}

export interface LiveSupportRequest {
  session_id: number;
  interaction_text: string;
  current_state?: UserState;
}

export interface ReflectionRequest {
  session_id: number;
  what_worked: string[];
  what_was_tough: string[];
  overall_rating: number;
  additional_notes?: string;
}