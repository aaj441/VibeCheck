import { CoachingSession, CoachingSessionData, ChecklistItem, PracticeScenario, NeuroAdaptation } from '../types/coaching';

export class CoachingService {
  private sessions: Map<string, CoachingSession> = new Map();

  createSession(userId: string): CoachingSession {
    const session: CoachingSession = {
      id: this.generateId(),
      userId,
      eventType: 'other',
      setting: 'in-person',
      currentStep: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      data: {}
    };
    
    this.sessions.set(session.id, session);
    return session;
  }

  getSession(sessionId: string): CoachingSession | null {
    return this.sessions.get(sessionId) || null;
  }

  updateSession(sessionId: string, updates: Partial<CoachingSessionData>): CoachingSession | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    session.data = { ...session.data, ...updates };
    session.updatedAt = new Date();
    this.sessions.set(sessionId, session);
    
    return session;
  }

  // Step 1: Context Check-In
  processContextCheckIn(sessionId: string, contextData: any): CoachingSession | null {
    const session = this.getSession(sessionId);
    if (!session) return null;

    session.eventType = contextData.eventType;
    session.setting = contextData.setting;
    session.currentStep = 2;
    
    return this.updateSession(sessionId, {
      contextCheckIn: contextData
    });
  }

  // Step 2: Emotional Calibration
  processEmotionalCalibration(sessionId: string, emotionalData: any): CoachingSession | null {
    const session = this.updateSession(sessionId, {
      emotionalCalibration: emotionalData
    });
    
    if (session) {
      session.currentStep = 3;
      this.sessions.set(sessionId, session);
    }
    
    return session;
  }

  // Step 3: Generate Personalized Checklist
  generateChecklist(sessionId: string): ChecklistItem[] {
    const session = this.getSession(sessionId);
    if (!session) return [];

    const checklist: ChecklistItem[] = [];
    const { eventType, setting } = session;
    const { emotionalCalibration, contextCheckIn } = session.data;

    // Base checklist items
    checklist.push({
      id: 'comfort-items',
      category: 'comfort',
      title: 'Bring comfort items',
      description: 'Pack fidget toys, water bottle, or other comfort items',
      completed: false,
      priority: 'high'
    });

    // Event-specific items
    if (eventType === 'date') {
      checklist.push(
        {
          id: 'hygiene',
          category: 'preparation',
          title: 'Personal hygiene check',
          description: 'Shower, brush teeth, check appearance',
          completed: false,
          priority: 'high'
        },
        {
          id: 'conversation-starters',
          category: 'conversation',
          title: 'Prepare conversation starters',
          description: 'Think of 3-5 topics you can discuss comfortably',
          completed: false,
          priority: 'medium'
        },
        {
          id: 'safe-exit',
          category: 'safety',
          title: 'Plan safe exit strategy',
          description: 'Know how to politely end the date if needed',
          completed: false,
          priority: 'high'
        }
      );
    } else if (eventType === 'interview') {
      checklist.push(
        {
          id: 'research',
          category: 'preparation',
          title: 'Research the company',
          description: 'Learn about company values, recent news, role requirements',
          completed: false,
          priority: 'high'
        },
        {
          id: 'questions-to-ask',
          category: 'conversation',
          title: 'Prepare questions to ask',
          description: 'Have 3-5 thoughtful questions about the role/company',
          completed: false,
          priority: 'high'
        },
        {
          id: 'documents',
          category: 'preparation',
          title: 'Organize documents',
          description: 'Print resume, portfolio, references if needed',
          completed: false,
          priority: 'medium'
        }
      );
    }

    // Sensory adaptations based on triggers
    if (emotionalCalibration?.triggers?.includes('loud noises')) {
      checklist.push({
        id: 'noise-protection',
        category: 'sensory',
        title: 'Noise protection',
        description: 'Bring noise-canceling headphones or earplugs',
        completed: false,
        priority: 'high'
      });
    }

    if (emotionalCalibration?.anxiety && emotionalCalibration.anxiety > 7) {
      checklist.push({
        id: 'grounding-techniques',
        category: 'comfort',
        title: 'Practice grounding techniques',
        description: '5-4-3-2-1 technique: 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste',
        completed: false,
        priority: 'high'
      });
    }

    return checklist;
  }

  // Step 4: Generate Practice Scenarios
  generatePracticeScenarios(sessionId: string): PracticeScenario[] {
    const session = this.getSession(sessionId);
    if (!session) return [];

    const scenarios: PracticeScenario[] = [];
    const { eventType } = session;

    if (eventType === 'date') {
      scenarios.push(
        {
          id: 'greeting',
          scenario: 'You arrive at the meeting spot and see your date waiting. How do you approach and greet them?',
          suggestedResponse: 'Hi [Name]! It\'s great to meet you in person. Thanks for suggesting this place - it looks really nice.'
        },
        {
          id: 'awkward-pause',
          scenario: 'There\'s been a lull in conversation for about 10 seconds. What do you do?',
          suggestedResponse: 'I\'m curious - what\'s been the highlight of your week so far? Or: This place has such a nice atmosphere, have you been here before?'
        },
        {
          id: 'ending-date',
          scenario: 'The date is going well and you want to see them again. How do you end the evening?',
          suggestedResponse: 'I\'ve really enjoyed talking with you tonight. Would you be interested in [specific activity] next week?'
        }
      );
    } else if (eventType === 'interview') {
      scenarios.push(
        {
          id: 'introduction',
          scenario: 'The interviewer asks "Tell me about yourself." How do you respond?',
          suggestedResponse: 'I\'m [name], and I\'m passionate about [relevant field]. In my current role at [company], I\'ve been focusing on [relevant experience]. What excites me about this opportunity is [specific aspect of the role].'
        },
        {
          id: 'weakness-question',
          scenario: 'They ask "What\'s your biggest weakness?" How do you handle this?',
          suggestedResponse: 'I sometimes focus so intensely on getting details right that I need to remind myself to step back and look at the bigger picture. I\'ve been working on this by setting regular check-ins with my team to ensure alignment.'
        }
      );
    }

    return scenarios;
  }

  // Step 5: Live Support Analysis
  analyzeLiveInteraction(sessionId: string, userInput: string): any {
    // Simple sentiment analysis and suggestions
    const lowerInput = userInput.toLowerCase();
    
    let tone = 'neutral';
    let suggestions: string[] = [];
    
    if (lowerInput.includes('nervous') || lowerInput.includes('anxious') || lowerInput.includes('scared')) {
      tone = 'anxious';
      suggestions = [
        'Take a deep breath - you\'re doing great!',
        'Remember: it\'s okay to pause and collect your thoughts',
        'You can say: "That\'s a great question, let me think about that for a moment"'
      ];
    } else if (lowerInput.includes('going well') || lowerInput.includes('good') || lowerInput.includes('positive')) {
      tone = 'positive';
      suggestions = [
        'Wonderful! You\'re building great rapport',
        'Keep being yourself - authenticity is your strength',
        'Remember to ask questions too - show genuine interest'
      ];
    } else if (lowerInput.includes('confused') || lowerInput.includes('don\'t understand')) {
      tone = 'confused';
      suggestions = [
        'It\'s perfectly okay to ask for clarification',
        'Try: "Could you help me understand what you mean by..."',
        'Asking questions shows engagement, not weakness'
      ];
    }

    return {
      tone,
      confidence: 0.8,
      suggestions
    };
  }

  // Neurodivergent adaptations
  getNeuroAdaptations(type: NeuroAdaptation['type']): string[] {
    const adaptations: Record<NeuroAdaptation['type'], string[]> = {
      'ADHD': [
        'Use timers and reminders',
        'Take notes during conversations',
        'It\'s okay to fidget - bring a discrete fidget toy',
        'If you lose focus, politely ask them to repeat: "Sorry, could you say that again? I want to make sure I understand"'
      ],
      'ASD': [
        'Prepare scripts for common social situations',
        'It\'s okay to need processing time - use phrases like "That\'s interesting, let me think about that"',
        'Bring noise-canceling headphones for sensory breaks',
        'Practice eye contact in comfortable intervals - brief contact is fine'
      ],
      'social_anxiety': [
        'Arrive early to get comfortable with the environment',
        'Have an exit strategy planned',
        'Practice grounding techniques (5-4-3-2-1 method)',
        'Remember: the other person wants this to go well too'
      ],
      'high_masking': [
        'It\'s okay to be authentic - you don\'t need to perform',
        'Take breaks if you need to recharge',
        'Notice when you\'re masking and gently redirect to being genuine',
        'Your unique perspective is valuable'
      ]
    };

    return adaptations[type] || [];
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}