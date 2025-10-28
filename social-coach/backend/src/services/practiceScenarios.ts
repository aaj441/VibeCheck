import { PracticeScenario, EventType, Setting } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class PracticeScenarioGenerator {
  generateScenarios(eventType: EventType, setting: Setting): PracticeScenario[] {
    const scenarios: PracticeScenario[] = [];
    
    // Greeting scenarios (universal)
    scenarios.push(this.createGreetingScenario(eventType));
    
    // Event-specific scenarios
    switch (eventType) {
      case 'date':
        scenarios.push(...this.createDateScenarios(setting));
        break;
      case 'interview':
        scenarios.push(...this.createInterviewScenarios(setting));
        break;
      case 'networking':
        scenarios.push(...this.createNetworkingScenarios(setting));
        break;
      case 'casual':
        scenarios.push(...this.createCasualScenarios(setting));
        break;
    }
    
    // Universal scenarios
    scenarios.push(this.createExitScenario(eventType));
    scenarios.push(this.createClarificationScenario());
    
    return scenarios;
  }
  
  private createGreetingScenario(eventType: EventType): PracticeScenario {
    return {
      id: uuidv4(),
      situation: 'Initial Greeting',
      promptText: 'You just arrived and see the person. They smile and approach you.',
      sampleResponses: [
        'Hi! It\'s nice to meet you. I\'m [your name].',
        'Hello! Thanks for meeting with me today.',
        'Hi there! I\'ve been looking forward to this.',
        'Hey! [Smile] Good to see you.'
      ]
    };
  }
  
  private createDateScenarios(setting: Setting): PracticeScenario[] {
    return [
      {
        id: uuidv4(),
        situation: 'Getting to Know Them',
        promptText: 'Your date asks: "So, what do you like to do for fun?"',
        sampleResponses: [
          'I really enjoy [hobby]. I find it [relaxing/exciting/interesting]. What about you?',
          'I\'m into [interest]. I\'ve been doing it for [time period]. Do you have any hobbies?',
          'I love [activity]! It helps me [reason]. What do you enjoy doing?',
          'Lately I\'ve been really into [new interest]. Have you ever tried it?'
        ]
      },
      {
        id: uuidv4(),
        situation: 'Awkward Silence',
        promptText: 'There\'s a pause in conversation. Your date is looking around.',
        sampleResponses: [
          '[Smile] So, what brought you to [dating app/this place]?',
          'I\'ve been meaning to ask - what kind of [music/food/movies] do you like?',
          '[Comment on environment] This place is nice. Have you been here before?',
          'Tell me more about [something they mentioned earlier].'
        ]
      },
      {
        id: uuidv4(),
        situation: 'Setting a Boundary',
        promptText: 'Your date suggests going somewhere more private. You\'re not comfortable yet.',
        sampleResponses: [
          'I appreciate the offer, but I\'d like to take things slow. Can we stay here?',
          'I\'m enjoying our time here. I\'d prefer to stay in public for now.',
          'That\'s sweet, but I\'m not ready for that yet. Let\'s get to know each other more first.',
          'I\'m more comfortable staying here if that\'s okay with you.'
        ]
      },
      {
        id: uuidv4(),
        situation: 'Ending Positively',
        promptText: 'The date is ending. You had a good time and want to see them again.',
        sampleResponses: [
          'I really enjoyed talking with you. I\'d like to do this again sometime.',
          'This was fun! Would you be interested in getting together again?',
          'I had a great time. Can I text you to set up another date?',
          'Thanks for a lovely evening. I\'d love to see you again if you\'re interested.'
        ]
      }
    ];
  }
  
  private createInterviewScenarios(setting: Setting): PracticeScenario[] {
    return [
      {
        id: uuidv4(),
        situation: 'Tell Me About Yourself',
        promptText: 'The interviewer says: "Tell me about yourself."',
        sampleResponses: [
          'I\'m a [profession] with [X years] experience in [field]. I\'m passionate about [relevant skill/interest], and I\'m excited about this role because [reason].',
          'I have a background in [area], where I\'ve focused on [achievement]. I\'m drawn to this position because it aligns with my skills in [relevant skills].',
          'I\'d describe myself as [trait] professional who enjoys [aspect of work]. In my current role, I [accomplishment], and I\'m looking to [growth goal].'
        ]
      },
      {
        id: uuidv4(),
        situation: 'Weakness Question',
        promptText: 'They ask: "What\'s your greatest weakness?"',
        sampleResponses: [
          'I tend to be very detail-oriented, which sometimes means I spend more time on tasks than necessary. I\'ve been working on balancing thoroughness with efficiency by [strategy].',
          'I can be overly self-critical. I\'ve learned to counter this by [coping mechanism] and seeking feedback from colleagues to maintain perspective.',
          'I sometimes struggle with [specific area], but I\'ve been actively improving through [concrete action] and have seen progress in [result].'
        ]
      },
      {
        id: uuidv4(),
        situation: 'Handling Difficult Question',
        promptText: 'They ask a question you don\'t immediately know how to answer.',
        sampleResponses: [
          'That\'s a great question. Let me think for a moment. [Pause] I would approach it by [thoughtful answer].',
          'I haven\'t encountered that exact situation, but I imagine I would [logical approach] based on my experience with [related situation].',
          'Could you clarify what you mean by [part of question]? I want to make sure I give you the most relevant answer.',
          'I\'m not certain about [specific aspect], but what I can tell you is [related knowledge].'
        ]
      },
      {
        id: uuidv4(),
        situation: 'Your Turn to Ask Questions',
        promptText: 'The interviewer says: "Do you have any questions for me?"',
        sampleResponses: [
          'Yes! Can you tell me more about what a typical day looks like in this role?',
          'What do you enjoy most about working here?',
          'What are the biggest challenges facing the team right now?',
          'How would you describe the company culture?',
          'What does success look like in this position after 6 months?'
        ]
      }
    ];
  }
  
  private createNetworkingScenarios(setting: Setting): PracticeScenario[] {
    return [
      {
        id: uuidv4(),
        situation: 'Starting a Conversation',
        promptText: 'You see someone standing alone. You want to start a conversation.',
        sampleResponses: [
          'Hi! I\'m [name]. Is this your first time at this event?',
          'Hello! What brings you to [event name]?',
          'Hi there! I\'m [name]. What do you do?',
          '[Smile] Mind if I join you? I\'m [name].'
        ]
      },
      {
        id: uuidv4(),
        situation: 'Elevator Pitch',
        promptText: 'Someone asks: "So, what do you do?"',
        sampleResponses: [
          'I\'m a [role] at [company/field]. I work on [brief description]. How about you?',
          'I specialize in [area]. Basically, I help [outcome/value]. What\'s your background?',
          'I\'m currently [role/project], focusing on [interesting aspect]. What brings you here?'
        ]
      },
      {
        id: uuidv4(),
        situation: 'Joining a Group',
        promptText: 'There\'s a group of 3 people talking. You want to join.',
        sampleResponses: [
          '[Approach during natural pause] Hi, mind if I join you? I\'m [name].',
          '[Stand nearby, make eye contact, smile. When acknowledged:] Hi! I\'m [name]. What are you all discussing?',
          '[When there\'s a lull] Excuse me, I overheard you mention [topic]. I\'m interested in that too. Mind if I join?'
        ]
      },
      {
        id: uuidv4(),
        situation: 'Exchanging Contact Info',
        promptText: 'You\'ve had a good conversation and want to stay in touch.',
        sampleResponses: [
          'It\'s been great talking with you. Can we exchange contact information?',
          'I\'d love to continue this conversation. Are you on LinkedIn?',
          'Here\'s my card. I\'d be interested in [following up about topic].',
          'Do you have a business card? I\'d like to stay in touch.'
        ]
      }
    ];
  }
  
  private createCasualScenarios(setting: Setting): PracticeScenario[] {
    return [
      {
        id: uuidv4(),
        situation: 'Small Talk',
        promptText: 'Someone makes a comment about the weather or environment.',
        sampleResponses: [
          'I know, right? [Add related observation or feeling]',
          'Yeah! [Agree and add small detail about yourself]',
          '[Nod] It really is. So, how do you know [mutual connection]?',
          'For sure. [Transition to question about them]'
        ]
      },
      {
        id: uuidv4(),
        situation: 'Finding Common Ground',
        promptText: 'You\'re trying to find something to talk about with someone new.',
        sampleResponses: [
          'So what do you like to do in your free time?',
          'Have you watched/read/listened to anything good lately?',
          'What\'s been keeping you busy these days?',
          'Do you have any fun plans for [upcoming holiday/weekend]?'
        ]
      }
    ];
  }
  
  private createExitScenario(eventType: EventType): PracticeScenario {
    const exitLines: { [key in EventType]: string[] } = {
      'date': [
        'I had a really nice time. Thank you for meeting with me.',
        'This was lovely. I\'ll text you later!',
        'Thanks for a great evening. Get home safe!',
        'I enjoyed this. Let\'s talk soon!'
      ],
      'interview': [
        'Thank you so much for your time today. I\'m very interested in this opportunity.',
        'I appreciate you meeting with me. I look forward to hearing from you.',
        'Thank you for this conversation. I\'m excited about the possibility of joining your team.',
        'I really enjoyed learning more about the role. Thank you for considering me.'
      ],
      'networking': [
        'It was great meeting you. Let\'s stay in touch!',
        'Really enjoyed our conversation. Have a great rest of your day!',
        'Thanks for chatting with me. Hope to see you at future events!',
        'Nice connecting with you. I\'ll reach out on LinkedIn!'
      ],
      'casual': [
        'It was nice talking with you!',
        'Good seeing you! Take care!',
        'Thanks for hanging out. See you around!',
        'Catch you later!'
      ],
      'other': [
        'Thank you for your time.',
        'It was nice meeting you.',
        'Take care!',
        'Thanks, and have a great day!'
      ]
    };
    
    return {
      id: uuidv4(),
      situation: 'Ending the Interaction Gracefully',
      promptText: 'The interaction is coming to a close. Time to say goodbye.',
      sampleResponses: exitLines[eventType] || exitLines['other']
    };
  }
  
  private createClarificationScenario(): PracticeScenario {
    return {
      id: uuidv4(),
      situation: 'Asking for Clarification',
      promptText: 'Someone said something you didn\'t quite understand or catch.',
      sampleResponses: [
        'I\'m sorry, could you repeat that?',
        'I didn\'t quite catch that. Could you say it again?',
        'Could you clarify what you mean by [specific part]?',
        'Sorry, I want to make sure I understand. Did you say [your understanding]?',
        'I\'m not familiar with [term/concept]. Could you explain?'
      ]
    };
  }
  
  provideFeedback(scenario: PracticeScenario, userResponse: string): string {
    const lowercaseResponse = userResponse.toLowerCase();
    
    // Positive feedback elements
    const positiveElements: string[] = [];
    const improvementSuggestions: string[] = [];
    
    // Check for positive elements
    if (userResponse.length > 10) {
      positiveElements.push('✅ Good length - not too brief');
    }
    
    if (lowercaseResponse.includes('i ') || lowercaseResponse.includes('my ')) {
      positiveElements.push('✅ Personal touch - you shared about yourself');
    }
    
    if (lowercaseResponse.includes('?') || lowercaseResponse.includes('you ')) {
      positiveElements.push('✅ Engagement - you\'re showing interest in the other person');
    }
    
    if (lowercaseResponse.includes('thank') || lowercaseResponse.includes('appreciate')) {
      positiveElements.push('✅ Polite and gracious tone');
    }
    
    // Check for areas of improvement
    if (userResponse.length < 10) {
      improvementSuggestions.push('💡 Try adding a bit more detail to keep the conversation flowing');
    }
    
    if (!lowercaseResponse.includes('?') && !scenario.situation.includes('Exit')) {
      improvementSuggestions.push('💡 Consider ending with a question to keep the conversation going');
    }
    
    if (lowercaseResponse.includes('um') || lowercaseResponse.includes('uh') || lowercaseResponse.includes('like')) {
      improvementSuggestions.push('💡 Try to minimize filler words, but remember - a few are totally natural and okay!');
    }
    
    // Build feedback
    let feedback = '**Your Response Analysis:**\n\n';
    
    if (positiveElements.length > 0) {
      feedback += '**Strengths:**\n' + positiveElements.join('\n') + '\n\n';
    }
    
    if (improvementSuggestions.length > 0) {
      feedback += '**Gentle Suggestions:**\n' + improvementSuggestions.join('\n') + '\n\n';
    }
    
    feedback += '**Remember:** There\'s no single "perfect" response. You\'re practicing and that\'s what matters! Your authentic voice is your best asset. 🌟';
    
    return feedback;
  }
}

export default new PracticeScenarioGenerator();
