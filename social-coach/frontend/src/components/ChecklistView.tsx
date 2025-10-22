import React, { useState } from 'react';
import { ChecklistItem } from '../types';

interface Props {
  checklist: ChecklistItem[];
  onUpdate: (checklist: ChecklistItem[]) => void;
  onAdvance: () => void;
}

export const ChecklistView: React.FC<Props> = ({ checklist: initialChecklist, onUpdate, onAdvance }) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);

  const toggleItem = (id: string) => {
    const updated = checklist.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updated);
    onUpdate(updated);
  };

  const categorizeItems = () => {
    const categories = {
      preparation: checklist.filter(item => item.category === 'preparation'),
      comfort: checklist.filter(item => item.category === 'comfort'),
      grounding: checklist.filter(item => item.category === 'grounding'),
      during: checklist.filter(item => item.category === 'during'),
      exit: checklist.filter(item => item.category === 'exit')
    };
    return categories;
  };

  const categories = categorizeItems();
  const completedCount = checklist.filter(item => item.completed).length;
  const totalCount = checklist.length;

  return (
    <div className="card">
      <h2>✅ Step 3: Your Personalized Checklist</h2>
      <p>I've created a customized checklist based on your context and emotional state. Items marked with a purple border are specifically tailored to your needs!</p>

      <div className="alert alert-info">
        <strong>Progress: {completedCount}/{totalCount} items completed</strong>
        <div style={{ marginTop: '0.5rem', background: '#e0e7ff', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${(completedCount / totalCount) * 100}%`, height: '100%', background: '#6366f1', transition: 'width 0.3s' }} />
        </div>
      </div>

      {categories.preparation.length > 0 && (
        <div>
          <h3>📝 Preparation (Before the Event)</h3>
          <ul className="checklist">
            {categories.preparation.map(item => (
              <li
                key={item.id}
                className={`checklist-item ${item.completed ? 'completed' : ''} ${item.customized ? 'customized' : ''} ${item.priority === 'high' ? 'high-priority' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleItem(item.id)}
                />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {categories.comfort.length > 0 && (
        <div>
          <h3>🧸 Comfort Items</h3>
          <ul className="checklist">
            {categories.comfort.map(item => (
              <li
                key={item.id}
                className={`checklist-item ${item.completed ? 'completed' : ''} ${item.customized ? 'customized' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleItem(item.id)}
                />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {categories.grounding.length > 0 && (
        <div>
          <h3>🧘 Grounding & Affirmations</h3>
          <ul className="checklist">
            {categories.grounding.map(item => (
              <li
                key={item.id}
                className={`checklist-item ${item.completed ? 'completed' : ''} ${item.customized ? 'customized' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleItem(item.id)}
                />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {categories.during.length > 0 && (
        <div>
          <h3>💬 During the Interaction</h3>
          <ul className="checklist">
            {categories.during.map(item => (
              <li
                key={item.id}
                className={`checklist-item ${item.completed ? 'completed' : ''} ${item.customized ? 'customized' : ''} ${item.priority === 'high' ? 'high-priority' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleItem(item.id)}
                />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {categories.exit.length > 0 && (
        <div>
          <h3>🚪 Exit Strategies</h3>
          <ul className="checklist">
            {categories.exit.map(item => (
              <li
                key={item.id}
                className={`checklist-item ${item.completed ? 'completed' : ''} ${item.customized ? 'customized' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleItem(item.id)}
                />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="alert alert-success" style={{ marginTop: '1.5rem' }}>
        <strong>💡 Tip:</strong> You don't need to complete everything perfectly. This checklist is a guide to support you, not a test!
      </div>

      <button className="btn btn-primary btn-full" onClick={onAdvance}>
        Ready for Practice Scenarios →
      </button>
    </div>
  );
};
