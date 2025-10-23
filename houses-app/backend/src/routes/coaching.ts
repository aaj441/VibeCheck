import express from 'express';
import { CoachingService } from '../services/coachingService';

const router = express.Router();
const coachingService = new CoachingService();

// Create new coaching session
router.post('/session', (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const session = coachingService.createSession(userId);
    res.json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Get coaching session
router.get('/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = coachingService.getSession(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error getting session:', error);
    res.status(500).json({ error: 'Failed to get session' });
  }
});

// Step 1: Context Check-In
router.post('/session/:sessionId/context', (req, res) => {
  try {
    const { sessionId } = req.params;
    const contextData = req.body;

    const session = coachingService.processContextCheckIn(sessionId, contextData);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error processing context check-in:', error);
    res.status(500).json({ error: 'Failed to process context check-in' });
  }
});

// Step 2: Emotional Calibration
router.post('/session/:sessionId/emotional-calibration', (req, res) => {
  try {
    const { sessionId } = req.params;
    const emotionalData = req.body;

    const session = coachingService.processEmotionalCalibration(sessionId, emotionalData);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error processing emotional calibration:', error);
    res.status(500).json({ error: 'Failed to process emotional calibration' });
  }
});

// Step 3: Generate Checklist
router.get('/session/:sessionId/checklist', (req, res) => {
  try {
    const { sessionId } = req.params;
    const checklist = coachingService.generateChecklist(sessionId);
    
    // Update session with checklist
    coachingService.updateSession(sessionId, { checklist });
    
    res.json({ checklist });
  } catch (error) {
    console.error('Error generating checklist:', error);
    res.status(500).json({ error: 'Failed to generate checklist' });
  }
});

// Update checklist item
router.patch('/session/:sessionId/checklist/:itemId', (req, res) => {
  try {
    const { sessionId, itemId } = req.params;
    const { completed } = req.body;
    
    const session = coachingService.getSession(sessionId);
    if (!session || !session.data.checklist) {
      return res.status(404).json({ error: 'Session or checklist not found' });
    }

    const item = session.data.checklist.find(item => item.id === itemId);
    if (!item) {
      return res.status(404).json({ error: 'Checklist item not found' });
    }

    item.completed = completed;
    coachingService.updateSession(sessionId, { checklist: session.data.checklist });
    
    res.json({ success: true, item });
  } catch (error) {
    console.error('Error updating checklist item:', error);
    res.status(500).json({ error: 'Failed to update checklist item' });
  }
});

// Step 4: Generate Practice Scenarios
router.get('/session/:sessionId/practice-scenarios', (req, res) => {
  try {
    const { sessionId } = req.params;
    const scenarios = coachingService.generatePracticeScenarios(sessionId);
    
    // Update session with scenarios
    coachingService.updateSession(sessionId, { practiceScenarios: scenarios });
    
    res.json({ scenarios });
  } catch (error) {
    console.error('Error generating practice scenarios:', error);
    res.status(500).json({ error: 'Failed to generate practice scenarios' });
  }
});

// Submit practice response
router.post('/session/:sessionId/practice/:scenarioId/response', (req, res) => {
  try {
    const { sessionId, scenarioId } = req.params;
    const { userResponse } = req.body;
    
    const session = coachingService.getSession(sessionId);
    if (!session || !session.data.practiceScenarios) {
      return res.status(404).json({ error: 'Session or scenarios not found' });
    }

    const scenario = session.data.practiceScenarios.find(s => s.id === scenarioId);
    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found' });
    }

    scenario.userResponse = userResponse;
    
    // Generate feedback
    const feedback = generatePracticeFeedback(userResponse, scenario.suggestedResponse);
    scenario.feedback = feedback;
    
    coachingService.updateSession(sessionId, { practiceScenarios: session.data.practiceScenarios });
    
    res.json({ feedback, scenario });
  } catch (error) {
    console.error('Error processing practice response:', error);
    res.status(500).json({ error: 'Failed to process practice response' });
  }
});

// Step 5: Live Support
router.post('/session/:sessionId/live-support', (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userInput } = req.body;
    
    const analysis = coachingService.analyzeLiveInteraction(sessionId, userInput);
    
    const supportEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      userInput,
      suggestion: analysis.suggestions[0] || 'You\'re doing great! Stay present and be yourself.',
      sentimentAnalysis: analysis
    };

    const session = coachingService.getSession(sessionId);
    if (session) {
      const liveSupport = session.data.liveSupport || [];
      liveSupport.push(supportEntry);
      coachingService.updateSession(sessionId, { liveSupport });
    }
    
    res.json(supportEntry);
  } catch (error) {
    console.error('Error processing live support:', error);
    res.status(500).json({ error: 'Failed to process live support' });
  }
});

// Step 6: Post-Interaction Reflection
router.post('/session/:sessionId/reflection', (req, res) => {
  try {
    const { sessionId } = req.params;
    const reflectionData = req.body;
    
    const session = coachingService.updateSession(sessionId, { reflection: reflectionData });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Generate follow-up suggestions
    const followUpActions = generateFollowUpActions(reflectionData, session);
    session.data.reflection!.followUpActions = followUpActions;
    
    res.json(session.data.reflection);
  } catch (error) {
    console.error('Error processing reflection:', error);
    res.status(500).json({ error: 'Failed to process reflection' });
  }
});

// Get neurodivergent adaptations
router.get('/adaptations/:type', (req, res) => {
  try {
    const { type } = req.params;
    const adaptations = coachingService.getNeuroAdaptations(type as any);
    res.json({ adaptations });
  } catch (error) {
    console.error('Error getting adaptations:', error);
    res.status(500).json({ error: 'Failed to get adaptations' });
  }
});

// Helper function to generate practice feedback
function generatePracticeFeedback(userResponse: string, suggestedResponse: string): string {
  const feedback = [
    "Great job practicing! Here's some feedback:",
  ];
  
  if (userResponse.length < 10) {
    feedback.push("• Try expanding your response a bit more to show engagement");
  } else {
    feedback.push("• Good length - you're providing enough detail without overwhelming");
  }
  
  if (userResponse.toLowerCase().includes('i') || userResponse.toLowerCase().includes('my')) {
    feedback.push("• Nice use of personal examples - this helps build connection");
  }
  
  if (userResponse.includes('?')) {
    feedback.push("• Excellent! Asking questions shows genuine interest");
  } else {
    feedback.push("• Consider adding a question to keep the conversation flowing");
  }
  
  feedback.push("• Remember: authenticity is more important than perfection");
  
  return feedback.join('\n');
}

// Helper function to generate follow-up actions
function generateFollowUpActions(reflection: any, session: any): string[] {
  const actions = [
    "Take time to rest and recharge",
    "Hydrate and have a healthy snack"
  ];
  
  if (reflection.whatWorked) {
    actions.push("Write down what worked well to remember for next time");
  }
  
  if (reflection.whatWasTough) {
    actions.push("Reflect on challenging moments without judgment");
    actions.push("Consider what support might help in similar situations");
  }
  
  if (session.eventType === 'date' && reflection.whatWorked) {
    actions.push("If interested, plan a follow-up message or second date");
  }
  
  if (session.eventType === 'interview') {
    actions.push("Send a thank-you email within 24 hours");
    actions.push("Note any questions that came up for future interviews");
  }
  
  actions.push("Celebrate that you took this brave step!");
  
  return actions;
}

export { router as coachingRoutes };