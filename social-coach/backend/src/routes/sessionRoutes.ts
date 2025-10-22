import { Router } from 'express';
import sessionController from '../controllers/sessionController';

const router = Router();

// User routes
router.post('/users', sessionController.createUser.bind(sessionController));
router.get('/users/:userId', sessionController.getUser.bind(sessionController));

// Session management routes
router.post('/sessions', sessionController.createSession.bind(sessionController));
router.get('/sessions/:sessionId', sessionController.getSession.bind(sessionController));
router.get('/users/:userId/sessions', sessionController.getUserSessions.bind(sessionController));

// Step 1: Context Check-In
router.post('/sessions/:sessionId/context', sessionController.submitContext.bind(sessionController));

// Step 2: Emotional Calibration
router.post('/sessions/:sessionId/emotional', sessionController.submitEmotional.bind(sessionController));

// Step 3: Checklist
router.put('/sessions/:sessionId/checklist', sessionController.updateChecklist.bind(sessionController));
router.post('/sessions/:sessionId/advance-to-practice', sessionController.advanceToPractice.bind(sessionController));

// Step 4: Practice Scenarios
router.post('/sessions/:sessionId/practice/:scenarioId', sessionController.submitPracticeResponse.bind(sessionController));
router.post('/sessions/:sessionId/advance-to-live', sessionController.advanceToLive.bind(sessionController));

// Step 5: Live Support
router.post('/sessions/:sessionId/live-support', sessionController.requestLiveSupport.bind(sessionController));
router.post('/sessions/:sessionId/advance-to-reflection', sessionController.advanceToReflection.bind(sessionController));

// Step 6: Reflection
router.post('/sessions/:sessionId/reflection', sessionController.submitReflection.bind(sessionController));

export default router;
