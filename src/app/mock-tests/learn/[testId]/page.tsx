'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Check, X, Clock, FileText, Play, Pause } from 'lucide-react'
import { cn } from '@/lib/utils'

// Sample mock test questions - in a real app, this would come from a database
const mockTestData = {
  'test-1': {
    title: 'Mock Test 1 - Full CELPIP',
    description: 'Complete practice test covering all modules',
    duration: 180, // minutes
    questions: [
      {
        id: 1,
        module: 'Listening',
        question: 'What is the main topic of the conversation?',
        options: ['Weather', 'Travel plans', 'Work schedule', 'Shopping'],
        correct: 1,
        explanation: 'The conversation focuses on discussing travel arrangements and plans.'
      },
      {
        id: 2,
        module: 'Reading',
        question: 'According to the passage, what is the primary benefit of exercise?',
        options: ['Weight loss', 'Mental health', 'Social interaction', 'All of the above'],
        correct: 3,
        explanation: 'The passage mentions multiple benefits including physical, mental, and social advantages.'
      },
      {
        id: 3,
        module: 'Writing',
        question: 'In an email to a colleague, which opening is most appropriate?',
        options: ['Hey there!', 'Dear Mr. Smith,', 'Hi John,', 'To whom it may concern,'],
        correct: 2,
        explanation: 'For a colleague, "Hi John," is professional yet friendly.'
      },
      {
        id: 4,
        module: 'Speaking',
        question: 'When describing a personal experience, you should:',
        options: ['Use only past tense', 'Include specific details', 'Avoid emotions', 'Keep it brief'],
        correct: 1,
        explanation: 'Specific details make your experience more engaging and clear.'
      }
    ]
  },
  'test-2': {
    title: 'Mock Test 2 - Advanced Level',
    description: 'High-difficulty questions for advanced preparation',
    duration: 180,
    questions: [
      {
        id: 1,
        module: 'Listening',
        question: 'What inference can be made from the speaker\'s tone?',
        options: ['They are excited', 'They are concerned', 'They are indifferent', 'They are angry'],
        correct: 1,
        explanation: 'The speaker\'s tone indicates concern about the situation.'
      },
      {
        id: 2,
        module: 'Reading',
        question: 'The author\'s argument is primarily based on:',
        options: ['Personal opinion', 'Statistical evidence', 'Anecdotal examples', 'Expert testimony'],
        correct: 1,
        explanation: 'The author uses statistical data to support their main points.'
      }
    ]
  },
  'test-3': {
    title: 'Mock Test 3 - Time Pressure',
    description: 'Practice under strict time constraints',
    duration: 150,
    questions: [
      {
        id: 1,
        module: 'Listening',
        question: 'What is the speaker\'s recommendation?',
        options: ['Wait longer', 'Take action now', 'Ignore the issue', 'Seek advice'],
        correct: 1,
        explanation: 'The speaker clearly recommends taking immediate action.'
      }
    ]
  },
  'test-4': {
    title: 'Mock Test 4 - Academic Focus',
    description: 'Emphasis on academic vocabulary and structures',
    duration: 180,
    questions: [
      {
        id: 1,
        module: 'Reading',
        question: 'The term "paradigm shift" refers to:',
        options: ['Gradual change', 'Complete transformation', 'Minor adjustment', 'Temporary setback'],
        correct: 1,
        explanation: 'A paradigm shift represents a fundamental change in approach or understanding.'
      }
    ]
  },
  'test-5': {
    title: 'Mock Test 5 - Final Challenge',
    description: 'Ultimate test combining all difficulty levels',
    duration: 180,
    questions: [
      {
        id: 1,
        module: 'Writing',
        question: 'Which sentence demonstrates parallel structure?',
        options: ['I like reading, writing, and to study.', 'I like reading, writing, and studying.', 'I like to read, writing, and studying.', 'I like reading, to write, and studying.'],
        correct: 1,
        explanation: 'All three items use the same grammatical form (gerunds).'
      }
    ]
  }
}

export default function MockTestPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.testId as string
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isStarted, setIsStarted] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const testData = mockTestData[testId as keyof typeof mockTestData]
  const questions = testData?.questions || []
  const currentQuestion = questions[currentQuestionIndex]

  useEffect(() => {
    if (isStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsCompleted(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isStarted, timeRemaining])

  const handleStartTest = () => {
    setIsStarted(true)
    setTimeRemaining(testData.duration * 60) // Convert to seconds
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return
    
    if (selectedAnswer === currentQuestion.correct) {
      setCorrectAnswers(correctAnswers + 1)
    }
    
    setShowExplanation(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setIsCompleted(true)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!testData) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Test Not Found</h1>
          <p className="text-gray-600 mb-6">The mock test you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/mock-tests')}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Mock Tests
          </button>
        </div>
      </div>
    )
  }

  if (!isStarted) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="mb-6">
          <button
            onClick={() => router.push('/mock-tests')}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Tests</span>
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{testData.title}</h1>
          <p className="text-gray-600 mb-4">{testData.description}</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{testData.duration} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Questions:</span>
              <span className="font-medium">{questions.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Modules:</span>
              <span className="font-medium">Listening, Reading, Writing, Speaking</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">📝 Test Instructions</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Read each question carefully</li>
            <li>• Select the best answer from the options</li>
            <li>• You can review explanations after answering</li>
            <li>• Complete all questions within the time limit</li>
            <li>• Your progress will be saved automatically</li>
          </ul>
        </div>

        <button
          onClick={handleStartTest}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Start Test
        </button>
      </div>
    )
  }

  if (isCompleted) {
    const accuracy = Math.round((correctAnswers / questions.length) * 100)
    return (
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Test Complete!</h1>
          <p className="text-gray-600">Great job completing this mock test</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Results</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{correctAnswers}</div>
                <div className="text-sm text-blue-700">Correct Answers</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
                <div className="text-sm text-green-700">Accuracy</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              You answered {correctAnswers} out of {questions.length} questions correctly
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push('/mock-tests')}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Mock Tests
          </button>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Questions Available</h1>
          <p className="text-gray-600 mb-6">This test doesn't have any questions yet.</p>
          <button
            onClick={() => router.push('/mock-tests')}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Mock Tests
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      {/* Header with Timer */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.push('/mock-tests')}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Test</span>
          </button>
          
          <div className="flex items-center space-x-2 bg-red-100 px-3 py-2 rounded-lg">
            <Clock className="w-4 h-4 text-red-600" />
            <span className="font-medium text-red-700">{formatTime(timeRemaining)}</span>
          </div>
        </div>
        
        <div className="text-center">
          <h1 className="text-lg font-bold text-gray-900 mb-1">{testData.title}</h1>
          <p className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
        <div className="mb-4">
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mb-3">
            {currentQuestion.module}
          </span>
        </div>
        
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{currentQuestion.question}</h2>
        
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showExplanation}
              className={cn(
                'w-full p-3 text-left rounded-lg border transition-colors',
                selectedAnswer === index
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400',
                showExplanation && index === currentQuestion.correct
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : '',
                showExplanation && selectedAnswer === index && index !== currentQuestion.correct
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : ''
              )}
            >
              {String.fromCharCode(65 + index)}. {option}
            </button>
          ))}
        </div>

        {!showExplanation ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            className={cn(
              'w-full py-3 px-6 rounded-lg font-medium transition-colors',
              selectedAnswer === null
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            )}
          >
            Submit Answer
          </button>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Explanation:</h3>
              <p className="text-blue-800">{currentQuestion.explanation}</p>
            </div>
            
            <button
              onClick={handleNextQuestion}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Next Question
            </button>
          </div>
        )}
      </div>

      {/* Session Stats */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Test Progress</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{correctAnswers}</div>
            <div className="text-sm text-gray-600">Correct Answers</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{currentQuestionIndex + 1}</div>
            <div className="text-sm text-gray-600">Questions Answered</div>
          </div>
        </div>
      </div>
    </div>
  )
}
