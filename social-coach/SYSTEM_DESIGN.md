# 🏗️ System Design Document

## Social Interaction Coach for Neurodivergent Users

### Architecture Overview

The application follows a **client-server architecture** with a React frontend and Node.js/Express backend, connected via RESTful API.

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Context   │→ │ Emotional  │→ │ Checklist  │→ ...       │
│  │  Check-In  │  │ Calibration│  │    View    │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│                         ↓ API Calls                         │
└─────────────────────────┼───────────────────────────────────┘
                          ↓
┌─────────────────────────┼───────────────────────────────────┐
│                    Backend (Node.js)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Routes & Controllers                     │   │
│  │  (Session management, phase transitions)             │   │
│  └──────────────────────┬───────────────────────────────┘   │
│                         ↓                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   Services Layer                      │   │
│  │  ┌─────────────────┐  ┌──────────────────┐          │   │
│  │  │   Checklist     │  │    Practice      │          │   │
│  │  │   Generator     │  │    Scenarios     │          │   │
│  │  └─────────────────┘  └──────────────────┘          │   │
│  │  ┌─────────────────────────────────────────┐        │   │
│  │  │         Live Support Service             │        │   │
│  │  │  (Sentiment analysis, suggestions)       │        │   │
│  │  └─────────────────────────────────────────┘        │   │
│  └──────────────────────┬───────────────────────────────┘   │
│                         ↓                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Database Layer (SQLite)                  │   │
│  │  Users | Sessions | Activity Log                     │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Session Management (Backend)

**Responsibilities:**
- Create and manage coaching sessions
- Track user progress through phases
- Store session data (context, emotional state, checklists, etc.)
- Maintain activity logs for debugging and improvement

**Key Files:**
- `backend/src/models/sessionModel.ts` - Database operations
- `backend/src/controllers/sessionController.ts` - Business logic
- `backend/src/routes/sessionRoutes.ts` - API endpoints

**Session State Machine:**
```
context → emotional → checklist → practice → live → reflection → completed
```

---

### 2. Checklist Generator Service

**Purpose:** Creates personalized checklists based on event type, setting, emotional state, and triggers.

**Algorithm:**
1. Add universal items (comfort, grounding)
2. Add event-specific items (date, interview, networking)
3. Add customizations based on:
   - Anxiety level (≥7 triggers additional support)
   - Specific worries (e.g., forgetting names)
   - Triggers (e.g., awkward pauses)
   - Sensory needs
4. Add setting-specific items (online vs in-person)

**Customization Rules:**
- High anxiety (≥7): Breathing exercises, headphones, extra grounding
- Name trigger: Memory strategies
- Awkward pause trigger: Conversation recovery phrases
- Overwhelm trigger: Emergency exit phrases
- Online setting: Tech check items
- Group setting: Listening-focused reminders

**Output:** Array of `ChecklistItem` objects with categories, priorities, and customization flags

---

### 3. Practice Scenario Generator

**Purpose:** Generate realistic, event-specific scenarios with sample responses

**Scenario Types by Event:**

| Event Type   | Scenarios                                                    |
|--------------|--------------------------------------------------------------|
| Date         | Getting to know them, awkward silence, boundaries, exit      |
| Interview    | Tell me about yourself, weakness question, tough Q, your Qs  |
| Networking   | Starting conversation, elevator pitch, joining group, contact|
| Casual       | Small talk, finding common ground                            |
| Universal    | Greeting, clarification, graceful exit                       |

**Feedback Algorithm:**
1. Analyze response length
2. Check for personal elements ("I", "my")
3. Check for engagement (questions, "you")
4. Check for politeness markers
5. Identify improvement areas
6. Return encouraging feedback with 2-3 suggestions

---

### 4. Live Support Service

**Purpose:** Real-time sentiment analysis and context-aware suggestions

**Sentiment Detection:**
```typescript
Input: User's description of current situation
↓
Keyword Analysis:
  - Overwhelmed: "overwhelmed", "can't handle", "panic", "meltdown"
  - Stressed: "nervous", "anxious", "uncomfortable", "struggling"  
  - Positive: "good", "great", "well", "enjoy"
  - Neutral: Default
↓
Generate Support Response:
  - Suggestions (3-5 actionable items)
  - Grounding prompt (if stressed/overwhelmed)
  - Affirmations
```

**Support Tiers:**

1. **Overwhelmed** (Emergency)
   - Permission to leave immediately
   - Exit phrases
   - Intensive grounding (5-4-3-2-1 technique)

2. **Stressed** (Elevated support)
   - Breathing exercises
   - Permission to pause
   - Fidget/comfort item reminder
   - Quick reset techniques

3. **Neutral** (Standard support)
   - Conversation tips
   - Active listening reminders
   - General encouragement

4. **Positive** (Reinforcement)
   - Celebration
   - Affirmation of authentic self
   - Encouragement to continue

**Context-Aware Additions:**
- "don't know what to say" → Conversation starters
- "awkward silence" → Silence normalization
- "want to leave" → Exit strategies
- "said something weird" → Recovery phrases

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT,
    preferences TEXT,  -- JSON: neurodivergent type, triggers, comfort items
    created_at DATETIME
);
```

### Sessions Table
```sql
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    current_phase TEXT,
    context TEXT,           -- JSON
    emotional TEXT,         -- JSON
    checklist TEXT,         -- JSON array
    practice_scenarios TEXT,-- JSON array
    live_supports TEXT,     -- JSON array
    reflection TEXT,        -- JSON
    completed INTEGER,
    created_at DATETIME,
    updated_at DATETIME
);
```

### Activity Log Table
```sql
CREATE TABLE activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    phase TEXT,
    action TEXT,
    data TEXT,  -- JSON
    timestamp DATETIME
);
```

---

## API Endpoints

### User Management
- `POST /api/users` - Create user
- `GET /api/users/:userId` - Get user info

### Session Management
- `POST /api/sessions` - Create session
- `GET /api/sessions/:sessionId` - Get session details
- `GET /api/users/:userId/sessions` - Get user's sessions

### Phase-Specific
- `POST /api/sessions/:sessionId/context` - Submit context
- `POST /api/sessions/:sessionId/emotional` - Submit emotional data
- `PUT /api/sessions/:sessionId/checklist` - Update checklist
- `POST /api/sessions/:sessionId/advance-to-practice` - Move to practice
- `POST /api/sessions/:sessionId/practice/:scenarioId` - Submit practice response
- `POST /api/sessions/:sessionId/advance-to-live` - Move to live support
- `POST /api/sessions/:sessionId/live-support` - Request live support
- `POST /api/sessions/:sessionId/advance-to-reflection` - Move to reflection
- `POST /api/sessions/:sessionId/reflection` - Submit reflection

---

## Frontend Component Hierarchy

```
App (main orchestrator)
├── ProgressIndicator
├── ContextCheckIn
├── EmotionalCalibration
├── ChecklistView
│   ├── ChecklistItem (multiple)
│   └── CategorySection (multiple)
├── PracticePhase
│   ├── ScenarioDisplay
│   ├── ResponseInput
│   └── FeedbackDisplay
├── LiveSupport
│   ├── SupportInput
│   └── SupportResponse (multiple)
│       ├── SentimentIndicator
│       ├── SuggestionsList
│       └── GroundingPrompt
└── ReflectionPhase
    ├── WorkedWellInput
    ├── ChallengesInput
    └── FeedbackDisplay
```

---

## State Management

**Frontend State:**
- `user` - Current user object (persisted to localStorage)
- `session` - Current coaching session
- `isLoading` - Loading states
- `error` - Error messages

**Backend State:**
- Stateless API (all state in database)
- Session phase tracking for validation

---

## Error Handling

### Backend
1. Try-catch blocks around all async operations
2. Descriptive error messages logged to console
3. Generic error messages to client (no sensitive data)
4. 400 for client errors, 500 for server errors

### Frontend
1. API call error boundaries
2. User-friendly error messages
3. Fallback to refresh on critical errors
4. Non-blocking errors for non-essential features

---

## Security & Privacy

- **No external API calls** - All processing local
- **No analytics or tracking** - Complete privacy
- **Local database** - Data never leaves server
- **No authentication** - Simple user ID in localStorage (can be enhanced)
- **Input sanitization** - All user input stored as-is (no XSS risk as it's not rendered as HTML except explicitly marked safe)

---

## Performance Considerations

- **SQLite** - Fast, serverless, no setup required
- **Lazy loading** - Components load only when needed
- **Debouncing** - Checklist updates debounced
- **Optimistic UI** - Immediate feedback on interactions
- **Small bundle size** - Minimal dependencies

---

## Accessibility

- Semantic HTML throughout
- ARIA labels where needed
- Keyboard navigation support
- Clear focus indicators
- High contrast text
- Readable font sizes
- Mobile-responsive design

---

## Testing Strategy

### Manual Testing Checklist
- [ ] Complete flow: context → reflection
- [ ] High anxiety customization
- [ ] Trigger-specific items
- [ ] All event types
- [ ] Practice scenario feedback
- [ ] Live support sentiment detection
- [ ] Reflection feedback generation
- [ ] Mobile responsive layout

### Future Automated Testing
- Unit tests for services (checklist generation, sentiment analysis)
- Integration tests for API endpoints
- E2E tests for user flows
- Accessibility testing

---

## Deployment Considerations

### Development
- `npm run dev` for both frontend and backend
- Hot reload enabled
- Source maps for debugging

### Production
- `npm run build` compiles TypeScript
- Frontend built to static files
- Can be served via Nginx, Apache, or Node
- Database migrations run automatically
- Environment variables for configuration

### Scaling
Current design suitable for:
- Personal use
- Small teams (< 100 users)
- Clinic/therapy practice

For larger scale:
- Replace SQLite with PostgreSQL
- Add Redis caching
- Implement rate limiting
- Add authentication system
- Deploy to cloud (AWS, Azure, Heroku)

---

## Extension Points

### Adding New Event Types
1. Add type to `types/index.ts`
2. Create scenarios in `practiceScenarios.ts`
3. Add checklist items in `checklistGenerator.ts`
4. Update frontend dropdown

### Adding New Languages
1. Create translation files
2. Wrap all user-facing strings
3. Add language selector to UI
4. Store preference in user object

### Custom Checklist Items
1. Add user preference storage
2. UI for custom item management
3. Merge custom with generated items

---

This design prioritizes **empathy, clarity, and adaptability** - core values for supporting neurodivergent users effectively.
