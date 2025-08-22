'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Check, X, RotateCcw, BookOpen, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

// Sample grammar questions - in a real app, this would come from a database
const grammarQuestions = {
  'basic-grammar': [
    {
      question: 'Which word is a noun in the sentence: "The quick brown fox jumps over the lazy dog"?',
      options: ['quick', 'fox', 'jumps', 'over'],
      correct: 1,
      explanation: '"Fox" is a noun because it names a person, place, thing, or idea.'
    },
    {
      question: 'What is the subject in the sentence: "Students study grammar"?',
      options: ['Students', 'study', 'grammar', 'Students study'],
      correct: 0,
      explanation: '"Students" is the subject because it tells us who or what performs the action.'
    },
    {
      question: 'Which sentence uses the present simple tense?',
      options: ['I am studying', 'I study', 'I will study', 'I studied'],
      correct: 1,
      explanation: '"I study" uses the present simple tense to show habitual actions.'
    }
  ],
  'advanced-tenses': [
    {
      question: 'Which sentence uses the present perfect tense?',
      options: ['I have studied', 'I am studying', 'I will study', 'I studied'],
      correct: 0,
      explanation: '"I have studied" uses the present perfect tense to show completed actions with present relevance.'
    },
    {
      question: 'What tense is used in: "If I had known, I would have helped"?',
      options: ['Present perfect', 'Past perfect', 'Conditional perfect', 'Future perfect'],
      correct: 2,
      explanation: 'This is a conditional perfect sentence using "would have" + past participle.'
    }
  ],
  'sentence-structure': [
    {
      question: 'Which sentence is a compound sentence?',
      options: ['I like coffee.', 'I like coffee and tea.', 'I like coffee, which is bitter.', 'I like coffee because it wakes me up.'],
      correct: 1,
      explanation: 'A compound sentence joins two independent clauses with a conjunction like "and".'
    }
  ],
  'punctuation': [
    {
      question: 'Where should a comma be placed in: "However I disagree"?',
      options: ['After "However"', 'Before "However"', 'No comma needed', 'After "I"'],
      correct: 0,
      explanation: 'A comma should follow "However" when it begins a sentence.'
    }
  ],
  'common-errors': [
    {
      question: 'Which sentence has a subject-verb agreement error?',
      options: ['The students study hard.', 'The student study hard.', 'The students studies hard.', 'The student studies hard.'],
      correct: 2,
      explanation: '"The students studies" is incorrect because plural subjects need plural verbs.'
    }
  ]
}

const moduleTitles = {
  'basic-grammar': 'Basic Grammar Fundamentals',
  'advanced-tenses': 'Advanced Tenses & Verb Forms',
  'sentence-structure': 'Complex Sentence Structures',
  'punctuation': 'Punctuation & Mechanics',
  'common-errors': 'Common Grammar Errors'
}

export default function GrammarLearningPage() {
  const params = useParams()
  const router = useRouter()
  const moduleId = params.moduleId as string
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  const questions = grammarQuestions[moduleId as keyof typeof grammarQuestions] || []
  const currentQuestion = questions[currentQuestionIndex]

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

  const handleRestart = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setCorrectAnswers(0)
    setIsCompleted(false)
  }

  if (isCompleted) {
    const accuracy = Math.round((correctAnswers / questions.length) * 100)
    return (
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Module Complete!</h1>
          <p className="text-gray-600">Great job completing this grammar module</p>
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
            onClick={handleRestart}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Practice Again
          </button>
          <button
            onClick={() => router.push('/grammar')}
            className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Back to Grammar Modules
          </button>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Module Not Found</h1>
          <p className="text-gray-600 mb-6">The grammar module you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/grammar')}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Grammar Modules
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/grammar')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Modules</span>
        </button>
        
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-1">{moduleTitles[moduleId as keyof typeof moduleTitles]}</h1>
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
        <h3 className="font-semibold text-gray-900 mb-3">Session Progress</h3>
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

      {/* Study Tips */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Study Tip</h3>
        <p className="text-sm text-blue-800">
          Read each question carefully and consider all options before selecting your answer. Pay attention to the explanations to learn from any mistakes.
        </p>
      </div>
    </div>
  )
}
