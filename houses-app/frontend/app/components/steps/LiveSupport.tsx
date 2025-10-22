'use client'

import { useState, useEffect, useRef } from 'react'

interface LiveSupportEntry {
  id: string
  timestamp: Date
  userInput: string
  suggestion: string
  sentimentAnalysis?: {
    tone: string
    confidence: number
    suggestions: string[]
  }
}

interface LiveSupportProps {
  sessionId: string
  session: any
  onUpdate: (session: any) => void
}

export function LiveSupport({ sessionId, session, onUpdate }: LiveSupportProps) {
  const [currentInput, setCurrentInput] = useState('')
  const [supportEntries, setSupportEntries] = useState<LiveSupportEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [isLive, setIsLive] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [supportEntries])

  const sendUpdate = async () => {
    if (!currentInput.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`http://localhost:3001/api/coaching/session/${sessionId}/live-support`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput: currentInput }),
      })

      if (response.ok) {
        const supportEntry = await response.json()
        setSupportEntries(prev => [...prev, {
          ...supportEntry,
          timestamp: new Date(supportEntry.timestamp)
        }])
        setCurrentInput('')
      }
    } catch (error) {
      console.error('Failed to send update:', error)
    } finally {
      setLoading(false)
    }
  }

  const proceedToNextStep = () => {
    const updatedSession = { ...session, currentStep: 6 }
    onUpdate(updatedSession)
  }

  const getToneEmoji = (tone: string) => {
    const toneEmojis = {
      anxious: '😰',
      positive: '😊',
      confused: '🤔',
      neutral: '😐',
      excited: '🎉',
      overwhelmed: '😵'
    }
    return toneEmojis[tone as keyof typeof toneEmojis] || '💭'
  }

  const getToneColor = (tone: string) => {
    const toneColors = {
      anxious: 'bg-orange-50 border-orange-200 text-orange-800',
      positive: 'bg-green-50 border-green-200 text-green-800',
      confused: 'bg-blue-50 border-blue-200 text-blue-800',
      neutral: 'bg-gray-50 border-gray-200 text-gray-800',
      excited: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      overwhelmed: 'bg-red-50 border-red-200 text-red-800'
    }
    return toneColors[tone as keyof typeof toneColors] || 'bg-gray-50 border-gray-200 text-gray-800'
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">🤝</div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Live Support
        </h2>
        <p className="text-gray-600 mb-4">
          During your event, you can send me quick updates for real-time encouragement and suggestions.
        </p>
        
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isLive 
                ? 'bg-success-100 text-success-800 border border-success-300'
                : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
            }`}
          >
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-success-500 animate-pulse' : 'bg-gray-400'}`} />
            {isLive ? 'Live Support Active' : 'Activate Live Support'}
          </button>
        </div>
      </div>

      {/* Live Support Interface */}
      {isLive && (
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          {/* Messages Area */}
          <div className="h-64 overflow-y-auto p-4 space-y-4">
            {supportEntries.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <div className="text-2xl mb-2">💙</div>
                <p className="text-sm">
                  Send me an update about how things are going and I'll provide real-time support!
                </p>
              </div>
            )}
            
            {supportEntries.map((entry) => (
              <div key={entry.id} className="space-y-3">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-primary-100 text-primary-800 rounded-lg px-4 py-2 max-w-xs">
                    <p className="text-sm">{entry.userInput}</p>
                    <p className="text-xs text-primary-600 mt-1">
                      {entry.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                {/* Coach Response */}
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2 max-w-xs">
                    <div className="flex items-center gap-2 mb-1">
                      {entry.sentimentAnalysis && (
                        <span className="text-lg">
                          {getToneEmoji(entry.sentimentAnalysis.tone)}
                        </span>
                      )}
                      <span className="text-xs font-medium text-gray-600">Coach</span>
                    </div>
                    <p className="text-sm">{entry.suggestion}</p>
                    
                    {entry.sentimentAnalysis && entry.sentimentAnalysis.suggestions.length > 1 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">More suggestions:</p>
                        <ul className="text-xs space-y-1">
                          {entry.sentimentAnalysis.suggestions.slice(1).map((suggestion, index) => (
                            <li key={index} className="text-gray-700">• {suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !loading && sendUpdate()}
                placeholder="How are things going? (e.g., 'feeling nervous', 'going well', 'confused about something')"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                disabled={loading}
              />
              <button
                onClick={sendUpdate}
                disabled={!currentInput.trim() || loading}
                className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-medium px-4 py-2 rounded-lg 
                         transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-300 focus:ring-opacity-50"
              >
                {loading ? '...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-calm-50 border border-calm-200 rounded-lg p-4">
          <h4 className="font-medium text-calm-800 mb-2 flex items-center gap-2">
            <span>🆘</span> If You're Overwhelmed
          </h4>
          <ul className="text-sm text-calm-700 space-y-1">
            <li>• Take slow, deep breaths</li>
            <li>• It's okay to say "Let me think about that"</li>
            <li>• You can excuse yourself for a bathroom break</li>
            <li>• Ground yourself: 5 things you see, 4 you hear, 3 you touch</li>
          </ul>
        </div>
        
        <div className="bg-success-50 border border-success-200 rounded-lg p-4">
          <h4 className="font-medium text-success-800 mb-2 flex items-center gap-2">
            <span>✨</span> You're Doing Great If...
          </h4>
          <ul className="text-sm text-success-700 space-y-1">
            <li>• You're being yourself</li>
            <li>• You're listening actively</li>
            <li>• You're asking questions when curious</li>
            <li>• You're taking breaks when needed</li>
          </ul>
        </div>
      </div>

      {/* Emergency Phrases */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-yellow-800 mb-3 flex items-center gap-2">
          <span>💬</span> Emergency Phrases (Copy & Use)
        </h4>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div className="bg-white p-3 rounded border">
            <strong className="text-yellow-800">Need processing time:</strong>
            <p className="text-gray-700 mt-1">"That's a great question. Let me think about that for a moment."</p>
          </div>
          <div className="bg-white p-3 rounded border">
            <strong className="text-yellow-800">Need clarification:</strong>
            <p className="text-gray-700 mt-1">"Could you help me understand what you mean by...?"</p>
          </div>
          <div className="bg-white p-3 rounded border">
            <strong className="text-yellow-800">Need a break:</strong>
            <p className="text-gray-700 mt-1">"Excuse me for just a moment. I'll be right back."</p>
          </div>
          <div className="bg-white p-3 rounded border">
            <strong className="text-yellow-800">Redirect conversation:</strong>
            <p className="text-gray-700 mt-1">"That's interesting. I'm curious about..."</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => window.open('tel:', '_self')}
          className="bg-red-100 hover:bg-red-200 text-red-800 font-medium py-3 px-6 rounded-xl 
                   transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-50"
        >
          🆘 Emergency Contact
        </button>
        
        <button
          onClick={proceedToNextStep}
          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-xl 
                   transition-all duration-200 transform hover:scale-105
                   focus:outline-none focus:ring-4 focus:ring-primary-300 focus:ring-opacity-50"
        >
          Continue to Reflection
        </button>
      </div>
    </div>
  )
}