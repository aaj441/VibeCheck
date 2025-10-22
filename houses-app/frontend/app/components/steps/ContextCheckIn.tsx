'use client'

import { useState } from 'react'

interface ContextCheckInProps {
  sessionId: string
  onUpdate: (session: any) => void
}

export function ContextCheckIn({ sessionId, onUpdate }: ContextCheckInProps) {
  const [formData, setFormData] = useState({
    eventType: '',
    feelings: '',
    setting: '',
    attendees: '',
    goal: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`http://localhost:3001/api/coaching/session/${sessionId}/context`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedSession = await response.json()
        onUpdate(updatedSession)
      }
    } catch (error) {
      console.error('Failed to submit context check-in:', error)
    } finally {
      setLoading(false)
    }
  }

  const eventTypes = [
    { value: 'date', label: 'Date', icon: '💕', description: 'Romantic meeting or date' },
    { value: 'interview', label: 'Interview', icon: '💼', description: 'Job or school interview' },
    { value: 'networking', label: 'Networking', icon: '🤝', description: 'Professional networking event' },
    { value: 'casual', label: 'Casual Social', icon: '☕', description: 'Casual social gathering' },
    { value: 'other', label: 'Other', icon: '🌟', description: 'Other social situation' }
  ]

  const settings = [
    { value: 'in-person', label: 'In-Person', icon: '🏢' },
    { value: 'online', label: 'Online/Video', icon: '💻' },
    { value: 'group', label: 'Group Setting', icon: '👥' },
    { value: 'one-on-one', label: 'One-on-One', icon: '👤' }
  ]

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">📝</div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Let's Start with Context
        </h2>
        <p className="text-gray-600">
          Tell me about your upcoming event. There are no wrong answers - this is about understanding your situation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Event Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            What type of event is this? *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {eventTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, eventType: type.value }))}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  formData.eventType === type.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="text-2xl mb-2">{type.icon}</div>
                <div className="font-medium text-gray-800">{type.label}</div>
                <div className="text-sm text-gray-600">{type.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Feelings */}
        <div>
          <label htmlFor="feelings" className="block text-sm font-medium text-gray-700 mb-2">
            How are you feeling about it right now? *
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Be honest - anxious, excited, neutral, overwhelmed, curious, etc.
          </p>
          <textarea
            id="feelings"
            value={formData.feelings}
            onChange={(e) => setFormData(prev => ({ ...prev, feelings: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={3}
            placeholder="I'm feeling..."
            required
          />
        </div>

        {/* Setting */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            What's the setting? *
          </label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {settings.map((setting) => (
              <button
                key={setting.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, setting: setting.value }))}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  formData.setting === setting.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="text-xl mb-1">{setting.icon}</div>
                <div className="text-sm font-medium text-gray-800">{setting.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Attendees */}
        <div>
          <label htmlFor="attendees" className="block text-sm font-medium text-gray-700 mb-2">
            Who will be present?
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Optional: Names, roles, or just "one other person", "small group", etc.
          </p>
          <input
            id="attendees"
            type="text"
            value={formData.attendees}
            onChange={(e) => setFormData(prev => ({ ...prev, attendees: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., My date Sarah, HR manager and team lead, etc."
          />
        </div>

        {/* Goal */}
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-2">
            What would make this a "win" for you? *
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Your personal goal - feeling comfortable, getting a second date, landing the job, making a connection, etc.
          </p>
          <textarea
            id="goal"
            value={formData.goal}
            onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={2}
            placeholder="A successful outcome for me would be..."
            required
          />
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={loading || !formData.eventType || !formData.feelings || !formData.setting || !formData.goal}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-xl 
                     transition-all duration-200 transform hover:scale-105 disabled:transform-none
                     focus:outline-none focus:ring-4 focus:ring-primary-300 focus:ring-opacity-50"
          >
            {loading ? 'Processing...' : 'Continue to Emotional Check-In'}
          </button>
        </div>
      </form>
    </div>
  )
}