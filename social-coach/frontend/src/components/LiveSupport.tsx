import React, { useState } from 'react';
import { LiveSupport as LiveSupportType } from '../types';

interface Props {
  onRequestSupport: (userInput: string) => Promise<LiveSupportType>;
  onAdvance: () => void;
}

export const LiveSupport: React.FC<Props> = ({ onRequestSupport, onAdvance }) => {
  const [userInput, setUserInput] = useState('');
  const [supportHistory, setSupportHistory] = useState<LiveSupportType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setIsLoading(true);
    try {
      const support = await onRequestSupport(userInput);
      setSupportHistory([support, ...supportHistory]);
      setUserInput('');
    } catch (error) {
      console.error('Error requesting support:', error);
      alert('Failed to get support. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>🆘 Step 5: Live Interaction Support</h2>
      <p>You're in the event now (or about to be)! Share what's happening, and I'll provide real-time support, suggestions, and grounding techniques if needed.</p>

      <div className="alert alert-info">
        <strong>💜 I'm here for you!</strong> Type anything you're experiencing, feeling, or need help with. No judgment, just support.
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="liveInput">What's happening right now?</label>
          <textarea
            id="liveInput"
            placeholder="e.g., 'Feeling nervous, not sure what to say' or 'Things are going well!' or 'Help, I'm overwhelmed'"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            required
            style={{ minHeight: '100px' }}
          />
        </div>
        <button type="submit" className="btn btn-primary btn-full" disabled={isLoading || !userInput.trim()}>
          {isLoading ? 'Getting Support...' : 'Get Support'}
        </button>
      </form>

      {supportHistory.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>💬 Support History</h3>
          {supportHistory.map((support, index) => (
            <div key={index} className="live-support-response">
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                Your message: "{support.userInput}"
              </div>
              
              <div className={`sentiment-indicator sentiment-${support.sentiment}`}>
                {support.sentiment === 'positive' && '😊 Positive'}
                {support.sentiment === 'neutral' && '😐 Neutral'}
                {support.sentiment === 'stressed' && '😰 Stressed'}
                {support.sentiment === 'overwhelmed' && '😵 Overwhelmed'}
              </div>

              <h4 style={{ marginTop: '1rem', marginBottom: '0.75rem' }}>💡 Suggestions:</h4>
              <ul className="suggestions-list">
                {support.suggestions.map((suggestion, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: suggestion }} />
                ))}
              </ul>

              {support.groundingPrompt && (
                <div className="grounding-prompt">
                  <strong>🧘 Grounding Exercise:</strong>
                  <div style={{ marginTop: '0.5rem' }}>{support.groundingPrompt}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '2px solid #10b981' }}>
        <h4 style={{ color: '#065f46', marginBottom: '0.5rem' }}>When you're done with the interaction:</h4>
        <p style={{ color: '#065f46', marginBottom: '1rem' }}>
          Take your time. There's no rush. When you're ready to reflect on how it went, click below.
        </p>
        <button className="btn btn-success btn-full" onClick={onAdvance}>
          I'm Done - Let's Reflect →
        </button>
      </div>
    </div>
  );
};
