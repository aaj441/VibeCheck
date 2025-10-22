'use client'

import { useState, useEffect } from 'react'

interface ChecklistItem {
  id: string
  category: 'preparation' | 'comfort' | 'conversation' | 'safety' | 'sensory'
  title: string
  description: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
}

interface PersonalizedChecklistProps {
  sessionId: string
  session: any
  onUpdate: (session: any) => void
}

export function PersonalizedChecklist({ sessionId, session, onUpdate }: PersonalizedChecklistProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChecklist()
  }, [])

  const fetchChecklist = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/coaching/session/${sessionId}/checklist`)
      if (response.ok) {
        const data = await response.json()
        setChecklist(data.checklist)
      }
    } catch (error) {
      console.error('Failed to fetch checklist:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleItem = async (itemId: string, completed: boolean) => {
    try {
      const response = await fetch(`http://localhost:3001/api/coaching/session/${sessionId}/checklist/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
      })

      if (response.ok) {
        setChecklist(prev => 
          prev.map(item => 
            item.id === itemId ? { ...item, completed } : item
          )
        )
      }
    } catch (error) {
      console.error('Failed to update checklist item:', error)
    }
  }

  const proceedToNextStep = () => {
    // Update session to move to next step
    const updatedSession = { ...session, currentStep: 4 }
    onUpdate(updatedSession)
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      preparation: '📋',
      comfort: '🤗',
      conversation: '💬',
      safety: '🛡️',
      sensory: '🎧'
    }
    return icons[category as keyof typeof icons] || '📝'
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      preparation: 'bg-blue-100 border-blue-300 text-blue-800',
      comfort: 'bg-green-100 border-green-300 text-green-800',
      conversation: 'bg-purple-100 border-purple-300 text-purple-800',
      safety: 'bg-red-100 border-red-300 text-red-800',
      sensory: 'bg-yellow-100 border-yellow-300 text-yellow-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 border-gray-300 text-gray-800'
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'text-red-600',
      medium: 'text-yellow-600',
      low: 'text-green-600'
    }
    return colors[priority as keyof typeof colors] || 'text-gray-600'
  }

  const completedCount = checklist.filter(item => item.completed).length
  const totalCount = checklist.length

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg text-center">
        <div className="animate-pulse-gentle text-4xl mb-4">✨</div>
        <p className="text-gray-600">Creating your personalized checklist...</p>
      </div>
    )
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">✅</div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Your Personalized Checklist
        </h2>
        <p className="text-gray-600 mb-4">
          Based on your event type, feelings, and triggers, here's your custom preparation list.
        </p>
        
        {/* Progress */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress: {completedCount} of {totalCount} completed
            </span>
            <span className="text-sm text-gray-500">
              {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-success-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-4 mb-8">
        {checklist.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-lg border-2 transition-all ${
              item.completed 
                ? 'bg-success-50 border-success-200' 
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-4">
              <button
                onClick={() => toggleItem(item.id, !item.completed)}
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all ${
                  item.completed
                    ? 'bg-success-500 border-success-500 text-white'
                    : 'border-gray-300 hover:border-success-400'
                }`}
              >
                {item.completed && (
                  <svg className="w-4 h-4 mx-auto mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{getCategoryIcon(item.category)}</span>
                  <h4 className={`font-medium ${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {item.title}
                  </h4>
                  <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                  <span className={`text-xs font-medium ${getPriorityColor(item.priority)}`}>
                    {item.priority} priority
                  </span>
                </div>
                <p className={`text-sm ${item.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Encouragement */}
      <div className="bg-calm-50 border border-calm-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💙</div>
          <div>
            <h4 className="font-medium text-calm-800 mb-1">Remember</h4>
            <p className="text-sm text-calm-700">
              This checklist is here to support you, not stress you out. You don't need to complete everything perfectly. 
              Do what feels manageable and helpful for you today.
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
          📄 Save/Print Checklist
        </button>
        
        <button
          onClick={proceedToNextStep}
          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-xl 
                   transition-all duration-200 transform hover:scale-105
                   focus:outline-none focus:ring-4 focus:ring-primary-300 focus:ring-opacity-50"
        >
          Continue to Practice Scenarios
        </button>
      </div>
    </div>
  )
}