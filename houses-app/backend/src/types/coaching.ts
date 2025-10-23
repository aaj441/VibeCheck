export interface CoachingSession {
  id: string;
  userId: string;
  eventType: 'date' | 'interview' | 'networking' | 'casual' | 'other';
  setting: 'in-person' | 'online' | 'group' | 'one-on-one';
  currentStep: number;
  createdAt: Date;
  updatedAt: Date;
  data: CoachingSessionData;
}

export interface CoachingSessionData {
  // Step 1: Context Check-In
  contextCheckIn?: {
    eventType: string;
    feelings: string;
    setting: string;
    attendees: string;
    goal: string;
  };
  
  // Step 2: Emotional Calibration
  emotionalCalibration?: {
    anxiety: number; // 1-10
    excitement: number; // 1-10
    energy: number; // 1-10
    focus: number; // 1-10
    worries: string[];
    triggers: string[];
  };
  
  // Step 3: Personalized Checklist
  checklist?: ChecklistItem[];
  
  // Step 4: Practice/Simulation
  practiceScenarios?: PracticeScenario[];
  
  // Step 5: Live Interaction Support
  liveSupport?: LiveSupportEntry[];
  
  // Step 6: Post-Interaction Reflection
  reflection?: {
    whatWorked: string;
    whatWasTough: string;
    feedback: string;
    followUpActions: string[];
  };
}

export interface ChecklistItem {
  id: string;
  category: 'preparation' | 'comfort' | 'conversation' | 'safety' | 'sensory';
  title: string;
  description: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface PracticeScenario {
  id: string;
  scenario: string;
  suggestedResponse: string;
  userResponse?: string;
  feedback?: string;
}

export interface LiveSupportEntry {
  id: string;
  timestamp: Date;
  userInput: string;
  suggestion: string;
  sentimentAnalysis?: {
    tone: string;
    confidence: number;
    suggestions: string[];
  };
}

export interface NeuroAdaptation {
  type: 'ADHD' | 'ASD' | 'social_anxiety' | 'high_masking';
  adaptations: string[];
}