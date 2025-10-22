# 🌟 Social Interaction Coach for Neurodivergent Users

A comprehensive, empathetic coaching application designed to support neurodivergent individuals (ADHD, Autism, Social Anxiety) through social interactions including dates, interviews, networking events, and casual gatherings.

## 🎯 Features

### 6-Step Coaching Process

1. **Context Check-In** - Understand the upcoming event type, setting, and personal goals
2. **Emotional Calibration** - Mood sliders, trigger identification, and sensory needs assessment
3. **Personalized Checklist Generator** - Customized preparation lists based on user context and emotional state
4. **Practice/Simulation Phase** - Interactive scenarios with modeled responses and gentle feedback
5. **Live Interaction Support** - Real-time sentiment analysis, suggestions, and grounding techniques
6. **Post-Interaction Reflection** - Structured feedback and actionable insights for growth

### Key Capabilities

- ✅ **Highly Personalized** - Adapts to ADHD, autism, social anxiety, and individual triggers
- ✅ **Step-by-Step Guidance** - Clear, structured process with visual progress tracking
- ✅ **Practice Scenarios** - Safe environment to rehearse responses before real interactions
- ✅ **Live Support** - Real-time coaching during events with sentiment detection
- ✅ **Grounding Techniques** - Immediate support for overwhelm with proven calming methods
- ✅ **No Judgment Zone** - Encouraging, affirming language throughout
- ✅ **Progress Tracking** - Session history and reflection for continuous improvement

## 🏗️ Architecture

### Backend (Node.js + TypeScript)
- **Framework**: Express.js
- **Database**: SQLite (easily portable, no external database required)
- **API**: RESTful endpoints for all coaching phases
- **Services**:
  - Checklist Generator - Context-aware item creation
  - Practice Scenarios - Event-specific scenario generation
  - Live Support - Sentiment analysis and suggestion engine

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (fast development and building)
- **Styling**: Custom CSS with accessible design
- **State Management**: React hooks
- **API Communication**: Axios

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Git

### Setup

1. **Clone the repository**
```bash
cd /workspace/social-coach
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Configure Backend Environment**
```bash
cp .env.example .env
# Edit .env if needed (default settings work fine)
```

4. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

## 🚀 Running the Application

### Development Mode

1. **Start Backend Server** (Terminal 1)
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:3001`

2. **Start Frontend Dev Server** (Terminal 2)
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:3000`

3. **Access the Application**
Open your browser to `http://localhost:3000`

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 📁 Project Structure

```
social-coach/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   │   ├── checklistGenerator.ts
│   │   │   ├── practiceScenarios.ts
│   │   │   └── liveSupport.ts
│   │   ├── types/             # TypeScript types
│   │   ├── database.ts        # Database connection
│   │   └── server.ts          # Express app
│   ├── database/
│   │   └── migrations/        # Database schema
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── ContextCheckIn.tsx
│   │   │   ├── EmotionalCalibration.tsx
│   │   │   ├── ChecklistView.tsx
│   │   │   ├── PracticePhase.tsx
│   │   │   ├── LiveSupport.tsx
│   │   │   └── ReflectionPhase.tsx
│   │   ├── services/          # API client
│   │   ├── styles/            # CSS styles
│   │   ├── types/             # TypeScript types
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
│
└── README.md
```

## 🎨 Design Philosophy

### Neurodivergent-Friendly Design
- **Clear Visual Hierarchy** - Organized, uncluttered interface
- **Progressive Disclosure** - One step at a time, no overwhelming walls of text
- **Explicit Instructions** - No assumptions, everything spelled out
- **Emotional Support** - Affirming language, celebration of small wins
- **Flexible Pacing** - Users control their progress, no time pressure
- **Customization** - Adapts to individual triggers, needs, and preferences

### Language Guidelines
- ✅ Use direct, clear language
- ✅ Provide specific examples
- ✅ Acknowledge difficulty without shame
- ✅ Celebrate effort, not just outcomes
- ✅ Offer alternatives and "outs"
- ❌ No vague suggestions
- ❌ No toxic positivity
- ❌ No pressure or judgment

## 🧪 Testing

The application can be tested manually through the UI:

1. **Create a new session** - Start from home page
2. **Fill out context** - Choose "Job Interview" and anxious mood
3. **Complete emotional calibration** - Set high anxiety, add triggers
4. **Review checklist** - Verify customized items appear
5. **Practice scenarios** - Submit responses and review feedback
6. **Test live support** - Try "I'm feeling overwhelmed"
7. **Complete reflection** - Fill out the reflection form

## 🔒 Privacy & Data

- All data stored locally in SQLite database
- No external API calls or data transmission
- User data never leaves your server
- Can be run completely offline after initial setup
- Session data can be cleared anytime

## 🛠️ Troubleshooting

### Backend won't start
- Check that port 3001 is not in use
- Verify Node.js version: `node --version` (should be 18+)
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Frontend won't connect to backend
- Ensure backend is running on port 3001
- Check browser console for error messages
- Verify proxy settings in `vite.config.ts`

### Database errors
- Delete the database file and restart: `rm backend/database/social-coach.db`
- Database will be recreated automatically on restart

## 🌈 Future Enhancements

- [ ] User profiles with saved preferences
- [ ] Multi-language support
- [ ] Voice-to-text for accessibility
- [ ] Mobile app version
- [ ] Session export/sharing (anonymized)
- [ ] Community-contributed scenarios
- [ ] Integration with calendar apps
- [ ] Reminder notifications

## 📄 License

This project is open source and available for personal and educational use.

## 🤝 Contributing

Contributions are welcome! This project aims to serve the neurodivergent community with empathy and respect.

Areas for contribution:
- Additional practice scenarios
- Improved sentiment analysis
- Accessibility enhancements
- Localization
- UI/UX improvements
- Bug fixes and testing

## 💜 Acknowledgments

Built with understanding and empathy for neurodivergent individuals navigating social interactions. Everyone deserves support, preparation, and the confidence to be themselves.

---

**Remember:** You are not broken. You are not too much or not enough. You are navigating a world that wasn't designed for you, and that takes incredible strength. This tool is here to support you, not fix you. 💜
