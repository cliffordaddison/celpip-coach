'use client'

import { useState, useRef, useEffect } from 'react'
import { PenTool, Clock, Save, CheckCircle, Target, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

// This will be populated with real data from database
const writingTasks: any[] = []

export default function WritePage() {
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [isWriting, setIsWriting] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [wordCount, setWordCount] = useState(0)
  const [content, setContent] = useState('')
  const [showRubric, setShowRubric] = useState(false)
  const [selfAssessment, setSelfAssessment] = useState<Record<string, number>>({})
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [writingTasks, setWritingTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const currentTask = writingTasks.find(task => task.id === selectedTask)

  useEffect(() => {
    async function fetchWritingData() {
      try {
        setLoading(true)
        const response = await fetch('/api/writing/templates')
        if (response.ok) {
          const data = await response.json()
          setWritingTasks(data.templates || [])
        } else {
          throw new Error('Failed to fetch writing data')
        }
      } catch (error) {
        console.error('Error fetching writing data:', error)
        setError('Failed to load writing templates')
      } finally {
        setLoading(false)
      }
    }
    
    fetchWritingData()
  }, [])

  useEffect(() => {
    if (isWriting && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsWriting(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isWriting, timeRemaining])

  const startWriting = () => {
    if (!currentTask) return
    setIsWriting(true)
    setTimeRemaining(currentTask.timeLimit * 60)
    setContent('')
    setWordCount(0)
    setSelfAssessment({})
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setContent(text)
    setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length)
  }

  const handleSelfAssessment = (criterion: string, score: number) => {
    setSelfAssessment(prev => ({ ...prev, [criterion]: score }))
  }

  const saveDraft = () => {
    // Save draft logic here
    console.log('Saving draft:', { content, wordCount, timeSpent: (currentTask?.timeLimit || 0) * 60 - timeRemaining })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Loading Writing Templates...</h1>
          <p className="text-gray-600">Fetching your real CELPIP writing content from the database</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Error Loading Writing</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!selectedTask) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Writing Practice</h1>
          <p className="text-gray-600">
            Choose a writing task to practice your CELPIP writing skills with {writingTasks.length} real templates
          </p>
        </div>

        <div className="space-y-4">
          {writingTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-lg p-4 shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedTask(task.id)}
            >
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <PenTool className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{task.timeLimit} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileText className="w-3 h-3" />
                      <span>{task.wordLimit} words</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!isWriting) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="mb-6">
          <button
            onClick={() => setSelectedTask(null)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <PenTool className="w-4 h-4" />
            <span>← Back to Tasks</span>
          </button>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{currentTask?.title}</h1>
          <p className="text-gray-600 mb-4">{currentTask?.description}</p>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Task Requirements</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex justify-between">
                <span>Time Limit:</span>
                <span className="font-medium">{currentTask?.timeLimit} minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Word Limit:</span>
                <span className="font-medium">{currentTask?.wordLimit} words</span>
              </div>
            </div>
          </div>

          <button
            onClick={startWriting}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Start Writing
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      {/* Header with Timer */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-4">{currentTask?.title}</h1>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-red-500" />
              <span className="font-medium text-red-700">Time Remaining</span>
            </div>
            <div className="text-2xl font-bold text-red-600">
              {formatTime(timeRemaining)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            Words: <span className="font-medium">{wordCount}</span>
            {currentTask?.wordLimit && (
              <span className="text-gray-400"> / {currentTask.wordLimit}</span>
            )}
          </div>
          <button
            onClick={saveDraft}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>
        </div>
      </div>

      {/* Writing Area */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          placeholder="Start writing your response here..."
          className="w-full h-64 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Template Toggle */}
      <div className="mb-6">
        <button
          onClick={() => setShowRubric(!showRubric)}
          className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          {showRubric ? 'Hide' : 'Show'} Template & Rubric
        </button>
      </div>

      {/* Template and Rubric */}
      {showRubric && (
        <div className="space-y-4 mb-6">
          {/* Template */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">📝 Template</h3>
            <pre className="text-sm text-green-800 whitespace-pre-wrap font-sans">
              {currentTask?.template}
            </pre>
          </div>

          {/* Self-Assessment Rubric */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3">📊 Self-Assessment</h3>
            <div className="space-y-3">
              {currentTask?.rubric && Object.entries(currentTask.rubric).map(([criterion, description]) => (
                <div key={criterion} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-800 capitalize">
                      {criterion.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-xs text-blue-600">
                      {selfAssessment[criterion] || 0}/5
                    </span>
                  </div>
                  <p className="text-xs text-blue-700">{String(description)}</p>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <button
                        key={score}
                        onClick={() => handleSelfAssessment(criterion, score)}
                        className={cn(
                          'w-8 h-8 rounded text-xs font-medium transition-colors',
                          selfAssessment[criterion] === score
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-blue-600 border border-blue-300 hover:bg-blue-50'
                        )}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={() => setIsWriting(false)}
          className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors"
        >
          Pause
        </button>
        <button
          onClick={() => {
            setIsWriting(false)
            // Submit logic here
          }}
          className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  )
}
