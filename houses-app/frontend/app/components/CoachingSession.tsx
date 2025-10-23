'use client'

import { useState, useEffect } from 'react'
import { ContextCheckIn } from './steps/ContextCheckIn'
import { EmotionalCalibration } from './steps/EmotionalCalibration'
import { PersonalizedChecklist } from './steps/PersonalizedChecklist'
import { PracticeScenarios } from './steps/PracticeScenarios'
import { LiveSupport } from './steps/LiveSupport'
import { PostReflection } from './steps/PostReflection'

interface CoachingSessionProps {
  sessionId: string
}

export function CoachingSession({ sessionId }: CoachingSessionProps) {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSession()
  }, [sessionId])

  const fetchSession = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/coaching/session/${sessionId}`)
      if (response.ok) {
        const sessionData = await response.json()
        setSession(sessionData)
      }
    } catch (error) {
      console.error('Failed to fetch session:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSession = (updatedSession: any) => {
    setSession(updatedSession)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="animate-pulse-gentle text-4xl mb-4">🌟</div>
        <p className="text-gray-600">Loading your coaching session...</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="text-4xl mb-4">😔</div>
        <p className="text-gray-600">Session not found. Please try starting a new session.</p>
      </div>
    )
  }

  const renderCurrentStep = () => {
    switch (session.currentStep) {
      case 1:
        return <ContextCheckIn sessionId={sessionId} onUpdate={updateSession} />
      case 2:
        return <EmotionalCalibration sessionId={sessionId} onUpdate={updateSession} />
      case 3:
        return <PersonalizedChecklist sessionId={sessionId} session={session} onUpdate={updateSession} />
      case 4:
        return <PracticeScenarios sessionId={sessionId} session={session} onUpdate={updateSession} />
      case 5:
        return <LiveSupport sessionId={sessionId} session={session} onUpdate={updateSession} />
      case 6:
        return <PostReflection sessionId={sessionId} session={session} onUpdate={updateSession} />
      default:
        return <div>Unknown step</div>
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">Step {session.currentStep} of 6</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(session.currentStep / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Step navigation */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {[
          { num: 1, label: 'Context', icon: '📝' },
          { num: 2, label: 'Emotions', icon: '💭' },
          { num: 3, label: 'Checklist', icon: '✅' },
          { num: 4, label: 'Practice', icon: '🎭' },
          { num: 5, label: 'Live Support', icon: '🤝' },
          { num: 6, label: 'Reflection', icon: '🌟' },
        ].map((step) => (
          <div
            key={step.num}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
              session.currentStep === step.num
                ? 'bg-primary-100 text-primary-800 border border-primary-300'
                : session.currentStep > step.num
                ? 'bg-success-100 text-success-800'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <span>{step.icon}</span>
            <span className="hidden sm:inline">{step.label}</span>
          </div>
        ))}
      </div>

      {/* Current step content */}
      <div className="animate-fade-in">
        {renderCurrentStep()}
      </div>
    </div>
  )
}