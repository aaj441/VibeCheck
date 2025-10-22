'use client'

import { useState } from 'react'

interface EmotionalCalibrationProps {
  sessionId: string
  onUpdate: (session: any) => void
}

interface MoodSlider {
  key: keyof typeof initialMoods
  label: string
  icon: string
  lowLabel: string
  highLabel: string
  color: string
}

const initialMoods = {
  anxiety: 5,
  excitement: 5,
  energy: 5,
  focus: 5
}

export function EmotionalCalibration({ sessionId, onUpdate }: EmotionalCalibrationProps) {
  const [moods, setMoods] = useState(initialMoods)
  const [worries, setWorries] = useState<string[]>([])
  const [triggers, setTriggers] = useState<string[]>([])
  const [customWorry, setCustomWorry] = useState('')
  const [customTrigger, setCustomTrigger] = useState('')
  const [loading, setLoading] = useState(false)

  const moodSliders: MoodSlider[] = [
    {
      key: 'anxiety',
      label: 'Anxiety Level',
      icon: '😰',
      lowLabel: 'Calm',
      highLabel: 'Very Anxious',
      color: 'bg-orange-500'
    },
    {
      key: 'excitement',
      label: 'Excitement Level',
      icon: '🎉',
      lowLabel: 'Not Excited',
      highLabel: 'Very Excited',
      color: 'bg-yellow-500'
    },
    {
      key: 'energy',
      label: 'Energy Level',
      icon: '⚡',
      lowLabel: 'Low Energy',
      highLabel: 'High Energy',
      color: 'bg-green-500'
    },
    {
      key: 'focus',
      label: 'Focus Level',
      icon: '🎯',
      lowLabel: 'Scattered',
      highLabel: 'Very Focused',
      color: 'bg-blue-500'
    }
  ]

  const commonWorries = [
    'Awkward pauses in conversation',
    'Forgetting names',
    'Not knowing what to say',
    'Being judged',
    'Making a mistake',
    'Sensory overload',
    'Running out of energy',
    'Misreading social cues'
  ]

  const commonTriggers = [
    'Loud noises',
    'Bright lights',
    'Crowded spaces',
    'Strong smells',
    'Unexpected changes',
    'Being interrupted',
    'Time pressure',
    'Physical contact'
  ]

  const handleMoodChange = (key: keyof typeof moods, value: number) => {
    setMoods(prev => ({ ...prev, [key]: value }))
  }

  const toggleWorry = (worry: string) => {
    setWorries(prev => 
      prev.includes(worry) 
        ? prev.filter(w => w !== worry)
        : [...prev, worry]
    )
  }

  const toggleTrigger = (trigger: string) => {
    setTriggers(prev => 
      prev.includes(trigger) 
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    )
  }

  const addCustomWorry = () => {
    if (customWorry.trim() && !worries.includes(customWorry.trim())) {
      setWorries(prev => [...prev, customWorry.trim()])
      setCustomWorry('')
    }
  }

  const addCustomTrigger = () => {
    if (customTrigger.trim() && !triggers.includes(customTrigger.trim())) {
      setTriggers(prev => [...prev, customTrigger.trim()])
      setCustomTrigger('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`http://localhost:3001/api/coaching/session/${sessionId}/emotional-calibration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...moods,
          worries,
          triggers
        }),
      })

      if (response.ok) {
        const updatedSession = await response.json()
        onUpdate(updatedSession)
      }
    } catch (error) {
      console.error('Failed to submit emotional calibration:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">💭</div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          How Are You Feeling Right Now?
        </h2>
        <p className="text-gray-600">
          Let's check in with your emotional state. This helps me customize support for you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Mood Sliders */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-6">Mood Check-In</h3>
          <div className="space-y-6">
            {moodSliders.map((slider) => (
              <div key={slider.key} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{slider.icon}</span>
                    <span className="font-medium text-gray-800">{slider.label}</span>
                  </div>
                  <span className="text-lg font-semibold text-primary-600">
                    {moods[slider.key]}/10
                  </span>
                </div>
                
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={moods[slider.key]}
                    onChange={(e) => handleMoodChange(slider.key, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #e5e7eb 0%, #e5e7eb ${((moods[slider.key] - 1) / 9) * 100}%, ${slider.color.replace('bg-', '#')} ${((moods[slider.key] - 1) / 9) * 100}%, ${slider.color.replace('bg-', '#')} 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{slider.lowLabel}</span>
                    <span>{slider.highLabel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Worries */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Any specific worries? (Select all that apply)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {commonWorries.map((worry) => (
              <button
                key={worry}
                type="button"
                onClick={() => toggleWorry(worry)}
                className={`p-3 rounded-lg border-2 transition-all text-left text-sm ${
                  worries.includes(worry)
                    ? 'border-orange-500 bg-orange-50 text-orange-800'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                {worry}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={customWorry}
              onChange={(e) => setCustomWorry(e.target.value)}
              placeholder="Add your own worry..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomWorry())}
            />
            <button
              type="button"
              onClick={addCustomWorry}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
            >
              Add
            </button>
          </div>
        </div>

        {/* Triggers */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Any sensory triggers or things that might be challenging?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {commonTriggers.map((trigger) => (
              <button
                key={trigger}
                type="button"
                onClick={() => toggleTrigger(trigger)}
                className={`p-3 rounded-lg border-2 transition-all text-left text-sm ${
                  triggers.includes(trigger)
                    ? 'border-red-500 bg-red-50 text-red-800'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                {trigger}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={customTrigger}
              onChange={(e) => setCustomTrigger(e.target.value)}
              placeholder="Add your own trigger..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTrigger())}
            />
            <button
              type="button"
              onClick={addCustomTrigger}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
            >
              Add
            </button>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-xl 
                     transition-all duration-200 transform hover:scale-105 disabled:transform-none
                     focus:outline-none focus:ring-4 focus:ring-primary-300 focus:ring-opacity-50"
          >
            {loading ? 'Creating Your Checklist...' : 'Generate My Personalized Checklist'}
          </button>
        </div>
      </form>
    </div>
  )
}