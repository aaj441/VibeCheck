'use client';

import { useState } from 'react';

export default function VibeCheckApp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionData, setSessionData] = useState({
    eventType: '',
    feelings: '',
    setting: '',
    participants: '',
    goals: ''
  });

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleInputChange = (field: string, value: string) => {
    setSessionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🌟 Vibe Check
          </h1>
          <p className="text-xl text-gray-600">
            Your personalized social interaction coach for neurodivergent users
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">Step {currentStep} of 6</span>
              <span className="text-sm text-gray-500">Context Check-In</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 6) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step 1: Context Check-In */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Let's understand your upcoming situation
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What type of event are you preparing for?
                </label>
                <select 
                  value={sessionData.eventType}
                  onChange={(e) => handleInputChange('eventType', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select an option</option>
                  <option value="date">Date</option>
                  <option value="interview">Interview</option>
                  <option value="networking">Networking</option>
                  <option value="casual">Casual social gathering</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How are you feeling about it right now?
                </label>
                <textarea
                  value={sessionData.feelings}
                  onChange={(e) => handleInputChange('feelings', e.target.value)}
                  placeholder="Describe your current emotional state (anxious, excited, neutral, overwhelmed, etc.)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What's the setting?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="setting"
                      value="in-person"
                      checked={sessionData.setting === 'in-person'}
                      onChange={(e) => handleInputChange('setting', e.target.value)}
                      className="mr-3"
                    />
                    In-person
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="setting"
                      value="online"
                      checked={sessionData.setting === 'online'}
                      onChange={(e) => handleInputChange('setting', e.target.value)}
                      className="mr-3"
                    />
                    Online/Virtual
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Who will be present?
                </label>
                <input
                  type="text"
                  value={sessionData.participants}
                  onChange={(e) => handleInputChange('participants', e.target.value)}
                  placeholder="e.g., one person, small group, large crowd, specific people you know/don't know"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What would make this event a "win" for you?
                </label>
                <textarea
                  value={sessionData.goals}
                  onChange={(e) => handleInputChange('goals', e.target.value)}
                  placeholder="What outcome or experience would leave you feeling successful and satisfied?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={!sessionData.eventType || !sessionData.feelings || !sessionData.setting}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next: Emotional Calibration
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Emotional Calibration */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Let's calibrate your emotional state
              </h2>
              <p className="text-gray-600 mb-6">
                Rate each feeling on a scale of 1-10 (1 = very low, 10 = very high)
              </p>

              <div className="space-y-6">
                {['anxiety', 'excitement', 'energy', 'focus'].map((emotion) => (
                  <div key={emotion}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {emotion}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      defaultValue="5"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Very Low (1)</span>
                      <span>Very High (10)</span>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Any specific worries or triggers?
                </label>
                <textarea
                  placeholder="e.g., sensory needs, fear of awkward pauses, forgetting names, etc."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24"
                />
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Next: Generate Checklist
                </button>
              </div>
            </div>
          )}

          {/* Additional steps would go here... */}
          {currentStep > 2 && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Coming Soon!
              </h2>
              <p className="text-gray-600 mb-6">
                The remaining steps (Personalized Checklist, Practice Phase, Live Support, and Reflection) 
                will be implemented in the next iteration.
              </p>
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}