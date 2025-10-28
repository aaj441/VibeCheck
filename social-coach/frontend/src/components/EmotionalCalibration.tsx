import React, { useState } from 'react';
import { EmotionalCalibration as EmotionalType, MoodSliders, NeurodivergentType } from '../types';

interface Props {
  onSubmit: (emotional: EmotionalType) => void;
}

export const EmotionalCalibration: React.FC<Props> = ({ onSubmit }) => {
  const [moodSliders, setMoodSliders] = useState<MoodSliders>({
    anxiety: 5,
    excitement: 5,
    energy: 5,
    focus: 5
  });

  const [worryInput, setWorryInput] = useState('');
  const [specificWorries, setSpecificWorries] = useState<string[]>([]);
  
  const [triggerInput, setTriggerInput] = useState('');
  const [triggers, setTriggers] = useState<string[]>([]);

  const [sensoryInput, setSensoryInput] = useState('');
  const [sensoryNeeds, setSensoryNeeds] = useState<string[]>([]);

  const [neurodivergentType, setNeurodivergentType] = useState<NeurodivergentType[]>([]);

  const addWorry = () => {
    if (worryInput.trim()) {
      setSpecificWorries([...specificWorries, worryInput.trim()]);
      setWorryInput('');
    }
  };

  const removeWorry = (index: number) => {
    setSpecificWorries(specificWorries.filter((_, i) => i !== index));
  };

  const addTrigger = () => {
    if (triggerInput.trim()) {
      setTriggers([...triggers, triggerInput.trim()]);
      setTriggerInput('');
    }
  };

  const removeTrigger = (index: number) => {
    setTriggers(triggers.filter((_, i) => i !== index));
  };

  const addSensoryNeed = () => {
    if (sensoryInput.trim()) {
      setSensoryNeeds([...sensoryNeeds, sensoryInput.trim()]);
      setSensoryInput('');
    }
  };

  const removeSensoryNeed = (index: number) => {
    setSensoryNeeds(sensoryNeeds.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      moodSliders,
      specificWorries,
      triggers,
      sensoryNeeds: sensoryNeeds.length > 0 ? sensoryNeeds : undefined,
      neurodivergentType: neurodivergentType.length > 0 ? neurodivergentType : undefined
    });
  };

  return (
    <div className="card">
      <h2>🎚️ Step 2: Emotional Calibration</h2>
      <p>Help me understand how you're feeling right now. These mood sliders help me personalize your support.</p>

      <form onSubmit={handleSubmit}>
        <div className="slider-group">
          <div className="slider-label">
            <span>😰 Anxiety Level</span>
            <span className="slider-value">{moodSliders.anxiety}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={moodSliders.anxiety}
            onChange={(e) => setMoodSliders({ ...moodSliders, anxiety: parseInt(e.target.value) })}
          />
        </div>

        <div className="slider-group">
          <div className="slider-label">
            <span>🎉 Excitement Level</span>
            <span className="slider-value">{moodSliders.excitement}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={moodSliders.excitement}
            onChange={(e) => setMoodSliders({ ...moodSliders, excitement: parseInt(e.target.value) })}
          />
        </div>

        <div className="slider-group">
          <div className="slider-label">
            <span>⚡ Energy Level</span>
            <span className="slider-value">{moodSliders.energy}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={moodSliders.energy}
            onChange={(e) => setMoodSliders({ ...moodSliders, energy: parseInt(e.target.value) })}
          />
        </div>

        <div className="slider-group">
          <div className="slider-label">
            <span>🎯 Focus Level</span>
            <span className="slider-value">{moodSliders.focus}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={moodSliders.focus}
            onChange={(e) => setMoodSliders({ ...moodSliders, focus: parseInt(e.target.value) })}
          />
        </div>

        <div className="form-group">
          <label>🤔 Specific Worries or Concerns</label>
          <div className="tag-input-container">
            {specificWorries.map((worry, index) => (
              <span key={index} className="tag">
                {worry}
                <button type="button" onClick={() => removeWorry(index)}>×</button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="text"
              placeholder="e.g., 'Awkward silences' or 'Forgetting names'"
              value={worryInput}
              onChange={(e) => setWorryInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addWorry())}
            />
            <button type="button" className="btn btn-secondary" onClick={addWorry}>Add</button>
          </div>
        </div>

        <div className="form-group">
          <label>⚠️ Known Triggers</label>
          <div className="tag-input-container">
            {triggers.map((trigger, index) => (
              <span key={index} className="tag">
                {trigger}
                <button type="button" onClick={() => removeTrigger(index)}>×</button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="text"
              placeholder="e.g., 'Loud noises' or 'Being put on the spot'"
              value={triggerInput}
              onChange={(e) => setTriggerInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTrigger())}
            />
            <button type="button" className="btn btn-secondary" onClick={addTrigger}>Add</button>
          </div>
        </div>

        <div className="form-group">
          <label>🌈 Sensory Needs (optional)</label>
          <div className="tag-input-container">
            {sensoryNeeds.map((need, index) => (
              <span key={index} className="tag">
                {need}
                <button type="button" onClick={() => removeSensoryNeed(index)}>×</button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="text"
              placeholder="e.g., 'Need breaks from noise' or 'Prefer dim lighting'"
              value={sensoryInput}
              onChange={(e) => setSensoryInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSensoryNeed())}
            />
            <button type="button" className="btn btn-secondary" onClick={addSensoryNeed}>Add</button>
          </div>
        </div>

        <div className="form-group">
          <label>🧠 Neurodivergent Type (optional, helps me personalize better)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {(['ADHD', 'ASD', 'social-anxiety', 'multiple', 'other', 'prefer-not-to-say'] as NeurodivergentType[]).map(type => (
              <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <input
                  type="checkbox"
                  checked={neurodivergentType.includes(type)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setNeurodivergentType([...neurodivergentType, type]);
                    } else {
                      setNeurodivergentType(neurodivergentType.filter(t => t !== type));
                    }
                  }}
                />
                {type === 'ASD' ? 'Autism' : type === 'social-anxiety' ? 'Social Anxiety' : type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-full">
          Generate My Personalized Checklist →
        </button>
      </form>
    </div>
  );
};
