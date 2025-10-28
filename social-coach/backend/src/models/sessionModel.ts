import { dbRun, dbGet, dbAll } from '../database';
import { CoachingSession, User } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class SessionModel {
  async createUser(name?: string): Promise<User> {
    const userId = uuidv4();
    const user: User = {
      id: userId,
      name,
      createdAt: new Date()
    };
    
    await dbRun(
      'INSERT INTO users (id, name, preferences, created_at) VALUES (?, ?, ?, ?)',
      [userId, name || null, null, user.createdAt.toISOString()]
    );
    
    return user;
  }
  
  async getUser(userId: string): Promise<User | null> {
    const row: any = await dbGet('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (!row) return null;
    
    return {
      id: row.id,
      name: row.name,
      preferences: row.preferences ? JSON.parse(row.preferences) : undefined,
      createdAt: new Date(row.created_at)
    };
  }
  
  async updateUserPreferences(userId: string, preferences: User['preferences']): Promise<void> {
    await dbRun(
      'UPDATE users SET preferences = ? WHERE id = ?',
      [JSON.stringify(preferences), userId]
    );
  }
  
  async createSession(userId: string): Promise<CoachingSession> {
    const sessionId = uuidv4();
    const session: CoachingSession = {
      id: sessionId,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      currentPhase: 'context',
      completed: false
    };
    
    await dbRun(
      'INSERT INTO sessions (id, user_id, created_at, updated_at, current_phase, completed) VALUES (?, ?, ?, ?, ?, ?)',
      [sessionId, userId, session.createdAt.toISOString(), session.updatedAt.toISOString(), session.currentPhase, 0]
    );
    
    await this.logActivity(sessionId, 'context', 'session_created', null);
    
    return session;
  }
  
  async getSession(sessionId: string): Promise<CoachingSession | null> {
    const row: any = await dbGet('SELECT * FROM sessions WHERE id = ?', [sessionId]);
    
    if (!row) return null;
    
    return this.rowToSession(row);
  }
  
  async getUserSessions(userId: string): Promise<CoachingSession[]> {
    const rows: any[] = await dbAll(
      'SELECT * FROM sessions WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    
    return rows.map(row => this.rowToSession(row));
  }
  
  async updateSession(sessionId: string, updates: Partial<CoachingSession>): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) throw new Error('Session not found');
    
    const updatedSession = { ...session, ...updates, updatedAt: new Date() };
    
    await dbRun(
      `UPDATE sessions SET 
        updated_at = ?,
        current_phase = ?,
        context = ?,
        emotional = ?,
        checklist = ?,
        practice_scenarios = ?,
        live_supports = ?,
        reflection = ?,
        completed = ?
      WHERE id = ?`,
      [
        updatedSession.updatedAt.toISOString(),
        updatedSession.currentPhase,
        updatedSession.context ? JSON.stringify(updatedSession.context) : null,
        updatedSession.emotional ? JSON.stringify(updatedSession.emotional) : null,
        updatedSession.checklist ? JSON.stringify(updatedSession.checklist) : null,
        updatedSession.practiceScenarios ? JSON.stringify(updatedSession.practiceScenarios) : null,
        updatedSession.liveSupports ? JSON.stringify(updatedSession.liveSupports) : null,
        updatedSession.reflection ? JSON.stringify(updatedSession.reflection) : null,
        updatedSession.completed ? 1 : 0,
        sessionId
      ]
    );
    
    // Log the update
    if (updates.currentPhase) {
      await this.logActivity(sessionId, updates.currentPhase, 'phase_updated', null);
    }
  }
  
  async logActivity(sessionId: string, phase: string, action: string, data: any): Promise<void> {
    await dbRun(
      'INSERT INTO activity_log (session_id, phase, action, data) VALUES (?, ?, ?, ?)',
      [sessionId, phase, action, data ? JSON.stringify(data) : null]
    );
  }
  
  private rowToSession(row: any): CoachingSession {
    return {
      id: row.id,
      userId: row.user_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      currentPhase: row.current_phase,
      context: row.context ? JSON.parse(row.context) : undefined,
      emotional: row.emotional ? JSON.parse(row.emotional) : undefined,
      checklist: row.checklist ? JSON.parse(row.checklist) : undefined,
      practiceScenarios: row.practice_scenarios ? JSON.parse(row.practice_scenarios) : undefined,
      liveSupports: row.live_supports ? JSON.parse(row.live_supports) : undefined,
      reflection: row.reflection ? JSON.parse(row.reflection) : undefined,
      completed: row.completed === 1
    };
  }
}

export default new SessionModel();
