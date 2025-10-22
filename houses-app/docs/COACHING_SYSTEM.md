# Social Interaction Coach for Neurodivergent Users

## Overview

This system provides empathetic, step-by-step coaching for neurodivergent individuals preparing for social interactions including dates, interviews, networking events, and casual social situations. The system is designed with ADHD, autism, and social anxiety considerations built-in.

## Architecture

### Backend (`/backend`)
- **Express.js** server with TypeScript
- **RESTful API** for coaching sessions
- **In-memory storage** for session data (easily extensible to database)
- **Modular service architecture** for easy maintenance

### Frontend (`/frontend`)
- **Next.js 14** with TypeScript
- **Tailwind CSS** for accessible, sensory-friendly design
- **Responsive design** with mobile-first approach
- **Progressive enhancement** for various accessibility needs

## The 6-Step Coaching Process

### 1. Context Check-In
- **Purpose**: Understand the upcoming event and user's current emotional state
- **Inputs**: Event type, feelings, setting, attendees, personal goals
- **Adaptations**: Visual event type selection, open-ended feeling expression

### 2. Emotional Calibration
- **Purpose**: Assess current emotional state and identify triggers
- **Inputs**: Mood sliders (anxiety, excitement, energy, focus), worries, triggers
- **Adaptations**: Visual sliders, pre-populated common concerns, custom input options

### 3. Personalized Checklist
- **Purpose**: Generate custom preparation checklist based on user needs
- **Features**: 
  - Event-specific items (date vs interview vs networking)
  - Trigger-based adaptations (sensory needs, anxiety management)
  - Priority levels and categories
  - Progress tracking with visual feedback

### 4. Practice & Simulation
- **Purpose**: Safe space to practice responses and receive gentle feedback
- **Features**:
  - Scenario-based practice
  - Suggested responses as examples
  - Constructive, encouraging feedback
  - Multiple scenarios per event type

### 5. Live Interaction Support
- **Purpose**: Real-time support during the actual event
- **Features**:
  - Quick update messaging
  - Sentiment analysis of user input
  - Immediate encouragement and suggestions
  - Emergency phrases and grounding techniques

### 6. Post-Interaction Reflection
- **Purpose**: Process the experience and celebrate growth
- **Features**:
  - Structured reflection on successes and challenges
  - Personalized follow-up action plan
  - Neurodivergent-affirming messaging
  - Growth-focused feedback

## Neurodivergent Adaptations

### ADHD Considerations
- Clear, step-by-step progression
- Visual progress indicators
- Fidget-friendly interface elements
- Processing time allowances
- Note-taking encouragement

### Autism Considerations
- Predictable navigation structure
- Sensory-friendly color palette
- Script preparation and practice
- Social cue interpretation help
- Routine and structure emphasis

### Social Anxiety Considerations
- Gentle, non-judgmental language
- Safety planning and exit strategies
- Grounding technique integration
- Confidence-building affirmations
- Stress management tools

### High Masking Considerations
- Authenticity encouragement
- Energy management awareness
- Unmasking support
- Value of unique perspectives

## Design Principles

### Accessibility
- **WCAG 2.1 AA compliance** target
- **High contrast mode** support
- **Reduced motion** preferences respected
- **Screen reader** friendly markup
- **Keyboard navigation** support

### Sensory Considerations
- **Calming color palette** (blues, soft greens, warm grays)
- **Gentle animations** with reduced motion options
- **Clear typography** with good contrast
- **Minimal sensory overload** design
- **Customizable interface** elements

### Emotional Safety
- **Non-judgmental language** throughout
- **Progress over perfection** messaging
- **Celebration of small wins**
- **Trauma-informed design** principles
- **User agency and control** emphasis

## API Endpoints

### Session Management
- `POST /api/coaching/session` - Create new session
- `GET /api/coaching/session/:id` - Get session data

### Step Processing
- `POST /api/coaching/session/:id/context` - Submit context check-in
- `POST /api/coaching/session/:id/emotional-calibration` - Submit emotional data
- `GET /api/coaching/session/:id/checklist` - Generate personalized checklist
- `PATCH /api/coaching/session/:id/checklist/:itemId` - Update checklist item
- `GET /api/coaching/session/:id/practice-scenarios` - Get practice scenarios
- `POST /api/coaching/session/:id/practice/:scenarioId/response` - Submit practice response
- `POST /api/coaching/session/:id/live-support` - Live interaction support
- `POST /api/coaching/session/:id/reflection` - Post-interaction reflection

### Utilities
- `GET /api/coaching/adaptations/:type` - Get neurodivergent adaptations

## Future Enhancements

### Technical
- Database integration (PostgreSQL/MongoDB)
- User authentication and profiles
- Session persistence and history
- Real-time WebSocket support
- Mobile app development

### Features
- AI-powered response analysis
- Community support features
- Therapist/coach integration
- Custom trigger management
- Progress tracking over time
- Peer mentorship matching

### Accessibility
- Voice interface support
- Alternative communication methods
- Customizable sensory settings
- Integration with assistive technologies
- Multi-language support

## Getting Started

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Create `.env` files in both backend and frontend directories with appropriate configuration.

## Contributing

When contributing to this project, please keep in mind:
- **Neurodivergent users are the priority** - all decisions should center their needs
- **Accessibility is not optional** - every feature must be accessible
- **Language matters** - use person-first, strengths-based language
- **Test with real users** - especially neurodivergent individuals
- **Trauma-informed approach** - consider the emotional impact of all interactions

## Support and Resources

This system is designed to complement, not replace, professional support. Users are encouraged to:
- Work with therapists, coaches, or counselors
- Connect with neurodivergent communities
- Seek medical support for mental health needs
- Use this tool as one part of a broader support network

---

*Built with 💙 for the neurodivergent community*