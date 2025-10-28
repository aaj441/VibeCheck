import { ChecklistItem, ContextCheckIn, EmotionalCalibration, EventType } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class ChecklistGenerator {
  generateChecklist(
    context: ContextCheckIn,
    emotional: EmotionalCalibration
  ): ChecklistItem[] {
    const checklist: ChecklistItem[] = [];
    
    // Base items for all events
    this.addComfortItems(checklist, emotional);
    this.addGroundingItems(checklist, emotional);
    
    // Event-specific items
    switch (context.eventType) {
      case 'date':
        this.addDateItems(checklist, context, emotional);
        break;
      case 'interview':
        this.addInterviewItems(checklist, context, emotional);
        break;
      case 'networking':
        this.addNetworkingItems(checklist, context, emotional);
        break;
      case 'casual':
        this.addCasualItems(checklist, context, emotional);
        break;
      default:
        this.addGeneralItems(checklist, context, emotional);
    }
    
    // Add trigger-specific support
    this.addTriggerSupport(checklist, emotional);
    
    // Add setting-specific items
    this.addSettingItems(checklist, context);
    
    return checklist;
  }
  
  private addComfortItems(checklist: ChecklistItem[], emotional: EmotionalCalibration): void {
    checklist.push({
      id: uuidv4(),
      category: 'comfort',
      text: '🧸 Bring a comfort/fidget item (stress ball, smooth stone, fidget toy)',
      priority: 'high',
      completed: false,
      customized: false
    });
    
    checklist.push({
      id: uuidv4(),
      category: 'comfort',
      text: '💧 Pack water bottle to stay hydrated',
      priority: 'high',
      completed: false,
      customized: false
    });
    
    if (emotional.moodSliders.anxiety >= 7) {
      checklist.push({
        id: uuidv4(),
        category: 'comfort',
        text: '🎧 Bring headphones for before/after (calming music or white noise)',
        priority: 'high',
        completed: false,
        customized: true
      });
    }
    
    if (emotional.sensoryNeeds && emotional.sensoryNeeds.length > 0) {
      checklist.push({
        id: uuidv4(),
        category: 'comfort',
        text: `🌟 Address sensory needs: ${emotional.sensoryNeeds.join(', ')}`,
        priority: 'high',
        completed: false,
        customized: true
      });
    }
  }
  
  private addGroundingItems(checklist: ChecklistItem[], emotional: EmotionalCalibration): void {
    checklist.push({
      id: uuidv4(),
      category: 'grounding',
      text: '🧘 Practice 5-4-3-2-1 grounding: 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste',
      priority: 'medium',
      completed: false,
      customized: false
    });
    
    if (emotional.moodSliders.anxiety >= 6) {
      checklist.push({
        id: uuidv4(),
        category: 'grounding',
        text: '💨 Deep breathing: 4 counts in, hold 4, out 4, hold 4 (repeat 3x before event)',
        priority: 'high',
        completed: false,
        customized: true
      });
    }
    
    checklist.push({
      id: uuidv4(),
      category: 'grounding',
      text: '✨ Affirmation: "I am prepared. I can do this. It\'s okay to be myself."',
      priority: 'medium',
      completed: false,
      customized: false
    });
  }
  
  private addDateItems(checklist: ChecklistItem[], context: ContextCheckIn, emotional: EmotionalCalibration): void {
    checklist.push({
      id: uuidv4(),
      category: 'preparation',
      text: '🚿 Personal hygiene: shower, brush teeth, deodorant',
      priority: 'high',
      completed: false,
      customized: false
    });
    
    checklist.push({
      id: uuidv4(),
      category: 'preparation',
      text: '👔 Choose comfortable outfit that makes you feel confident',
      priority: 'high',
      completed: false,
      customized: false
    });
    
    checklist.push({
      id: uuidv4(),
      category: 'preparation',
      text: '📝 Prepare 3-5 conversation starters (hobbies, recent experiences, interests)',
      priority: 'high',
      completed: false,
      customized: false
    });
    
    checklist.push({
      id: uuidv4(),
      category: 'during',
      text: '👂 Practice active listening: make eye contact (or look at their forehead), nod, ask follow-up questions',
      priority: 'medium',
      completed: false,
      customized: false
    });
    
    checklist.push({
      id: uuidv4(),
      category: 'during',
      text: '🚪 Know your boundaries: It\'s okay to say "I\'m not comfortable with that" or "I need to take this slow"',
      priority: 'high',
      completed: false,
      customized: false
    });
    
    checklist.push({
      id: uuidv4(),
      category: 'exit',
      text: '🏁 Have graceful exit phrases ready: "I had a nice time. I\'d like to think about next steps" or "Thank you for meeting me"',
      priority: 'medium',
      completed: false,
      customized: false
    });
    
    checklist.push({
      id: uuidv4(),
      category: 'exit',
      text: '🆘 Safe out action: Text a friend beforehand with emergency exit plan if needed',
      priority: 'high',
      completed: false,
      customized: true
    });
  }
  
  private addInterviewItems(checklist: ChecklistItem[], context: ContextCheckIn, emotional: EmotionalCalibration): void {
    checklist.push({
      id: uuidv4(),
      category: 'preparation',
      text: '🔍 Research the company: mission, values, recent news, culture',
      priority: 'high',
      completed: false,
      customized: false
    });
    
    checklist.push({
      id: uuidv4(),
      category: 'preparation',
      text: '📄 Bring multiple copies of resume, portfolio, or relevant materials',
      priority: 'high',
      completed: false,
      customized: false
    });
    
    checklist.push({
      id: uuidv4(),
      category: 'preparation',
      text: '👔 Choose professional outfit appropriate for company culture',
      priority: 'high',
      completed: false,
      customized: false
    });
    
    checklist.push({
      id: uuidv4(),
      category: 'preparation',
      text: '❓ Prepare 3-5 questions to ask interviewer (about role, team, growth, day-to-day)',
      priority: 'high',
      completed: false,
      customized: false
    });
    
    checklist.push({
      id: uuidv4(),
      category: 'preparation',
      text: '🗣️ Practice STAR method answers (Situation, Task, Action, Result) for common questions',
      priority: 'medium',
      completed: false,
      customized: false
    });
    
    checklist.push({
      id: uuidv4(),
      category: 'during',
      text: '⏰ Arrive 10-15 minutes early (or log in 5 minutes early if virtual)',
      priority: 'high',
      completed: false,
      customized: false
    });
    
    checklist.push({
      id: uuidv4(),
      category: 'during',
      text: '🤝 Handshake greeting (if in-person and comfortable) or warm verbal greeting',
      priority: 'medium',
      completed: false,
      customized: false
    });
    
    checklist.push({
      id: uuidv4(),
      category: 'during',
      text: '⏸️ It\'s okay to pause and think before answering. Say: "That\'s a great question, let me think for a moment"',
      priority: 'high',
      completed: false,
      customized: true
    });
    
    checklist.push({
      id: uuidv4(),
      category: 'exit',
      text: '🙏 Thank interviewer: "Thank you for your time and consideration. I\'m very interested in this opportunity"',
      priority: 'high',
      completed: false,
      customized: false
    });
    
    checklist.push({
      id: uuidv4(),
      category: 'exit',
      text: '📧 Send follow-up thank you email within 24 hours',
      priority: 'medium',
      completed: false,
      customized: false
    });
  }
  
  private addNetworkingItems(checklist: ChecklistItem[], context: ContextCheckIn, emotional: EmotionalCalibration): void {
    checklist.push({
      id: uuidv4(),
      category: 'preparation',
      text: '💼 Bring business cards or have digital contact info ready to share',
      priority: 'high',
      completed: false,
      customized: false
    });
    
    checklist.push({
      id: uuidv4(),
      category: 'preparation',
      text: '🎯 Set realistic goal: aim to have 2-3 meaningful conversations, not 20 surface-level ones',
      priority: 'high',
      completed: false,
      customized: true
    });
    
    checklist.push({
      id: uuidv4(),
      category: 'preparation',
      text: '📣 Prepare your "elevator pitch" (30 seconds about who you are and what you do)',
      priority: 'high',
      completed: false,
      customized: false
    });
    
    checklist.push({
      id: uuidv4(),
      category: 'during',
      text: '👋 Ice breaker phrases: "Hi, I\'m [name]. What brings you to this event?" or "What do you do?"',
      priority: 'high',
      completed: false,
      customized: false
    });
    
    checklist.push({
      id: uuidv4(),
      category: 'during',
      text: '⏰ It\'s okay to take breaks: step outside, visit restroom, check phone as "social recharge"',
      priority: 'medium',
      completed: false,
      customized: true
    });
    
    checklist.push({
      id: uuidv4(),
      category: 'exit',
      text: '🚪 Graceful exit from conversation: "It was great talking with you. I\'m going to mingle a bit more. Let\'s stay in touch!"',
      priority: 'medium',
      completed: false,
      customized: false
    });
  }
  
  private addCasualItems(checklist: ChecklistItem[], context: ContextCheckIn, emotional: EmotionalCalibration): void {
    checklist.push({
      id: uuidv4(),
      category: 'preparation',
      text: '💭 Think about 2-3 topics you feel comfortable discussing',
      priority: 'medium',
      completed: false,
      customized: false
    });
    
    checklist.push({
      id: uuidv4(),
      category: 'during',
      text: '😊 Remember: silences are normal and okay. You don\'t need to fill every moment',
      priority: 'medium',
      completed: false,
      customized: true
    });
    
    checklist.push({
      id: uuidv4(),
      category: 'during',
      text: '🎭 Be yourself: masking is exhausting. Your authentic self is worthy of connection',
      priority: 'high',
      completed: false,
      customized: true
    });
  }
  
  private addGeneralItems(checklist: ChecklistItem[], context: ContextCheckIn, emotional: EmotionalCalibration): void {
    checklist.push({
      id: uuidv4(),
      category: 'preparation',
      text: '📍 Confirm location/link and arrival time',
      priority: 'high',
      completed: false,
      customized: false
    });
    
    checklist.push({
      id: uuidv4(),
      category: 'during',
      text: '💬 Ask clarifying questions if you don\'t understand something',
      priority: 'medium',
      completed: false,
      customized: false
    });
  }
  
  private addTriggerSupport(checklist: ChecklistItem[], emotional: EmotionalCalibration): void {
    if (emotional.triggers.some(t => t.toLowerCase().includes('name'))) {
      checklist.push({
        id: uuidv4(),
        category: 'during',
        text: '📝 Strategy for names: Repeat their name when introduced, write it down if possible, or say "I\'m sorry, could you remind me of your name?"',
        priority: 'high',
        completed: false,
        customized: true
      });
    }
    
    if (emotional.triggers.some(t => t.toLowerCase().includes('pause') || t.toLowerCase().includes('silence'))) {
      checklist.push({
        id: uuidv4(),
        category: 'during',
        text: '🤫 Awkward pause strategy: Ask an open question, comment on environment, or simply smile. Pauses are normal!',
        priority: 'high',
        completed: false,
        customized: true
      });
    }
    
    if (emotional.triggers.some(t => t.toLowerCase().includes('overwhelm'))) {
      checklist.push({
        id: uuidv4(),
        category: 'during',
        text: '🛟 If overwhelmed: "Excuse me for a moment, I need to step away briefly" - it\'s 100% okay to take a break',
        priority: 'high',
        completed: false,
        customized: true
      });
    }
  }
  
  private addSettingItems(checklist: ChecklistItem[], context: ContextCheckIn): void {
    if (context.setting === 'online') {
      checklist.push({
        id: uuidv4(),
        category: 'preparation',
        text: '💻 Tech check: test camera, microphone, internet connection 15 minutes before',
        priority: 'high',
        completed: false,
        customized: false
      });
      
      checklist.push({
        id: uuidv4(),
        category: 'preparation',
        text: '🖼️ Set up quiet, clean background or use virtual background',
        priority: 'medium',
        completed: false,
        customized: false
      });
    }
    
    if (context.setting === 'group') {
      checklist.push({
        id: uuidv4(),
        category: 'during',
        text: '👥 Group dynamics: It\'s okay to listen more than you speak. Quality over quantity!',
        priority: 'medium',
        completed: false,
        customized: true
      });
    }
  }
}

export default new ChecklistGenerator();
