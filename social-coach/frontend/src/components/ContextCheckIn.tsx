import React, { useState } from 'react';
import { ContextCheckIn as ContextType, EventType, Setting, EmotionalState } from '../types';

interface Props {
  onSubmit: (context: ContextType) => void;
}

export const ContextCheckIn: React.FC<Props> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ContextType>({
    eventType: 'date',
    emotionalState: 'neutral',
    setting: 'in-person',
    participants: '',
    goal: '',
    additionalNotes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="card">
      <h2>📋 Step 1: Context Check-In</h2>
      <p>Let's understand what you're preparing for. This helps me personalize your coaching session.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="eventType">What type of event is this? *</label>
          <select
            id="eventType"
            value={formData.eventType}
            onChange={(e) => setFormData({ ...formData, eventType: e.target.value as EventType })}
            required
          >
            <option value="date">🌹 Date</option>
            <option value="interview">💼 Job Interview</option>
            <option value="networking">🤝 Networking Event</option>
            <option value="casual">☕ Casual Social Gathering</option>
            <option value="other">📌 Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="emotionalState">How are you feeling about it right now? *</label>
          <select
            id="emotionalState"
            value={formData.emotionalState}
            onChange={(e) => setFormData({ ...formData, emotionalState: e.target.value as EmotionalState })}
            required
          >
            <option value="anxious">😰 Anxious</option>
            <option value="excited">🎉 Excited</option>
            <option value="neutral">😐 Neutral</option>
            <option value="overwhelmed">😵 Overwhelmed</option>
            <option value="mixed">🎭 Mixed Feelings</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="setting">What's the setting? *</label>
          <select
            id="setting"
            value={formData.setting}
            onChange={(e) => setFormData({ ...formData, setting: e.target.value as Setting })}
            required
          >
            <option value="in-person">👥 In-Person</option>
            <option value="online">💻 Online/Virtual</option>
            <option value="group">👫 Group Setting</option>
            <option value="one-on-one">🗣️ One-on-One</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="participants">Who will be present? *</label>
          <input
            type="text"
            id="participants"
            placeholder="e.g., 'A person I met on dating app' or '2 interviewers from the company'"
            value={formData.participants}
            onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="goal">What would make this a "win" for you? *</label>
          <textarea
            id="goal"
            placeholder="e.g., 'Having a comfortable conversation without too much anxiety' or 'Getting to second interview'"
            value={formData.goal}
            onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="additionalNotes">Additional notes (optional)</label>
          <textarea
            id="additionalNotes"
            placeholder="Anything else you'd like me to know?"
            value={formData.additionalNotes}
            onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-full">
          Continue to Emotional Calibration →
        </button>
      </form>
    </div>
  );
};
