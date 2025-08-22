'use client'

import { useState, useRef, useEffect } from 'react'
import { PenTool, Clock, Save, CheckCircle, Target, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

const writingTasks = [
  {
    id: 'task1',
    title: 'Task 1: Email Writing',
    description: 'Write a professional email based on the given scenario',
    timeLimit: 27,
    wordLimit: 150,
    template: `Dear [Recipient Name],

I hope this email finds you well. I am writing to [purpose of email].

[Body paragraph with details and explanation]

[Additional information or request if applicable]

Thank you for your time and consideration. I look forward to hearing from you.

Best regards,
[Your Name]`,
    rubric: {
      content: 'Addresses all points clearly and completely',
      coherence: 'Well-organized with logical flow',
      vocabulary: 'Appropriate and varied word choice',
      grammar: 'Accurate grammar and sentence structure',
      taskFulfillment: 'Meets all requirements and purpose'
    }
  },
  {
    id: 'task2',
    title: 'Task 2: Survey Response',
    description: 'Respond to a survey question with your opinion and reasoning',
    timeLimit: 30,
    wordLimit: 200,
    template: `[Introduction - State your position clearly]

[First supporting point with explanation and example]

[Second supporting point with explanation and example]

[Counter-argument and refutation if applicable]

[Conclusion - Restate position and summarize key points]`,
    rubric: {
      content: 'Clear position with strong supporting arguments',
      coherence: 'Logical organization and smooth transitions',
      vocabulary: 'Sophisticated and appropriate language',
      grammar: 'Complex sentence structures used correctly',
      taskFulfillment: 'Fully addresses the survey question'
    }
  }
]

export default function WritePage() {
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [isWriting, setIsWriting] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [wordCount, setWordCount] = useState(0)
  const [content, setContent] = useState('')
  const [showRubric, setShowRubric] = useState(false)
  const [selfAssessment, setSelfAssessment] = useState<Record<string, number>>({})
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const currentTask = writingTasks.find(task => task.id === selectedTask)

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
    console.log('Saving draft:', { content, wordCount, timeSpent: currentTask?.timeLimit * 60 - timeRemaining })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!selectedTask) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Writing Practice</h1>
          <p className="text-gray-600">
            Choose a writing task to practice your CELPIP writing skills
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
                  <p className="text-xs text-blue-700">{description}</p>
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
