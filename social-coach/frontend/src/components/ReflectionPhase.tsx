import React, { useState } from 'react';
import { Reflection } from '../types';

interface Props {
  onSubmit: (reflection: Reflection) => Promise<string>;
}

export const ReflectionPhase: React.FC<Props> = ({ onSubmit }) => {
  const [workedInput, setWorkedInput] = useState('');
  const [whatWorked, setWhatWorked] = useState<string[]>([]);
  
  const [toughInput, setToughInput] = useState('');
  const [whatFeltTough, setWhatFeltTough] = useState<string[]>([]);
  
  const [overallFeeling, setOverallFeeling] = useState('');
  const [energyLevel, setEnergyLevel] = useState(5);
  const [wouldDoAgain, setWouldDoAgain] = useState<boolean | null>(null);
  const [specificFeedback, setSpecificFeedback] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addWorked = () => {
    if (workedInput.trim()) {
      setWhatWorked([...whatWorked, workedInput.trim()]);
      setWorkedInput('');
    }
  };

  const removeWorked = (index: number) => {
    setWhatWorked(whatWorked.filter((_, i) => i !== index));
  };

  const addTough = () => {
    if (toughInput.trim()) {
      setWhatFeltTough([...whatFeltTough, toughInput.trim()]);
      setToughInput('');
    }
  };

  const removeTough = (index: number) => {
    setWhatFeltTough(whatFeltTough.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (whatWorked.length === 0 || !overallFeeling || wouldDoAgain === null) {
      alert('Please complete all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const reflection: Reflection = {
        whatWorked,
        whatFeltTough,
        overallFeeling,
        energyLevel,
        wouldDoAgain,
        specificFeedback: specificFeedback || undefined
      };
      const feedbackText = await onSubmit(reflection);
      setFeedback(feedbackText);
    } catch (error) {
      console.error('Error submitting reflection:', error);
      alert('Failed to submit reflection. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (feedback) {
    return (
      <div className="card">
        <h2>🎉 Session Complete!</h2>
        <div className="alert alert-success">
          <strong>You did it! You showed up and made it through. That's a victory! 🏆</strong>
        </div>
        <div style={{ whiteSpace: 'pre-line', lineHeight: '1.8', marginTop: '1.5rem' }}>
          {feedback}
        </div>
        <div style={{ marginTop: '2rem', textAlign: 'center', padding: '1.5rem', background: '#faf5ff', borderRadius: '8px' }}>
          <h3 style={{ color: '#7c3aed', marginBottom: '0.5rem' }}>You're building real skills! 💜</h3>
          <p style={{ color: '#6b21a8' }}>Every interaction is practice. Every attempt is growth. Be proud of yourself.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>🌟 Step 6: Post-Interaction Reflection</h2>
      <p>Take a moment to reflect on your experience. This helps you learn and celebrate your progress!</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>✅ What worked well? (Add at least one) *</label>
          <div className="tag-input-container">
            {whatWorked.map((item, index) => (
              <span key={index} className="tag">
                {item}
                <button type="button" onClick={() => removeWorked(index)}>×</button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="text"
              placeholder="e.g., 'I stayed calm' or 'Asked good questions'"
              value={workedInput}
              onChange={(e) => setWorkedInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addWorked())}
            />
            <button type="button" className="btn btn-secondary" onClick={addWorked}>Add</button>
          </div>
        </div>

        <div className="form-group">
          <label>💪 What felt tough? (It's okay to have challenges!)</label>
          <div className="tag-input-container">
            {whatFeltTough.map((item, index) => (
              <span key={index} className="tag" style={{ background: '#f59e0b' }}>
                {item}
                <button type="button" onClick={() => removeTough(index)}>×</button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="text"
              placeholder="e.g., 'Small talk was hard' or 'Got overwhelmed'"
              value={toughInput}
              onChange={(e) => setToughInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTough())}
            />
            <button type="button" className="btn btn-secondary" onClick={addTough}>Add</button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="overallFeeling">Overall, how do you feel about it? *</label>
          <textarea
            id="overallFeeling"
            placeholder="Share your honest feelings... proud, relieved, disappointed, mixed, etc."
            value={overallFeeling}
            onChange={(e) => setOverallFeeling(e.target.value)}
            required
          />
        </div>

        <div className="slider-group">
          <div className="slider-label">
            <span>⚡ Current Energy Level</span>
            <span className="slider-value">{energyLevel}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={energyLevel}
            onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
          />
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
            Social interactions can be draining. It's important to know where you're at.
          </p>
        </div>

        <div className="form-group">
          <label>🔄 Would you do this again? *</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="wouldDoAgain"
                checked={wouldDoAgain === true}
                onChange={() => setWouldDoAgain(true)}
                required
              />
              <span>Yes, I would!</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="wouldDoAgain"
                checked={wouldDoAgain === false}
                onChange={() => setWouldDoAgain(false)}
                required
              />
              <span>Not sure / No</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="specificFeedback">Any specific thoughts or questions? (optional)</label>
          <textarea
            id="specificFeedback"
            placeholder="Anything else you want to note or ask about?"
            value={specificFeedback}
            onChange={(e) => setSpecificFeedback(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-success btn-full" disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : 'Complete My Reflection 🎉'}
        </button>
      </form>
    </div>
  );
};
