import { 
  PracticeScenario, 
  EventType, 
  DialogueExample,
  SuggestedResponse,
  UserResponse,
  Feedback,
  NeurodivergentType
} from '../types';

export class PracticeService {
  /**
   * Get scenarios based on event type and difficulty
   */
  static getScenarios(eventType: EventType, difficulty?: number): PracticeScenario[] {
    const scenarios = this.getAllScenarios();
    return scenarios.filter(s => 
      s.event_type === eventType && 
      (!difficulty || s.difficulty_level === difficulty)
    );
  }

  /**
   * Provide feedback on user's practice response
   */
  static provideFeedback(
    userResponse: string,
    scenario: PracticeScenario,
    userProfile?: { neurodivergent_types: NeurodivergentType[] }
  ): Feedback {
    const strengths: string[] = [];
    const suggestions: string[] = [];
    let score = 0;

    // Analyze response length
    const wordCount = userResponse.split(/\s+/).length;
    if (wordCount >= 10 && wordCount <= 50) {
      strengths.push('Good response length - not too short or too long');
      score += 20;
    } else if (wordCount < 10) {
      suggestions.push('Try expanding your response a bit more to show engagement');
    } else {
      suggestions.push('Consider being more concise - aim for clarity over length');
    }

    // Check for positive tone
    const positiveWords = ['thank', 'appreciate', 'enjoy', 'glad', 'happy', 'interest'];
    const hasPositiveTone = positiveWords.some(word => 
      userResponse.toLowerCase().includes(word)
    );
    if (hasPositiveTone) {
      strengths.push('Positive and friendly tone');
      score += 20;
    }

    // Check for questions (shows engagement)
    if (userResponse.includes('?')) {
      strengths.push('Great job asking questions - shows active engagement');
      score += 20;
    } else if (scenario.event_type !== 'interview') {
      suggestions.push('Consider asking a follow-up question to keep conversation flowing');
    }

    // Check for personal boundaries (if relevant)
    if (scenario.tags.includes('boundaries')) {
      const boundaryPhrases = ['not comfortable', 'prefer not', 'rather not', 'need to'];
      const hasBoundary = boundaryPhrases.some(phrase => 
        userResponse.toLowerCase().includes(phrase)
      );
      if (hasBoundary) {
        strengths.push('Excellent boundary setting - clear and respectful');
        score += 25;
      }
    }

    // Neurodivergent-specific feedback
    if (userProfile) {
      if (userProfile.neurodivergent_types.includes('ASD')) {
        // Check for directness (often a strength)
        if (!userResponse.includes('maybe') && !userResponse.includes('sort of')) {
          strengths.push('Clear and direct communication - this is a strength!');
          score += 15;
        }
      }

      if (userProfile.neurodivergent_types.includes('ADHD')) {
        // Check if response addresses the main point
        const addressesMainPoint = scenario.suggested_responses.some(sr =>
          userResponse.toLowerCase().includes(sr.context.toLowerCase().split(' ')[0])
        );
        if (addressesMainPoint) {
          strengths.push('Good focus on the main topic');
          score += 15;
        } else {
          suggestions.push('Try to address the main point first, then add additional thoughts');
        }
      }

      if (userProfile.neurodivergent_types.includes('social_anxiety')) {
        // Acknowledge the effort
        strengths.push('Great job practicing! Each attempt builds confidence');
        score += 10;
      }
    }

    // Generate encouragement based on score
    let encouragement = '';
    if (score >= 70) {
      encouragement = 'Excellent work! You\'re showing great social communication skills. Keep practicing to build even more confidence.';
    } else if (score >= 50) {
      encouragement = 'Good effort! You\'re on the right track. The suggestions will help refine your approach.';
    } else {
      encouragement = 'Nice start! Remember, practice makes progress. Each attempt helps you improve.';
    }

    // Always ensure we have at least one strength
    if (strengths.length === 0) {
      strengths.push('You completed the practice - that takes courage!');
    }

    return {
      strengths,
      suggestions,
      encouragement,
      score: Math.min(score, 100)
    };
  }

  /**
   * Get all available practice scenarios
   */
  private static getAllScenarios(): PracticeScenario[] {
    return [
      // Date scenarios
      {
        id: 1,
        event_type: 'date',
        scenario_name: 'Opening Conversation',
        description: 'You\'ve just met your date at a coffee shop. They smile and say hello.',
        example_dialogue: [
          { speaker: 'them', text: 'Hi! It\'s so nice to finally meet you in person!' },
          { speaker: 'narrator', text: 'They seem friendly and a bit nervous too' }
        ],
        suggested_responses: [
          {
            context: 'Matching their energy',
            response: 'Hi! Yes, it\'s great to meet you too! How was your journey here?',
            why_it_works: 'Mirrors their enthusiasm and asks an easy opening question',
            variations: [
              'Hi! Same here! Did you find the place okay?',
              'Hello! I\'m glad we could meet up. How\'s your day been?'
            ]
          },
          {
            context: 'If you\'re feeling nervous',
            response: 'Hi! It\'s nice to meet you too. I\'ll admit I\'m a bit nervous, but excited!',
            why_it_works: 'Honesty about nerves often helps both people relax',
            variations: [
              'Hi! Great to meet you. First dates always make me a little nervous!',
              'Hello! Nice to meet you too. I\'m glad we picked a relaxed spot.'
            ]
          }
        ],
        difficulty_level: 1,
        tags: ['opening', 'greeting'],
        created_at: new Date()
      },
      {
        id: 2,
        event_type: 'date',
        scenario_name: 'Awkward Silence',
        description: 'The conversation has hit a lull after discussing work. Both of you are quiet.',
        example_dialogue: [
          { speaker: 'narrator', text: 'You\'ve both been quiet for about 10 seconds' },
          { speaker: 'them', text: '...' },
          { speaker: 'narrator', text: 'They\'re looking at their coffee cup' }
        ],
        suggested_responses: [
          {
            context: 'Breaking silence with observation',
            response: 'This is a nice spot. Do you come here often, or is it new for you too?',
            why_it_works: 'Uses environment as conversation starter',
            variations: [
              'I really like the atmosphere here. What kind of places do you usually like?',
              'Their coffee art is impressive! Are you a coffee person or tea person?'
            ]
          },
          {
            context: 'Using prepared topics',
            response: 'So I\'m curious - what do you like to do for fun outside of work?',
            why_it_works: 'Moves to personal interests, usually easier to discuss',
            variations: [
              'What have you been watching or reading lately?',
              'Do you have any trips or fun plans coming up?'
            ]
          }
        ],
        difficulty_level: 2,
        tags: ['awkward_silence', 'conversation_flow'],
        created_at: new Date()
      },
      {
        id: 3,
        event_type: 'date',
        scenario_name: 'Setting Boundaries',
        description: 'Your date suggests going back to their place, but you\'re not comfortable with that yet.',
        example_dialogue: [
          { speaker: 'them', text: 'This has been really fun. Want to continue at my place? I live just around the corner.' },
          { speaker: 'narrator', text: 'They seem hopeful but not pushy' }
        ],
        suggested_responses: [
          {
            context: 'Polite but clear boundary',
            response: 'I\'ve had a great time too! I\'d prefer to call it a night here though. Maybe we can plan something for next time?',
            why_it_works: 'Clear boundary while showing continued interest',
            variations: [
              'This has been lovely! I need to head home, but I\'d love to see you again.',
              'I\'ve enjoyed this! I\'m not ready for that yet, but thank you for tonight.'
            ]
          },
          {
            context: 'Suggesting alternative',
            response: 'I\'m enjoying our time! How about we take a walk in the park instead? It\'s such a nice evening.',
            why_it_works: 'Offers compromise that maintains your comfort',
            variations: [
              'I\'d like to keep chatting! There\'s a dessert place nearby if you\'re interested?',
              'Not tonight, but this has been great! Want to grab lunch this weekend?'
            ]
          }
        ],
        difficulty_level: 3,
        tags: ['boundaries', 'assertiveness'],
        created_at: new Date()
      },

      // Interview scenarios
      {
        id: 4,
        event_type: 'interview',
        scenario_name: 'Tell Me About Yourself',
        description: 'The interviewer opens with the classic question after initial greetings.',
        example_dialogue: [
          { speaker: 'them', text: 'Thanks for coming in today. Let\'s start with you telling me a bit about yourself.' },
          { speaker: 'narrator', text: 'They have a notepad ready and seem engaged' }
        ],
        suggested_responses: [
          {
            context: 'Structured professional summary',
            response: 'I\'m a [role] with [X years] experience in [field]. I\'m particularly passionate about [specific area]. In my current role, I [key achievement]. I\'m excited about this opportunity because [reason related to company].',
            why_it_works: 'Follows present-past-future structure, stays relevant',
            variations: [
              'Start with current role → previous experience → why you\'re here',
              'Professional background → key skills → career goals aligned with role'
            ]
          },
          {
            context: 'For career changers',
            response: 'I bring a unique perspective from [previous field], where I developed [transferable skills]. I\'ve been building expertise in [new field] through [specific actions]. This role excites me because [specific reason].',
            why_it_works: 'Addresses career change proactively, shows intentional growth',
            variations: [
              'Previous experience → transferable skills → new direction → fit for role',
              'Core strengths → how they apply → enthusiasm for new field'
            ]
          }
        ],
        difficulty_level: 2,
        tags: ['interview_opening', 'self_introduction'],
        created_at: new Date()
      },
      {
        id: 5,
        event_type: 'interview',
        scenario_name: 'Handling Difficult Questions',
        description: 'The interviewer asks about a gap in your employment or why you left your last job.',
        example_dialogue: [
          { speaker: 'them', text: 'I noticed there\'s a gap in your employment history. Can you tell me about that?' },
          { speaker: 'narrator', text: 'They\'re looking at your resume while asking' }
        ],
        suggested_responses: [
          {
            context: 'Health/personal reasons',
            response: 'I took time to address some personal health matters. I\'m now fully ready and excited to return to work. During that time, I [any relevant activities like courses, volunteering].',
            why_it_works: 'Brief, honest without oversharing, pivots to positive',
            variations: [
              'Family caregiving responsibilities → now resolved → eager to contribute',
              'Personal development period → skills gained → ready for new challenges'
            ]
          },
          {
            context: 'Job searching/market conditions',
            response: 'I\'ve been selective in finding the right fit for my skills and career goals. During this time, I\'ve been [upskilling/freelancing/volunteering] to stay current.',
            why_it_works: 'Shows intentionality and continued growth',
            variations: [
              'Market challenges in specific industry → broadened search → found this opportunity',
              'Time to properly research companies → why this one stands out'
            ]
          }
        ],
        difficulty_level: 3,
        tags: ['difficult_questions', 'employment_gap'],
        created_at: new Date()
      },

      // Networking scenarios
      {
        id: 6,
        event_type: 'networking',
        scenario_name: 'Elevator Pitch',
        description: 'Someone at a networking event asks what you do.',
        example_dialogue: [
          { speaker: 'them', text: 'So, what do you do?' },
          { speaker: 'narrator', text: 'You\'re at a professional mixer, holding drinks' }
        ],
        suggested_responses: [
          {
            context: 'Clear and engaging pitch',
            response: 'I\'m a [role] at [company/field]. I help [who] to [achieve what]. Right now I\'m working on [interesting project]. What about you?',
            why_it_works: 'Clear, benefit-focused, ends with engagement',
            variations: [
              'I work in [field] helping companies [solve problem]. What brings you here?',
              'I [what you do in simple terms]. Currently exploring [area]. How about yourself?'
            ]
          },
          {
            context: 'Job searching',
            response: 'I\'m a [profession] currently exploring new opportunities in [field]. I\'m particularly interested in [specific area]. What field are you in?',
            why_it_works: 'Honest about job search while staying professional',
            variations: [
              'Transitioning from [current] to [target] role. Looking to connect with people in [industry].',
              'Between roles right now, focusing on [skill/certification]. What do you do?'
            ]
          }
        ],
        difficulty_level: 2,
        tags: ['elevator_pitch', 'introduction'],
        created_at: new Date()
      },
      {
        id: 7,
        event_type: 'networking',
        scenario_name: 'Joining a Group Conversation',
        description: 'You see a group of 3 people chatting at a networking event and want to join.',
        example_dialogue: [
          { speaker: 'narrator', text: 'The group is discussing industry trends, laughing occasionally' },
          { speaker: 'them', text: 'One person notices you approaching and makes eye contact' }
        ],
        suggested_responses: [
          {
            context: 'Polite entry',
            response: 'Hi! Mind if I join your discussion? I\'m [name] from [company/field].',
            why_it_works: 'Direct, polite, immediate self-identification',
            variations: [
              'Hello! This seems like an interesting conversation. I\'m [name].',
              'Hi everyone! I couldn\'t help but overhear [topic]. I\'m [name], I work in [related area].'
            ]
          },
          {
            context: 'Topic-based entry',
            response: 'Excuse me, I heard you mention [topic]. That\'s actually something I\'ve been working on. I\'m [name].',
            why_it_works: 'Shows relevance and value-add to conversation',
            variations: [
              'Hi! Are you discussing [topic]? I have some experience with that. I\'m [name].',
              'Sorry to interrupt - did you say [topic]? I\'d love to hear more. I\'m [name].'
            ]
          }
        ],
        difficulty_level: 3,
        tags: ['group_dynamics', 'joining_conversation'],
        created_at: new Date()
      },

      // Casual social scenarios
      {
        id: 8,
        event_type: 'casual',
        scenario_name: 'Small Talk at a Party',
        description: 'You\'re at a friend\'s party and end up next to someone you don\'t know at the snack table.',
        example_dialogue: [
          { speaker: 'them', text: 'These appetizers are really good!' },
          { speaker: 'narrator', text: 'They seem friendly and open to chatting' }
        ],
        suggested_responses: [
          {
            context: 'Building on their comment',
            response: 'They really are! Have you tried the [other food item]? How do you know [host\'s name]?',
            why_it_works: 'Agrees, continues food topic briefly, then pivots to connection',
            variations: [
              'I know, right? [Host] always has great food. Are you friends from work?',
              'Definitely! I\'m impressed. How do you know [host]?'
            ]
          },
          {
            context: 'If you\'re not sure what to say',
            response: 'Yeah, they\'re great! I\'m [name], by the way.',
            why_it_works: 'Simple agreement and introduction opens door for them to respond',
            variations: [
              'Agreed! This is a nice party. I\'m [name].',
              'For sure! I\'m [name] - friend of [host] from [context].'
            ]
          }
        ],
        difficulty_level: 1,
        tags: ['small_talk', 'party'],
        created_at: new Date()
      },
      {
        id: 9,
        event_type: 'casual',
        scenario_name: 'Declining Social Plans',
        description: 'A colleague invites you to drinks after work, but you\'re feeling overwhelmed and need downtime.',
        example_dialogue: [
          { speaker: 'them', text: 'Hey, a few of us are going for drinks after work. You should come!' },
          { speaker: 'narrator', text: 'They seem enthusiastic and expecting you to say yes' }
        ],
        suggested_responses: [
          {
            context: 'Polite decline',
            response: 'Thanks for inviting me! I can\'t make it tonight, but I appreciate you thinking of me. Have fun!',
            why_it_works: 'Grateful, clear no, wishes them well',
            variations: [
              'That sounds fun! I have plans already, but thanks for asking.',
              'I wish I could, but I need to head home tonight. Maybe next time?'
            ]
          },
          {
            context: 'Leaving door open',
            response: 'I can\'t tonight, but I\'d love to join another time. Will you let me know about the next one?',
            why_it_works: 'Shows interest in future inclusion while maintaining boundary',
            variations: [
              'Not tonight, but please keep me in mind for next time!',
              'I need to pass today, but how about lunch later this week instead?'
            ]
          }
        ],
        difficulty_level: 2,
        tags: ['boundaries', 'declining_invitations'],
        created_at: new Date()
      }
    ];
  }

  /**
   * Create a custom scenario based on user's specific situation
   */
  static createCustomScenario(
    eventType: EventType,
    situation: string,
    userConcerns: string[]
  ): PracticeScenario {
    // This would be enhanced with AI in production
    const baseResponses: SuggestedResponse[] = [
      {
        context: 'General approach',
        response: '[Acknowledge] + [Your perspective/action] + [Engagement question]',
        why_it_works: 'Three-part structure works for most situations',
        variations: [
          'Show you heard them → Add your thoughts → Keep conversation going',
          'Validate their point → Share your view → Ask for their input'
        ]
      }
    ];

    // Add specific responses based on concerns
    if (userConcerns.includes('anxiety')) {
      baseResponses.push({
        context: 'When feeling anxious',
        response: 'Take a breath, then: "That\'s interesting, let me think about that for a moment"',
        why_it_works: 'Buys time while appearing thoughtful',
        variations: [
          '"Good point. Give me a second to consider that"',
          '"Hmm, I hadn\'t thought of it that way" [pause to collect thoughts]'
        ]
      });
    }

    return {
      id: Date.now(),
      event_type: eventType,
      scenario_name: 'Custom Scenario',
      description: situation,
      example_dialogue: [
        { speaker: 'narrator', text: situation }
      ],
      suggested_responses: baseResponses,
      difficulty_level: 2,
      tags: ['custom', ...userConcerns],
      created_at: new Date()
    };
  }
}