'use client'

import { useState } from 'react'
import { CoachingSession } from './components/CoachingSession'

export default function Home() {
  const [sessionStarted, setSessionStarted] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  const startSession = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/coaching/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: 'demo-user' }),
      })
      
      if (response.ok) {
        const session = await response.json()
        setSessionId(session.id)
        setSessionStarted(true)
      }
    } catch (error) {
      console.error('Failed to start session:', error)
    }
  }

  if (sessionStarted && sessionId) {
    return <CoachingSession sessionId={sessionId} />
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="text-6xl mb-6">🌟</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Your Social Interaction Coach
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          A safe, judgment-free space designed specifically for neurodivergent individuals 
          to prepare for dates, interviews, networking events, and other social situations.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="text-3xl mb-3">🧠</div>
          <h3 className="font-semibold text-gray-800 mb-2">Neurodivergent-Friendly</h3>
          <p className="text-gray-600 text-sm">
            Designed with ADHD, autism, and social anxiety in mind. Clear steps, 
            visual cues, and sensory considerations.
          </p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="text-3xl mb-3">📋</div>
          <h3 className="font-semibold text-gray-800 mb-2">Step-by-Step Guidance</h3>
          <p className="text-gray-600 text-sm">
            Six structured steps from preparation to reflection. 
            Personalized checklists and practice scenarios.
          </p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="text-3xl mb-3">💙</div>
          <h3 className="font-semibold text-gray-800 mb-2">Empathetic Support</h3>
          <p className="text-gray-600 text-sm">
            Real-time encouragement, grounding techniques, 
            and celebration of your unique strengths.
          </p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          What We'll Cover Together
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">1</div>
            <div>
              <h4 className="font-medium text-gray-800">Context Check-In</h4>
              <p className="text-gray-600 text-sm">Tell me about your upcoming event and how you're feeling</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">2</div>
            <div>
              <h4 className="font-medium text-gray-800">Emotional Calibration</h4>
              <p className="text-gray-600 text-sm">Mood sliders and identifying any worries or triggers</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">3</div>
            <div>
              <h4 className="font-medium text-gray-800">Personalized Checklist</h4>
              <p className="text-gray-600 text-sm">Custom preparation list based on your needs and triggers</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">4</div>
            <div>
              <h4 className="font-medium text-gray-800">Practice & Simulation</h4>
              <p className="text-gray-600 text-sm">Safe space to practice responses and get gentle feedback</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">5</div>
            <div>
              <h4 className="font-medium text-gray-800">Live Support</h4>
              <p className="text-gray-600 text-sm">Real-time encouragement and suggestions during your event</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">6</div>
            <div>
              <h4 className="font-medium text-gray-800">Reflection & Growth</h4>
              <p className="text-gray-600 text-sm">Celebrate successes and learn from the experience</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={startSession}
          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-8 rounded-xl 
                   transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl
                   focus:outline-none focus:ring-4 focus:ring-primary-300 focus:ring-opacity-50"
        >
          Start Your Coaching Session
        </button>
        
        <p className="text-sm text-gray-500 mt-4">
          Take your time - there's no rush. You're in control of the pace.
        </p>
      </div>
    </div>
  )
}