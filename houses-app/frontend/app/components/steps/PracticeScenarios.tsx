'use client'

import { useState, useEffect } from 'react'

interface PracticeScenario {
  id: string
  scenario: string
  suggestedResponse: string
  userResponse?: string
  feedback?: string
}

interface PracticeScenariosProps {
  sessionId: string
  session: any
  onUpdate: (session: any) => void
}

export function PracticeScenarios({ sessionId, session, onUpdate }: PracticeScenariosProps) {
  const [scenarios, setScenarios] = useState<PracticeScenario[]>([])
  const [currentScenario, setCurrentScenario] = useState(0)
  const [userResponse, setUserResponse] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchScenarios()
  }, [])

  const fetchScenarios = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/coaching/session/${sessionId}/practice-scenarios`)
      if (response.ok) {
        const data = await response.json()
        setScenarios(data.scenarios)
      }
    } catch (error) {
      console.error('Failed to fetch scenarios:', error)
    } finally {
      setLoading(false)
    }
  }

  const submitResponse = async () => {
    if (!userResponse.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch(
        `http://localhost:3001/api/coaching/session/${sessionId}/practice/${scenarios[currentScenario].id}/response`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userResponse }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        setScenarios(prev => 
          prev.map(scenario => 
            scenario.id === scenarios[currentScenario].id 
              ? { ...scenario, userResponse, feedback: data.feedback }
              : scenario
          )
        )
        setUserResponse('')
      }
    } catch (error) {
      console.error('Failed to submit response:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1)
      setUserResponse('')
    }
  }

  const prevScenario = () => {
    if (currentScenario > 0) {
      setCurrentScenario(prev => prev - 1)
      setUserResponse('')
    }
  }

  const proceedToNextStep = () => {
    const updatedSession = { ...session, currentStep: 5 }
    onUpdate(updatedSession)
  }

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg text-center">
        <div className="animate-pulse-gentle text-4xl mb-4">🎭</div>
        <p className="text-gray-600">Preparing practice scenarios...</p>
      </div>
    )
  }

  if (scenarios.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg text-center">
        <div className="text-4xl mb-4">🎭</div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Practice Scenarios</h2>
        <p className="text-gray-600 mb-6">
          No specific scenarios available for your event type, but you're ready to move forward!
        </p>
        <button
          onClick={proceedToNextStep}
          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-xl 
                   transition-all duration-200 transform hover:scale-105
                   focus:outline-none focus:ring-4 focus:ring-primary-300 focus:ring-opacity-50"
        >
          Continue to Live Support
        </button>
      </div>
    )
  }

  const scenario = scenarios[currentScenario]

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">🎭</div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Practice Scenarios
        </h2>
        <p className="text-gray-600">
          Let's practice some common situations. This is a safe space to try different responses.
        </p>
      </div>

      {/* Scenario Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevScenario}
          disabled={currentScenario === 0}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 
                   disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>
        
        <div className="flex items-center gap-2">
          {scenarios.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentScenario(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentScenario
                  ? 'bg-primary-600'
                  : index < currentScenario || scenarios[index].userResponse
                  ? 'bg-success-400'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={nextScenario}
          disabled={currentScenario === scenarios.length - 1}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 
                   disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>

      {/* Current Scenario */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="text-2xl">🎬</div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Scenario {currentScenario + 1}</h3>
            <p className="text-gray-700 leading-relaxed">{scenario.scenario}</p>
          </div>
        </div>

        {/* User Response Input */}
        {!scenario.userResponse && (
          <div className="mt-6">
            <label htmlFor="response" className="block text-sm font-medium text-gray-700 mb-2">
              How would you respond?
            </label>
            <textarea
              id="response"
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              placeholder="Type your response here..."
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={submitResponse}
                disabled={!userResponse.trim() || submitting}
                className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg 
                         transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-300 focus:ring-opacity-50"
              >
                {submitting ? 'Getting Feedback...' : 'Get Feedback'}
              </button>
            </div>
          </div>
        )}

        {/* User's Response and Feedback */}
        {scenario.userResponse && (
          <div className="mt-6 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                <span>💬</span> Your Response
              </h4>
              <p className="text-blue-700">{scenario.userResponse}</p>
            </div>

            {scenario.feedback && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  <span>✨</span> Feedback
                </h4>
                <div className="text-green-700 text-sm whitespace-pre-line">
                  {scenario.feedback}
                </div>
              </div>
            )}

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                <span>💡</span> Suggested Response
              </h4>
              <p className="text-gray-700 text-sm">{scenario.suggestedResponse}</p>
            </div>
          </div>
        )}
      </div>

      {/* Encouragement */}
      <div className="bg-calm-50 border border-calm-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🌟</div>
          <div>
            <h4 className="font-medium text-calm-800 mb-1">You're Doing Great!</h4>
            <p className="text-sm text-calm-700">
              Remember, there's no "perfect" response. The goal is to feel more confident and prepared. 
              Your authentic voice is your strength.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => setCurrentScenario(0)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-xl 
                   transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50"
        >
          🔄 Review All Scenarios
        </button>
        
        <button
          onClick={proceedToNextStep}
          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-xl 
                   transition-all duration-200 transform hover:scale-105
                   focus:outline-none focus:ring-4 focus:ring-primary-300 focus:ring-opacity-50"
        >
          Continue to Live Support
        </button>
      </div>
    </div>
  )
}