import axios from 'axios';
import { 
  User, 
  CoachingSession, 
  ContextCheckIn, 
  EmotionalCalibration, 
  ChecklistItem, 
  PracticeScenario,
  Reflection 
} from '../types';

const API_BASE = '/api';

export const api = {
  // User endpoints
  createUser: async (name?: string): Promise<User> => {
    const response = await axios.post(`${API_BASE}/users`, { name });
    return response.data.user;
  },

  getUser: async (userId: string): Promise<User> => {
    const response = await axios.get(`${API_BASE}/users/${userId}`);
    return response.data.user;
  },

  // Session endpoints
  createSession: async (userId: string): Promise<CoachingSession> => {
    const response = await axios.post(`${API_BASE}/sessions`, { userId });
    return response.data.session;
  },

  getSession: async (sessionId: string): Promise<CoachingSession> => {
    const response = await axios.get(`${API_BASE}/sessions/${sessionId}`);
    return response.data.session;
  },

  getUserSessions: async (userId: string): Promise<CoachingSession[]> => {
    const response = await axios.get(`${API_BASE}/users/${userId}/sessions`);
    return response.data.sessions;
  },

  // Step 1: Context
  submitContext: async (sessionId: string, context: ContextCheckIn) => {
    const response = await axios.post(`${API_BASE}/sessions/${sessionId}/context`, context);
    return response.data;
  },

  // Step 2: Emotional
  submitEmotional: async (sessionId: string, emotional: EmotionalCalibration) => {
    const response = await axios.post(`${API_BASE}/sessions/${sessionId}/emotional`, emotional);
    return response.data;
  },

  // Step 3: Checklist
  updateChecklist: async (sessionId: string, checklist: ChecklistItem[]) => {
    const response = await axios.put(`${API_BASE}/sessions/${sessionId}/checklist`, { checklist });
    return response.data;
  },

  advanceToPractice: async (sessionId: string) => {
    const response = await axios.post(`${API_BASE}/sessions/${sessionId}/advance-to-practice`);
    return response.data;
  },

  // Step 4: Practice
  submitPracticeResponse: async (sessionId: string, scenarioId: string, response: string) => {
    const res = await axios.post(`${API_BASE}/sessions/${sessionId}/practice/${scenarioId}`, { response });
    return res.data;
  },

  advanceToLive: async (sessionId: string) => {
    const response = await axios.post(`${API_BASE}/sessions/${sessionId}/advance-to-live`);
    return response.data;
  },

  // Step 5: Live Support
  requestLiveSupport: async (sessionId: string, userInput: string) => {
    const response = await axios.post(`${API_BASE}/sessions/${sessionId}/live-support`, { userInput });
    return response.data;
  },

  advanceToReflection: async (sessionId: string) => {
    const response = await axios.post(`${API_BASE}/sessions/${sessionId}/advance-to-reflection`);
    return response.data;
  },

  // Step 6: Reflection
  submitReflection: async (sessionId: string, reflection: Reflection) => {
    const response = await axios.post(`${API_BASE}/sessions/${sessionId}/reflection`, reflection);
    return response.data;
  }
};
