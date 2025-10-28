import { 
  ChecklistItem, 
  ChecklistCategory, 
  EventType, 
  UserProfile, 
  EmotionalState,
  NeurodivergentType,
  CoachingSession
} from '../types';
import { v4 as uuidv4 } from 'uuid';

export class ChecklistService {
  /**
   * Generates a personalized checklist based on event type, user profile, and emotional state
   */
  static async generateChecklist(
    session: CoachingSession,
    profile: UserProfile,
    emotionalState: EmotionalState
  ): Promise<ChecklistItem[]> {
    const baseItems = this.getBaseChecklistItems(session.event_type);
    const personalizedItems = this.personalizeForNeurodivergence(baseItems, profile);
    const prioritizedItems = this.prioritizeByEmotionalState(personalizedItems, emotionalState);
    const adaptedItems = this.addComfortStrategies(prioritizedItems, profile);
    
    return this.sortByPriorityAndCategory(adaptedItems);
  }

  /**
   * Get base checklist items based on event type
   */
  private static getBaseChecklistItems(eventType: EventType): ChecklistItem[] {
    const commonItems: ChecklistItem[] = [
      {
        id: uuidv4(),
        text: 'Set a specific departure time and add buffer for unexpected delays',
        category: 'preparation',
        completed: false,
        priority: 'high',
        tips: 'Add 15-30 minutes buffer time for peace of mind'
      },
      {
        id: uuidv4(),
        text: 'Prepare comfort items (water bottle, fidget tool, phone charger)',
        category: 'comfort',
        completed: false,
        priority: 'high',
        tips: 'Keep these in a designated pocket or bag compartment'
      },
      {
        id: uuidv4(),
        text: 'Review and practice grounding techniques',
        category: 'grounding',
        completed: false,
        priority: 'medium',
        tips: '5-4-3-2-1 sensory technique or box breathing'
      },
      {
        id: uuidv4(),
        text: 'Identify a quiet space you can retreat to if needed',
        category: 'exit_strategies',
        completed: false,
        priority: 'medium',
        tips: 'Bathroom, outside area, or quiet corner'
      }
    ];

    const eventSpecificItems: Record<EventType, ChecklistItem[]> = {
      date: [
        {
          id: uuidv4(),
          text: 'Choose outfit that feels comfortable and confident',
          category: 'outfit',
          completed: false,
          priority: 'high',
          tips: 'Avoid new clothes or restrictive items'
        },
        {
          id: uuidv4(),
          text: 'Prepare 3-5 conversation starters or questions',
          category: 'conversation',
          completed: false,
          priority: 'high',
          tips: 'Write them in your phone notes for reference'
        },
        {
          id: uuidv4(),
          text: 'Review personal boundaries and how to communicate them',
          category: 'boundaries',
          completed: false,
          priority: 'high',
          tips: 'Practice phrases like "I\'m not comfortable with that"'
        },
        {
          id: uuidv4(),
          text: 'Plan a graceful exit strategy if needed',
          category: 'exit_strategies',
          completed: false,
          priority: 'medium',
          tips: '"I have an early morning" or "I need to catch up on something"'
        }
      ],
      interview: [
        {
          id: uuidv4(),
          text: 'Print/prepare resume and portfolio materials',
          category: 'materials',
          completed: false,
          priority: 'high',
          tips: 'Bring 3 copies plus digital backup'
        },
        {
          id: uuidv4(),
          text: 'Research company and prepare 3-5 questions',
          category: 'preparation',
          completed: false,
          priority: 'high',
          tips: 'Focus on role, culture, and growth opportunities'
        },
        {
          id: uuidv4(),
          text: 'Practice STAR method responses for common questions',
          category: 'conversation',
          completed: false,
          priority: 'high',
          tips: 'Situation, Task, Action, Result format'
        },
        {
          id: uuidv4(),
          text: 'Plan professional outfit and test video setup if remote',
          category: 'outfit',
          completed: false,
          priority: 'high',
          tips: 'Lay out clothes night before, test camera/audio'
        }
      ],
      networking: [
        {
          id: uuidv4(),
          text: 'Prepare elevator pitch (30-second introduction)',
          category: 'conversation',
          completed: false,
          priority: 'high',
          tips: 'Name, role, unique value, and goal'
        },
        {
          id: uuidv4(),
          text: 'Set realistic goals (e.g., talk to 3 people)',
          category: 'preparation',
          completed: false,
          priority: 'medium',
          tips: 'Quality over quantity - meaningful connections matter'
        },
        {
          id: uuidv4(),
          text: 'Business cards or digital contact sharing ready',
          category: 'materials',
          completed: false,
          priority: 'medium',
          tips: 'Have LinkedIn QR code saved on phone'
        },
        {
          id: uuidv4(),
          text: 'Identify "safe" people or quiet zones at venue',
          category: 'comfort',
          completed: false,
          priority: 'high',
          tips: 'Event organizers are usually helpful anchors'
        }
      ],
      casual: [
        {
          id: uuidv4(),
          text: 'Confirm plans and meeting details',
          category: 'preparation',
          completed: false,
          priority: 'high',
          tips: 'Screenshot or write down address and time'
        },
        {
          id: uuidv4(),
          text: 'Think of 2-3 topics you\'re comfortable discussing',
          category: 'conversation',
          completed: false,
          priority: 'medium',
          tips: 'Current interests, recent experiences, shared topics'
        }
      ],
      other: []
    };

    return [...commonItems, ...(eventSpecificItems[eventType] || [])];
  }

  /**
   * Personalize checklist items based on neurodivergent profile
   */
  private static personalizeForNeurodivergence(
    items: ChecklistItem[],
    profile: UserProfile
  ): ChecklistItem[] {
    return items.map(item => {
      const adaptations = [];

      // ADHD adaptations
      if (profile.neurodivergent_types.includes('ADHD')) {
        if (item.category === 'preparation') {
          adaptations.push({
            for_type: 'ADHD' as NeurodivergentType,
            modification: 'Set multiple alarms and reminders. Break task into micro-steps.'
          });
        }
        if (item.category === 'materials') {
          adaptations.push({
            for_type: 'ADHD' as NeurodivergentType,
            modification: 'Create a physical checklist to tick off. Pack the night before.'
          });
        }
      }

      // Autism adaptations
      if (profile.neurodivergent_types.includes('ASD')) {
        if (item.category === 'conversation') {
          adaptations.push({
            for_type: 'ASD' as NeurodivergentType,
            modification: 'Script specific phrases. Plan for literal communication needs.'
          });
        }
        if (item.category === 'preparation') {
          adaptations.push({
            for_type: 'ASD' as NeurodivergentType,
            modification: 'Research venue layout, parking, and sensory environment in advance.'
          });
        }
      }

      // Social anxiety adaptations
      if (profile.neurodivergent_types.includes('social_anxiety')) {
        if (item.category === 'grounding') {
          adaptations.push({
            for_type: 'social_anxiety' as NeurodivergentType,
            modification: 'Practice box breathing: 4 counts in, 4 hold, 4 out, 4 hold.'
          });
        }
        if (item.category === 'exit_strategies') {
          item.priority = 'high'; // Elevate priority
          adaptations.push({
            for_type: 'social_anxiety' as NeurodivergentType,
            modification: 'Pre-plan bathroom breaks as natural pause points.'
          });
        }
      }

      // High masking adaptations
      if (profile.neurodivergent_types.includes('high_masking')) {
        if (item.category === 'comfort') {
          adaptations.push({
            for_type: 'high_masking' as NeurodivergentType,
            modification: 'Schedule recovery time after. Give yourself permission to unmask when safe.'
          });
        }
      }

      return {
        ...item,
        adaptations: [...(item.adaptations || []), ...adaptations]
      };
    });
  }

  /**
   * Prioritize items based on current emotional state
   */
  private static prioritizeByEmotionalState(
    items: ChecklistItem[],
    emotionalState: EmotionalState
  ): ChecklistItem[] {
    return items.map(item => {
      let priority = item.priority;

      // High anxiety - prioritize grounding and exit strategies
      if (emotionalState.anxiety_level >= 7) {
        if (item.category === 'grounding' || item.category === 'exit_strategies') {
          priority = 'high';
        }
      }

      // Low energy - simplify and reduce non-essential items
      if (emotionalState.energy_level <= 3) {
        if (item.category === 'outfit' || item.category === 'materials') {
          priority = priority === 'high' ? 'medium' : 'low';
        }
      }

      // Low focus - emphasize preparation and written aids
      if (emotionalState.focus_level <= 3) {
        if (item.category === 'preparation' || item.text.includes('write') || item.text.includes('notes')) {
          priority = 'high';
        }
      }

      return { ...item, priority };
    });
  }

  /**
   * Add comfort strategies based on user profile
   */
  private static addComfortStrategies(
    items: ChecklistItem[],
    profile: UserProfile
  ): ChecklistItem[] {
    const comfortItems: ChecklistItem[] = [];

    // Sensory-based comfort items
    if (profile.sensory_preferences.noise_sensitivity > 6) {
      comfortItems.push({
        id: uuidv4(),
        text: 'Pack noise-reducing earplugs or headphones',
        category: 'comfort',
        completed: false,
        priority: 'high',
        tips: 'Loop earplugs or noise-cancelling headphones for travel'
      });
    }

    if (profile.sensory_preferences.light_sensitivity > 6) {
      comfortItems.push({
        id: uuidv4(),
        text: 'Bring sunglasses or tinted glasses',
        category: 'comfort',
        completed: false,
        priority: 'medium',
        tips: 'Even for indoor use if fluorescent lighting'
      });
    }

    // Communication preferences
    if (profile.communication_preferences.needs_processing_time) {
      comfortItems.push({
        id: uuidv4(),
        text: 'Practice phrases for buying thinking time',
        category: 'conversation',
        completed: false,
        priority: 'high',
        tips: '"That\'s interesting, let me think about that" or "Good question, give me a moment"'
      });
    }

    // Add user's personal comfort strategies
    profile.comfort_strategies.forEach((strategy, index) => {
      comfortItems.push({
        id: uuidv4(),
        text: strategy,
        category: 'comfort',
        completed: false,
        priority: 'medium',
        tips: 'Your personal strategy'
      });
    });

    return [...items, ...comfortItems];
  }

  /**
   * Sort items by priority and category
   */
  private static sortByPriorityAndCategory(items: ChecklistItem[]): ChecklistItem[] {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const categoryOrder: Record<ChecklistCategory, number> = {
      preparation: 0,
      hygiene: 1,
      outfit: 2,
      materials: 3,
      comfort: 4,
      grounding: 5,
      conversation: 6,
      boundaries: 7,
      exit_strategies: 8
    };

    return items.sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return categoryOrder[a.category] - categoryOrder[b.category];
    });
  }
}