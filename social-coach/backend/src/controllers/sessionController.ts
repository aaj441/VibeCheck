import { Request, Response } from 'express';
import sessionModel from '../models/sessionModel';
import checklistGenerator from '../services/checklistGenerator';
import practiceScenarios from '../services/practiceScenarios';
import liveSupportService from '../services/liveSupport';
import { ContextCheckIn, EmotionalCalibration, Reflection, SessionPhase } from '../types';

export class SessionController {
  // Create a new user
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      const user = await sessionModel.createUser(name);
      res.status(201).json({ success: true, user });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ success: false, error: 'Failed to create user' });
    }
  }
  
  // Get user info
  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const user = await sessionModel.getUser(userId);
      
      if (!user) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }
      
      res.json({ success: true, user });
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).json({ success: false, error: 'Failed to get user' });
    }
  }
  
  // Create a new coaching session
  async createSession(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        res.status(400).json({ success: false, error: 'userId is required' });
        return;
      }
      
      const session = await sessionModel.createSession(userId);
      res.status(201).json({ success: true, session });
    } catch (error) {
      console.error('Error creating session:', error);
      res.status(500).json({ success: false, error: 'Failed to create session' });
    }
  }
  
  // Get session details
  async getSession(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;
      const session = await sessionModel.getSession(sessionId);
      
      if (!session) {
        res.status(404).json({ success: false, error: 'Session not found' });
        return;
      }
      
      res.json({ success: true, session });
    } catch (error) {
      console.error('Error getting session:', error);
      res.status(500).json({ success: false, error: 'Failed to get session' });
    }
  }
  
  // Get all sessions for a user
  async getUserSessions(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const sessions = await sessionModel.getUserSessions(userId);
      res.json({ success: true, sessions });
    } catch (error) {
      console.error('Error getting user sessions:', error);
      res.status(500).json({ success: false, error: 'Failed to get sessions' });
    }
  }
  
  // Step 1: Submit context check-in
  async submitContext(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;
      const contextData: ContextCheckIn = req.body;
      
      const session = await sessionModel.getSession(sessionId);
      if (!session) {
        res.status(404).json({ success: false, error: 'Session not found' });
        return;
      }
      
      await sessionModel.updateSession(sessionId, {
        context: contextData,
        currentPhase: 'emotional'
      });
      
      await sessionModel.logActivity(sessionId, 'context', 'context_submitted', contextData);
      
      res.json({ 
        success: true, 
        message: 'Context saved. Moving to emotional calibration.',
        nextPhase: 'emotional'
      });
    } catch (error) {
      console.error('Error submitting context:', error);
      res.status(500).json({ success: false, error: 'Failed to submit context' });
    }
  }
  
  // Step 2: Submit emotional calibration
  async submitEmotional(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;
      const emotionalData: EmotionalCalibration = req.body;
      
      const session = await sessionModel.getSession(sessionId);
      if (!session) {
        res.status(404).json({ success: false, error: 'Session not found' });
        return;
      }
      
      if (!session.context) {
        res.status(400).json({ success: false, error: 'Must complete context check-in first' });
        return;
      }
      
      // Generate personalized checklist
      const checklist = checklistGenerator.generateChecklist(session.context, emotionalData);
      
      await sessionModel.updateSession(sessionId, {
        emotional: emotionalData,
        checklist,
        currentPhase: 'checklist'
      });
      
      await sessionModel.logActivity(sessionId, 'emotional', 'emotional_submitted', emotionalData);
      
      res.json({ 
        success: true, 
        message: 'Emotional calibration saved. Your personalized checklist is ready!',
        nextPhase: 'checklist',
        checklist
      });
    } catch (error) {
      console.error('Error submitting emotional calibration:', error);
      res.status(500).json({ success: false, error: 'Failed to submit emotional calibration' });
    }
  }
  
  // Step 3: Get/update checklist
  async updateChecklist(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;
      const { checklist } = req.body;
      
      await sessionModel.updateSession(sessionId, { checklist });
      await sessionModel.logActivity(sessionId, 'checklist', 'checklist_updated', null);
      
      res.json({ success: true, message: 'Checklist updated' });
    } catch (error) {
      console.error('Error updating checklist:', error);
      res.status(500).json({ success: false, error: 'Failed to update checklist' });
    }
  }
  
  async advanceToPractice(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;
      
      const session = await sessionModel.getSession(sessionId);
      if (!session || !session.context) {
        res.status(400).json({ success: false, error: 'Session not properly initialized' });
        return;
      }
      
      // Generate practice scenarios
      const scenarios = practiceScenarios.generateScenarios(
        session.context.eventType,
        session.context.setting
      );
      
      await sessionModel.updateSession(sessionId, {
        practiceScenarios: scenarios,
        currentPhase: 'practice'
      });
      
      res.json({
        success: true,
        message: 'Ready for practice scenarios!',
        nextPhase: 'practice',
        scenarios
      });
    } catch (error) {
      console.error('Error advancing to practice:', error);
      res.status(500).json({ success: false, error: 'Failed to advance to practice' });
    }
  }
  
  // Step 4: Submit practice response
  async submitPracticeResponse(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId, scenarioId } = req.params;
      const { response } = req.body;
      
      const session = await sessionModel.getSession(sessionId);
      if (!session || !session.practiceScenarios) {
        res.status(400).json({ success: false, error: 'Practice scenarios not initialized' });
        return;
      }
      
      // Find and update the scenario
      const scenario = session.practiceScenarios.find(s => s.id === scenarioId);
      if (!scenario) {
        res.status(404).json({ success: false, error: 'Scenario not found' });
        return;
      }
      
      scenario.userResponse = response;
      scenario.feedback = practiceScenarios.provideFeedback(scenario, response);
      
      await sessionModel.updateSession(sessionId, {
        practiceScenarios: session.practiceScenarios
      });
      
      await sessionModel.logActivity(sessionId, 'practice', 'practice_response_submitted', {
        scenarioId,
        response
      });
      
      res.json({
        success: true,
        feedback: scenario.feedback
      });
    } catch (error) {
      console.error('Error submitting practice response:', error);
      res.status(500).json({ success: false, error: 'Failed to submit practice response' });
    }
  }
  
  async advanceToLive(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;
      
      await sessionModel.updateSession(sessionId, {
        currentPhase: 'live',
        liveSupports: []
      });
      
      res.json({
        success: true,
        message: 'You\'re ready for the live interaction! I\'m here if you need support.',
        nextPhase: 'live'
      });
    } catch (error) {
      console.error('Error advancing to live:', error);
      res.status(500).json({ success: false, error: 'Failed to advance to live' });
    }
  }
  
  // Step 5: Live interaction support
  async requestLiveSupport(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;
      const { userInput } = req.body;
      
      const session = await sessionModel.getSession(sessionId);
      if (!session) {
        res.status(404).json({ success: false, error: 'Session not found' });
        return;
      }
      
      // Generate live support
      const support = liveSupportService.createLiveSupport(userInput);
      
      // Add to session
      const liveSupports = session.liveSupports || [];
      liveSupports.push(support);
      
      await sessionModel.updateSession(sessionId, { liveSupports });
      await sessionModel.logActivity(sessionId, 'live', 'live_support_requested', { userInput });
      
      res.json({
        success: true,
        support
      });
    } catch (error) {
      console.error('Error requesting live support:', error);
      res.status(500).json({ success: false, error: 'Failed to request live support' });
    }
  }
  
  async advanceToReflection(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;
      
      await sessionModel.updateSession(sessionId, {
        currentPhase: 'reflection'
      });
      
      res.json({
        success: true,
        message: 'Great job! Let\'s reflect on how it went.',
        nextPhase: 'reflection'
      });
    } catch (error) {
      console.error('Error advancing to reflection:', error);
      res.status(500).json({ success: false, error: 'Failed to advance to reflection' });
    }
  }
  
  // Step 6: Submit reflection
  async submitReflection(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;
      const reflectionData: Reflection = req.body;
      
      await sessionModel.updateSession(sessionId, {
        reflection: reflectionData,
        currentPhase: 'completed',
        completed: true
      });
      
      await sessionModel.logActivity(sessionId, 'reflection', 'reflection_submitted', reflectionData);
      
      // Generate feedback
      const feedback = this.generateReflectionFeedback(reflectionData);
      
      res.json({
        success: true,
        message: 'Session complete! You did it! 🎉',
        feedback
      });
    } catch (error) {
      console.error('Error submitting reflection:', error);
      res.status(500).json({ success: false, error: 'Failed to submit reflection' });
    }
  }
  
  private generateReflectionFeedback(reflection: Reflection): string {
    let feedback = '## 🌟 Your Progress Report\n\n';
    
    feedback += '### What You Did Well:\n';
    reflection.whatWorked.forEach(item => {
      feedback += `- ✅ ${item}\n`;
    });
    
    if (reflection.whatFeltTough.length > 0) {
      feedback += '\n### Growth Areas:\n';
      reflection.whatFeltTough.forEach(item => {
        feedback += `- 💪 ${item}\n`;
      });
      feedback += '\n*Remember: Challenges are opportunities for growth. You showed up, and that\'s what matters!*\n';
    }
    
    feedback += '\n### Next Steps:\n';
    
    if (reflection.energyLevel <= 4) {
      feedback += '- 🛌 **Rest & Recharge:** Social interactions are taxing, especially for neurodivergent folks. Take time to decompress.\n';
      feedback += '- 🎧 Engage in a comforting activity: music, quiet time, a special interest.\n';
    }
    
    if (reflection.wouldDoAgain) {
      feedback += '- 🎯 **Build on This Win:** You did great! Consider what made it work and repeat those strategies.\n';
    } else {
      feedback += '- 🔍 **Learn & Adapt:** That\'s okay! Reflect on what didn\'t feel right and how you might adjust next time.\n';
    }
    
    feedback += '- 💧 Hydrate and nourish yourself\n';
    feedback += '- 📝 Journal about the experience if that helps you process\n';
    feedback += '- 🏆 **Celebrate:** You faced a challenge and made it through. That takes courage!\n\n';
    
    feedback += '### Final Thought:\n';
    feedback += '*Progress, not perfection. You\'re building skills with every interaction. Be proud of yourself!* 💜';
    
    return feedback;
  }
}

export default new SessionController();
