# Social Coach System Design

## Architecture Overview

The Social Interaction Coach is built as a REST API with a PostgreSQL database, designed with neurodivergent users' needs at its core.

### Key Design Principles

1. **Empathy-First Design**: Every feature considers the unique challenges of ADHD, autism, social anxiety, and high masking
2. **Flexibility**: Users can customize every aspect based on their specific needs
3. **Non-Judgmental**: Language and features avoid shame or pressure
4. **Privacy-Focused**: Sensitive data is protected and never shared
5. **Progressive Disclosure**: Information is presented in manageable chunks

## System Components

### 1. Context & Emotional System
- **Purpose**: Understand the user's current state and upcoming challenge
- **Adaptations**: 
  - Simple 1-10 scales for easy quantification
  - Multiple check-ins to catch changes in state
  - Immediate validation and support messages

### 2. Checklist Generator
- **Purpose**: Provide personalized, actionable preparation steps
- **Neurodivergent Features**:
  - ADHD: Micro-steps, multiple reminders, time buffers
  - Autism: Detailed scripts, sensory preparations, venue research
  - Social Anxiety: Exit strategies, grounding techniques, bathroom break planning
  - High Masking: Recovery time, energy management, unmasking reminders

### 3. Practice Scenario System
- **Purpose**: Safe environment to rehearse interactions
- **Key Features**:
  - Multiple difficulty levels
  - Specific feedback on strengths (not just corrections)
  - Variations for different neurotypes
  - Custom scenario creation for specific worries

### 4. Live Interaction Support
- **Purpose**: Real-time coaching during actual events
- **Sentiment Analysis**: Detects emotional state from text
- **Immediate Actions**: Grounding exercises for overwhelm
- **Sample Responses**: Reduces cognitive load in the moment

### 5. Reflection & Progress Tracking
- **Purpose**: Build self-awareness and celebrate growth
- **Design Choices**:
  - Focus on "what worked" first (positive reinforcement)
  - No comparison to others
  - Progress measured against personal baseline
  - Achievement system for motivation

## Database Design Rationale

### User Profiles Table
- Stores neurodivergent types as array (many people have multiple)
- Sensory preferences as detailed JSON (highly individual)
- Separate triggers and comfort strategies (user-defined)

### Coaching Sessions Table
- Links all related data to a specific event
- Status tracking for different phases
- Flexible participant field (no assumptions about relationships)

### Emotional States Table
- Time-series data to track patterns
- Multiple dimensions (not just "anxiety")
- Linked to sessions for context

### Practice Scenarios Table
- Pre-seeded with common situations
- Tagged for easy filtering
- Difficulty levels for progressive challenge

## API Design Philosophy

### Step-by-Step Flow
Each endpoint represents one step in the process:
1. Create session → 2. Emotional check-in → 3. Generate checklist → etc.

This prevents overwhelm and allows users to take breaks between steps.

### Encouraging Responses
Every API response includes:
- The requested data
- Supportive messages
- Next steps
- Tips or reminders

### Error Handling
- Never blame the user
- Provide clear, actionable error messages
- Suggest alternatives when something fails

## Security Considerations

1. **Authentication**: JWT tokens with reasonable expiration
2. **Data Isolation**: Users can only access their own data
3. **Sensitive Data**: Emotional states and reflections are never exposed publicly
4. **Password Security**: Bcrypt hashing with salt rounds
5. **CORS**: Configured for specific frontend origin

## Accessibility Features

1. **Clear Language**: Avoid jargon and ambiguous terms
2. **Structured Data**: Consistent formats for predictability
3. **Detailed Descriptions**: Every item includes tips/explanations
4. **Multiple Formats**: Checklists, scripts, and step-by-step guides
5. **Customizable**: Users can modify anything to fit their needs

## Future Enhancements

### Near Term
- Webhooks for reminder notifications
- Audio practice sessions for non-readers
- Integration with calendar apps
- Peer support features (opt-in)

### Long Term
- ML-based pattern recognition for personalized insights
- Voice analysis for practice sessions
- Wearable integration for real-time anxiety detection
- Therapist portal for professional collaboration

## Ethical Considerations

1. **Not a Replacement**: Clear messaging that this supplements, not replaces, professional help
2. **Data Ownership**: Users can export/delete all their data
3. **No Diagnostic Claims**: We support, we don't diagnose
4. **Inclusive Language**: Avoid functioning labels or deficit-based language
5. **User Agency**: Every feature is optional and customizable

## Performance Optimizations

1. **Database Indexes**: On foreign keys and frequently queried fields
2. **JSON Aggregation**: Reduce query counts with PostgreSQL JSON features
3. **Caching Strategy**: Cache scenarios and static content
4. **Pagination**: For progress history and long lists
5. **Connection Pooling**: Reuse database connections

## Monitoring & Improvement

1. **Error Logging**: Track failures to improve system
2. **Usage Analytics**: Understand which features help most (anonymized)
3. **Feedback Loops**: Built-in feedback collection
4. **A/B Testing**: For new features and copy changes
5. **Performance Metrics**: Response times and system health

---

This system is built with love and deep respect for the neurodivergent community. Every design decision prioritizes user well-being over technical elegance.