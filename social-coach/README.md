# Social Interaction Coach for Neurodivergent Users

A comprehensive, empathetic coaching system designed to support neurodivergent individuals (ADHD, autism, social anxiety) in navigating social interactions including dates, interviews, and networking events.

## 🌟 Features

### Core Functionality
- **Context Check-In**: Personalized session setup based on event type and current feelings
- **Emotional Calibration**: Mood tracking with anxiety, excitement, energy, and focus levels
- **Personalized Checklists**: Adaptive preparation lists based on neurodivergent profiles
- **Practice Scenarios**: Role-play simulations with real-time feedback
- **Live Interaction Support**: Real-time sentiment analysis and coaching during events
- **Post-Interaction Reflection**: Structured reflection and progress tracking

### Neurodivergent-Specific Support
- **ADHD Adaptations**: Reminders, micro-steps, and focus aids
- **Autism Support**: Scripts, literal communication, sensory considerations
- **Social Anxiety Tools**: Grounding techniques, exit strategies, boundary setting
- **High Masking Support**: Recovery planning and unmasking reminders

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 13+
- Git

### Installation

1. Clone the repository:
```bash
cd /workspace/social-coach
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials and JWT secret
```

4. Set up the database:
```bash
# Create database
createdb social_coach

# Run migrations
psql -d social_coach -f ../database/migrations/001_initial_schema.sql
```

5. Start the backend server:
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## 📚 API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Body: {
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}
```

#### Login
```
POST /api/auth/login
Body: {
  "email": "user@example.com",
  "password": "password123"
}
```

### Session Management

#### Create Coaching Session (Step 1)
```
POST /api/sessions/create
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "event_type": "date|interview|networking|casual|other",
  "feelings": "anxious but excited",
  "setting": "in-person|online|group|one-on-one",
  "participants": "Coffee date with Sarah",
  "goal": "Have a relaxed conversation and see if we connect",
  "event_date": "2024-01-15T18:00:00Z" (optional)
}
```

#### Emotional Calibration (Step 2)
```
POST /api/sessions/:sessionId/emotional-state
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "anxiety_level": 7,
  "excitement_level": 6,
  "energy_level": 5,
  "focus_level": 4,
  "specific_worries": ["awkward silences", "eye contact", "what to talk about"]
}
```

### Checklist Generation

#### Generate Personalized Checklist
```
POST /api/checklists/:sessionId/generate
Headers: { "Authorization": "Bearer <token>" }
```

#### Update Checklist Progress
```
PATCH /api/checklists/:sessionId/items
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "checklist_items": [
    {
      "id": "item_id",
      "text": "Set departure time with buffer",
      "category": "preparation",
      "completed": true,
      "priority": "high"
    }
  ]
}
```

### Practice Scenarios

#### Get Practice Scenarios
```
GET /api/practice/scenarios?event_type=date&difficulty=1
Headers: { "Authorization": "Bearer <token>" }
```

#### Submit Practice Response
```
POST /api/practice/respond
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "scenario_id": 1,
  "response": "Hi! Yes, it's great to meet you too! How was your journey here?",
  "session_id": 123 (optional)
}
```

### Live Interaction Support

#### Get Real-Time Support
```
POST /api/live/support
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "session_id": 123,
  "interaction_text": "I'm feeling really overwhelmed right now",
  "current_state": "anxious" (optional)
}
```

#### Get Conversation Help
```
POST /api/live/conversation-help
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "session_id": 123,
  "your_message": "I'm not sure what to say",
  "their_message": "What do you like to do for fun?"
}
```

#### Quick Grounding Exercise
```
GET /api/live/grounding/:intensity (low|medium|high)
Headers: { "Authorization": "Bearer <token>" }
```

### Post-Interaction Reflection

#### Submit Reflection
```
POST /api/reflections/:sessionId
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "what_worked": ["arrival on time", "used prepared topics", "set boundaries clearly"],
  "what_was_tough": ["maintaining eye contact", "awkward goodbye"],
  "overall_rating": 7,
  "additional_notes": "Proud of myself for going!"
}
```

### Progress Tracking

#### Get Progress Overview
```
GET /api/progress/overview
Headers: { "Authorization": "Bearer <token>" }
```

#### Get Achievement Milestones
```
GET /api/progress/achievements
Headers: { "Authorization": "Bearer <token>" }
```

## 🧠 Usage Flow

### Before the Event
1. Create a new coaching session with event details
2. Complete emotional calibration
3. Review and customize your personalized checklist
4. Practice with relevant scenarios
5. Save grounding techniques for quick access

### During the Event
1. Update session status to "in-progress"
2. Use live support for real-time coaching
3. Access grounding exercises if overwhelmed
4. Get conversation suggestions when stuck

### After the Event
1. Complete reflection while memory is fresh
2. Review progress and insights
3. Celebrate achievements
4. Plan follow-up actions

## 🔧 Configuration

### User Profile Customization
Update your neurodivergent profile for better personalization:
```
PUT /api/profile
Body: {
  "neurodivergent_types": ["ADHD", "social_anxiety"],
  "sensory_preferences": {
    "noise_sensitivity": 8,
    "light_sensitivity": 6,
    "touch_sensitivity": 7,
    "smell_sensitivity": 5,
    "crowd_tolerance": 4
  },
  "communication_preferences": {
    "prefers_written": true,
    "needs_processing_time": true,
    "prefers_direct_communication": false,
    "struggles_with_eye_contact": true,
    "prefers_structured_conversations": true,
    "needs_clear_expectations": true
  },
  "triggers": ["loud noises", "unexpected changes", "small talk"],
  "comfort_strategies": ["fidget cube", "breathing exercises", "prepared scripts"]
}
```

## 🎯 Best Practices

1. **Be Honest**: The more accurate your emotional calibration, the better the support
2. **Practice Regularly**: Use practice scenarios even when you don't have events
3. **Customize Freely**: Add your own checklist items and comfort strategies
4. **Track Progress**: Regular reflections help identify patterns
5. **Celebrate Small Wins**: Every interaction is a learning opportunity

## 🛡️ Privacy & Security

- All data is encrypted in transit (HTTPS)
- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- Personal data is never shared
- You can delete your account and all data at any time

## 🤝 Support

Remember: This tool is designed to support, not replace, professional therapy or medical advice. If you're struggling, please reach out to a mental health professional.

## 📈 Future Enhancements

- Mobile app for on-the-go support
- Voice-based practice sessions
- Integration with calendar apps
- Community support features
- AI-powered conversation analysis
- Wearable device integration for real-time anxiety detection

## 🙏 Acknowledgments

Built with love and understanding for the neurodivergent community. Your unique perspective is valuable, and you deserve support that works for your brain.

---

*"You are not broken. You are not wrong. You are navigating a world that wasn't designed for your neurotype, and that takes incredible strength."*