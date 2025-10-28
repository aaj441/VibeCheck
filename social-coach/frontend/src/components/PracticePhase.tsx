import React, { useState } from 'react';
import { PracticeScenario } from '../types';

interface Props {
  scenarios: PracticeScenario[];
  onSubmitResponse: (scenarioId: string, response: string) => Promise<string>;
  onAdvance: () => void;
}

export const PracticePhase: React.FC<Props> = ({ scenarios, onSubmitResponse, onAdvance }) => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentScenario = scenarios[currentScenarioIndex];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userResponse.trim()) return;

    setIsSubmitting(true);
    try {
      const feedbackText = await onSubmitResponse(currentScenario.id, userResponse);
      setFeedback(feedbackText);
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('Failed to submit response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
      setUserResponse('');
      setFeedback(null);
    }
  };

  const handlePrevious = () => {
    if (currentScenarioIndex > 0) {
      setCurrentScenarioIndex(currentScenarioIndex - 1);
      setUserResponse('');
      setFeedback(null);
    }
  };

  const completedCount = scenarios.filter(s => s.userResponse).length;

  return (
    <div className="card">
      <h2>🎭 Step 4: Practice Scenarios</h2>
      <p>Let's practice! Try responding to these scenarios. I'll provide gentle feedback to help you prepare.</p>

      <div className="alert alert-info">
        <strong>Scenario {currentScenarioIndex + 1} of {scenarios.length}</strong> | Completed: {completedCount}/{scenarios.length}
      </div>

      <div className="practice-scenario">
        <h4>Situation: {currentScenario.situation}</h4>
        <p style={{ fontSize: '1.05rem', fontStyle: 'italic', color: '#374151' }}>
          "{currentScenario.promptText}"
        </p>

        <div className="sample-responses">
          <h5>💡 Sample Responses (for inspiration):</h5>
          <ul>
            {currentScenario.sampleResponses.map((response, index) => (
              <li key={index}>"{response}"</li>
            ))}
          </ul>
        </div>

        {!feedback ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="userResponse">Your Response:</label>
              <textarea
                id="userResponse"
                placeholder="Type what you would say... Remember, there's no perfect answer!"
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                required
                style={{ minHeight: '120px' }}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={isSubmitting || !userResponse.trim()}
            >
              {isSubmitting ? 'Analyzing...' : 'Get Feedback'}
            </button>
          </form>
        ) : (
          <div className="feedback-box">
            <h5>📊 Feedback</h5>
            <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
              {feedback}
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              {currentScenarioIndex < scenarios.length - 1 ? (
                <button className="btn btn-primary btn-full" onClick={handleNext}>
                  Next Scenario →
                </button>
              ) : (
                <button className="btn btn-success btn-full" onClick={onAdvance}>
                  I'm Ready for the Real Interaction! →
                </button>
              )}
            </div>
          </div>
        )}

        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
          <button
            className="btn btn-secondary"
            onClick={handlePrevious}
            disabled={currentScenarioIndex === 0}
          >
            ← Previous
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleNext}
            disabled={currentScenarioIndex === scenarios.length - 1 || !feedback}
          >
            Skip →
          </button>
        </div>
      </div>

      <div className="alert alert-success" style={{ marginTop: '1.5rem' }}>
        <strong>Remember:</strong> Practice helps, but you don't need to be perfect. You're building confidence! 💪
      </div>
    </div>
  );
};
