'use client'

import { useState } from 'react'

interface PostReflectionProps {
  sessionId: string
  session: any
  onUpdate: (session: any) => void
}

export function PostReflection({ sessionId, session, onUpdate }: PostReflectionProps) {
  const [formData, setFormData] = useState({
    whatWorked: '',
    whatWasTough: '',
    additionalFeedback: ''
  })
  const [reflection, setReflection] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`http://localhost:3001/api/coaching/session/${sessionId}/reflection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const reflectionData = await response.json()
        setReflection(reflectionData)
      }
    } catch (error) {
      console.error('Failed to submit reflection:', error)
    } finally {
      setLoading(false)
    }
  }

  const startNewSession = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/coaching/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: 'demo-user' }),
      })
      
      if (response.ok) {
        const newSession = await response.json()
        onUpdate(newSession)
      }
    } catch (error) {
      console.error('Failed to start new session:', error)
    }
  }

  if (reflection) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            You Did It!
          </h2>
          <p className="text-lg text-gray-600">
            Congratulations on completing your social interaction. That took courage! 💙
          </p>
        </div>

        {/* Celebration */}
        <div className="bg-gradient-to-r from-success-50 to-primary-50 border border-success-200 rounded-xl p-6 mb-8">
          <div className="text-center">
            <div className="text-4xl mb-3">⭐</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              You Should Be Proud
            </h3>
            <p className="text-gray-700">
              Taking on social interactions as a neurodivergent person requires extra energy and courage. 
              You showed up authentically, and that's what matters most.
            </p>
          </div>
        </div>

        {/* What Worked */}
        {reflection.whatWorked && (
          <div className="bg-success-50 border border-success-200 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-success-800 mb-3 flex items-center gap-2">
              <span>✅</span> What Worked Well
            </h4>
            <p className="text-success-700">{reflection.whatWorked}</p>
          </div>
        )}

        {/* What Was Tough */}
        {reflection.whatWasTough && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
              <span>🤔</span> What Was Challenging
            </h4>
            <p className="text-orange-700 mb-3">{reflection.whatWasTough}</p>
            <div className="bg-white p-3 rounded border border-orange-200">
              <p className="text-sm text-orange-800">
                <strong>Remember:</strong> Challenges are learning opportunities, not failures. 
                Every interaction teaches us something valuable about ourselves and others.
              </p>
            </div>
          </div>
        )}

        {/* Follow-up Actions */}
        {reflection.followUpActions && reflection.followUpActions.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h4 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <span>📋</span> Your Follow-Up Action Plan
            </h4>
            <ul className="space-y-2">
              {reflection.followUpActions.map((action: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-blue-700">{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Neurodivergent Affirmations */}
        <div className="bg-calm-50 border border-calm-200 rounded-lg p-6 mb-8">
          <h4 className="font-semibold text-calm-800 mb-4 flex items-center gap-2">
            <span>💙</span> Affirmations for You
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white p-3 rounded border border-calm-200">
              <p className="text-calm-800">
                <strong>Your neurodivergent traits are strengths.</strong> Your unique perspective, 
                attention to detail, and authentic way of being add value to every interaction.
              </p>
            </div>
            <div className="bg-white p-3 rounded border border-calm-200">
              <p className="text-calm-800">
                <strong>Progress over perfection.</strong> Every social interaction is practice. 
                You're building skills and confidence with each experience.
              </p>
            </div>
            <div className="bg-white p-3 rounded border border-calm-200">
              <p className="text-calm-800">
                <strong>You belong in social spaces.</strong> Your voice matters, your presence 
                is valuable, and you deserve meaningful connections.
              </p>
            </div>
            <div className="bg-white p-3 rounded border border-calm-200">
              <p className="text-calm-800">
                <strong>Self-care is not selfish.</strong> Taking time to recharge and process 
                your experience is essential and healthy.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.print()}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-xl 
                     transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50"
          >
            📄 Save This Reflection
          </button>
          
          <button
            onClick={startNewSession}
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-xl 
                     transition-all duration-200 transform hover:scale-105
                     focus:outline-none focus:ring-4 focus:ring-primary-300 focus:ring-opacity-50"
          >
            🌟 Start New Coaching Session
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">🌟</div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Post-Interaction Reflection
        </h2>
        <p className="text-gray-600">
          Let's reflect on your experience. This helps process what happened and celebrate your growth.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* What Worked */}
        <div>
          <label htmlFor="whatWorked" className="block text-sm font-medium text-gray-700 mb-2">
            What worked well? What are you proud of? ✨
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Even small wins count! Maybe you made eye contact, asked a good question, or stayed calm during an awkward moment.
          </p>
          <textarea
            id="whatWorked"
            value={formData.whatWorked}
            onChange={(e) => setFormData(prev => ({ ...prev, whatWorked: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={3}
            placeholder="I'm proud that I..."
          />
        </div>

        {/* What Was Tough */}
        <div>
          <label htmlFor="whatWasTough" className="block text-sm font-medium text-gray-700 mb-2">
            What felt challenging or tough? 🤔
          </label>
          <p className="text-xs text-gray-500 mb-3">
            It's okay to acknowledge difficulties. This isn't about judgment - it's about learning and growth.
          </p>
          <textarea
            id="whatWasTough"
            value={formData.whatWasTough}
            onChange={(e) => setFormData(prev => ({ ...prev, whatWasTough: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={3}
            placeholder="I found it difficult when..."
          />
        </div>

        {/* Additional Feedback */}
        <div>
          <label htmlFor="additionalFeedback" className="block text-sm font-medium text-gray-700 mb-2">
            Anything else you'd like to share? 💭
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Emotions, surprises, insights, or anything else on your mind.
          </p>
          <textarea
            id="additionalFeedback"
            value={formData.additionalFeedback}
            onChange={(e) => setFormData(prev => ({ ...prev, additionalFeedback: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={2}
            placeholder="I also want to mention..."
          />
        </div>

        {/* Encouragement */}
        <div className="bg-calm-50 border border-calm-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💙</div>
            <div>
              <h4 className="font-medium text-calm-800 mb-1">Take Your Time</h4>
              <p className="text-sm text-calm-700">
                There's no rush to fill this out. Process your experience at your own pace. 
                Every interaction is a step forward in your journey.
              </p>
            </div>
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
            {loading ? 'Processing Your Reflection...' : 'Complete My Reflection'}
          </button>
        </div>
      </form>
    </div>
  )
}