import React, { useState, useEffect } from 'react';
import { CoachingSession, User } from './types';
import { api } from './services/api';
import { ContextCheckIn } from './components/ContextCheckIn';
import { EmotionalCalibration } from './components/EmotionalCalibration';
import { ChecklistView } from './components/ChecklistView';
import { PracticePhase } from './components/PracticePhase';
import { LiveSupport } from './components/LiveSupport';
import { ReflectionPhase } from './components/ReflectionPhase';
import './styles/App.css';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<CoachingSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check if user exists in localStorage
      const storedUserId = localStorage.getItem('social_coach_user_id');
      if (storedUserId) {
        const userData = await api.getUser(storedUserId);
        setUser(userData);
      } else {
        // Create new user
        const newUser = await api.createUser();
        setUser(newUser);
        localStorage.setItem('social_coach_user_id', newUser.id);
      }
    } catch (err) {
      console.error('Error initializing app:', err);
      setError('Failed to initialize. Please refresh the page.');
    }
  };

  const startNewSession = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const newSession = await api.createSession(user.id);
      setSession(newSession);
    } catch (err) {
      console.error('Error creating session:', err);
      setError('Failed to create session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = async () => {
    if (!session) return;
    try {
      const updatedSession = await api.getSession(session.id);
      setSession(updatedSession);
    } catch (err) {
      console.error('Error refreshing session:', err);
    }
  };

  const handleContextSubmit = async (contextData: any) => {
    if (!session) return;
    setIsLoading(true);
    try {
      await api.submitContext(session.id, contextData);
      await refreshSession();
    } catch (err) {
      console.error('Error submitting context:', err);
      setError('Failed to save context. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmotionalSubmit = async (emotionalData: any) => {
    if (!session) return;
    setIsLoading(true);
    try {
      const response = await api.submitEmotional(session.id, emotionalData);
      await refreshSession();
    } catch (err) {
      console.error('Error submitting emotional calibration:', err);
      setError('Failed to save emotional calibration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChecklistUpdate = async (checklist: any) => {
    if (!session) return;
    try {
      await api.updateChecklist(session.id, checklist);
    } catch (err) {
      console.error('Error updating checklist:', err);
    }
  };

  const handleAdvanceToPractice = async () => {
    if (!session) return;
    setIsLoading(true);
    try {
      await api.advanceToPractice(session.id);
      await refreshSession();
    } catch (err) {
      console.error('Error advancing to practice:', err);
      setError('Failed to load practice scenarios. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePracticeResponse = async (scenarioId: string, response: string): Promise<string> => {
    if (!session) throw new Error('No session');
    const result = await api.submitPracticeResponse(session.id, scenarioId, response);
    await refreshSession();
    return result.feedback;
  };

  const handleAdvanceToLive = async () => {
    if (!session) return;
    setIsLoading(true);
    try {
      await api.advanceToLive(session.id);
      await refreshSession();
    } catch (err) {
      console.error('Error advancing to live:', err);
      setError('Failed to advance. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLiveSupportRequest = async (userInput: string) => {
    if (!session) throw new Error('No session');
    const result = await api.requestLiveSupport(session.id, userInput);
    await refreshSession();
    return result.support;
  };

  const handleAdvanceToReflection = async () => {
    if (!session) return;
    setIsLoading(true);
    try {
      await api.advanceToReflection(session.id);
      await refreshSession();
    } catch (err) {
      console.error('Error advancing to reflection:', err);
      setError('Failed to advance. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReflectionSubmit = async (reflection: any): Promise<string> => {
    if (!session) throw new Error('No session');
    const result = await api.submitReflection(session.id, reflection);
    await refreshSession();
    return result.feedback;
  };

  const renderProgressIndicator = () => {
    if (!session) return null;

    const phases = [
      { key: 'context', label: '1. Context' },
      { key: 'emotional', label: '2. Emotional' },
      { key: 'checklist', label: '3. Checklist' },
      { key: 'practice', label: '4. Practice' },
      { key: 'live', label: '5. Live' },
      { key: 'reflection', label: '6. Reflection' },
      { key: 'completed', label: '✓ Done' }
    ];

    return (
      <div className="progress-indicator">
        {phases.map((phase) => (
          <div
            key={phase.key}
            className={`progress-step ${
              session.currentPhase === phase.key ? 'active' : ''
            } ${
              phases.findIndex(p => p.key === session.currentPhase) > phases.findIndex(p => p.key === phase.key) ? 'completed' : ''
            }`}
          >
            {phase.label}
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (!session) {
      return (
        <div className="empty-state">
          <h2>👋 Welcome to Your Social Interaction Coach</h2>
          <p>A safe, supportive space designed for neurodivergent individuals preparing for social interactions.</p>
          <p>Whether it's a date, interview, networking event, or casual gathering, I'm here to help you prepare, practice, and reflect.</p>
          <button className="btn btn-primary" onClick={startNewSession} disabled={isLoading || !user}>
            {isLoading ? 'Starting...' : 'Start New Coaching Session'}
          </button>
        </div>
      );
    }

    switch (session.currentPhase) {
      case 'context':
        return <ContextCheckIn onSubmit={handleContextSubmit} />;
      
      case 'emotional':
        return <EmotionalCalibration onSubmit={handleEmotionalSubmit} />;
      
      case 'checklist':
        return session.checklist ? (
          <ChecklistView
            checklist={session.checklist}
            onUpdate={handleChecklistUpdate}
            onAdvance={handleAdvanceToPractice}
          />
        ) : null;
      
      case 'practice':
        return session.practiceScenarios ? (
          <PracticePhase
            scenarios={session.practiceScenarios}
            onSubmitResponse={handlePracticeResponse}
            onAdvance={handleAdvanceToLive}
          />
        ) : null;
      
      case 'live':
        return (
          <LiveSupport
            onRequestSupport={handleLiveSupportRequest}
            onAdvance={handleAdvanceToReflection}
          />
        );
      
      case 'reflection':
        return <ReflectionPhase onSubmit={handleReflectionSubmit} />;
      
      case 'completed':
        return (
          <div className="card">
            <h2>🎉 Session Completed!</h2>
            <div className="alert alert-success">
              <strong>Congratulations! You completed your coaching session!</strong>
            </div>
            <p>You showed up, prepared, and reflected on your experience. That takes courage and self-awareness. Be proud! 💜</p>
            <button className="btn btn-primary btn-full" onClick={startNewSession}>
              Start Another Session
            </button>
          </div>
        );
      
      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>🌟 Social Interaction Coach</h1>
        <p>Your empathetic guide for dates, interviews, networking & more</p>
      </header>
      
      <main>
        {renderProgressIndicator()}
        
        {error && (
          <div className="alert" style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#991b1b' }}>
            {error}
          </div>
        )}
        
        {isLoading && (
          <div className="alert alert-info">
            Loading... Please wait.
          </div>
        )}
        
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
