// Frontend types (matching backend)
export type EventType = 'date' | 'interview' | 'networking' | 'casual' | 'other';
export type Setting = 'in-person' | 'online' | 'group' | 'one-on-one';
export type EmotionalState = 'anxious' | 'excited' | 'neutral' | 'overwhelmed' | 'mixed';
export type SessionPhase = 'context' | 'emotional' | 'checklist' | 'practice' | 'live' | 'reflection' | 'completed';
export type NeurodivergentType = 'ADHD' | 'ASD' | 'social-anxiety' | 'multiple' | 'other' | 'prefer-not-to-say';

export interface MoodSliders {
  anxiety: number;
  excitement: number;
  energy: number;
  focus: number;
}

export interface ContextCheckIn {
  eventType: EventType;
  emotionalState: EmotionalState;
  setting: Setting;
  participants: string;
  goal: string;
  additionalNotes?: string;
}

export interface EmotionalCalibration {
  moodSliders: MoodSliders;
  specificWorries: string[];
  triggers: string[];
  sensoryNeeds?: string[];
  neurodivergentType?: NeurodivergentType[];
}

export interface ChecklistItem {
  id: string;
  category: 'preparation' | 'during' | 'exit' | 'comfort' | 'grounding';
  text: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  customized: boolean;
}

export interface PracticeScenario {
  id: string;
  situation: string;
  promptText: string;
  sampleResponses: string[];
  userResponse?: string;
  feedback?: string;
}

export interface LiveSupport {
  timestamp: Date;
  userInput: string;
  sentiment: 'positive' | 'neutral' | 'stressed' | 'overwhelmed';
  suggestions: string[];
  groundingPrompt?: string;
}

export interface Reflection {
  whatWorked: string[];
  whatFeltTough: string[];
  overallFeeling: string;
  energyLevel: number;
  wouldDoAgain: boolean;
  specificFeedback?: string;
}

export interface CoachingSession {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  currentPhase: SessionPhase;
  context?: ContextCheckIn;
  emotional?: EmotionalCalibration;
  checklist?: ChecklistItem[];
  practiceScenarios?: PracticeScenario[];
  liveSupports?: LiveSupport[];
  reflection?: Reflection;
  completed: boolean;
}

export interface User {
  id: string;
  name?: string;
  preferences?: {
    neurodivergentType?: NeurodivergentType[];
    commonTriggers?: string[];
    comfortItems?: string[];
    communicationStyle?: 'direct' | 'gentle' | 'structured';
  };
  createdAt: Date;
}
