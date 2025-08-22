'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, Volume2, RotateCcw, CheckCircle, XCircle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

// Sample data for demonstration
const sampleCards = [
  {
    id: '1',
    term: 'ubiquitous',
    definition: 'Present, appearing, or found everywhere',
    partOfSpeech: 'adjective',
    example: 'Mobile phones have become ubiquitous in modern society.',
    synonyms: 'omnipresent, universal, widespread',
    difficulty: 'H'
  },
  {
    id: '2',
    term: 'procrastinate',
    definition: 'Delay or postpone action; put off doing something',
    partOfSpeech: 'verb',
    example: 'Don\'t procrastinate on your CELPIP preparation.',
    synonyms: 'delay, postpone, defer',
    difficulty: 'M'
  },
  {
    id: '3',
    term: 'eloquent',
    definition: 'Fluent or persuasive in speaking or writing',
    partOfSpeech: 'adjective',
    example: 'Her eloquent speech moved the entire audience.',
    synonyms: 'articulate, fluent, persuasive',
    difficulty: 'M'
  }
]

export default function ReviewPage() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [reviewHistory, setReviewHistory] = useState<Array<{cardId: string, quality: number}>>([])
  const [isReviewing, setIsReviewing] = useState(false)

  const currentCard = sampleCards[currentCardIndex]
  const progress = (currentCardIndex / sampleCards.length) * 100

  const handleShowAnswer = () => {
    setShowAnswer(true)
  }

  const handleQualityRating = (quality: number) => {
    if (!currentCard) return

    setReviewHistory(prev => [...prev, { cardId: currentCard.id, quality }])
    
    if (currentCardIndex < sampleCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1)
      setShowAnswer(false)
    } else {
      // Review complete
      setIsReviewing(false)
    }
  }

  const startReview = () => {
    setCurrentCardIndex(0)
    setShowAnswer(false)
    setReviewHistory([])
    setIsReviewing(true)
  }

  const resetReview = () => {
    setCurrentCardIndex(0)
    setShowAnswer(false)
    setReviewHistory([])
    setIsReviewing(false)
  }

  if (!isReviewing) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Vocabulary Review</h1>
          <p className="text-gray-600 mb-8">
            Review your vocabulary cards using spaced repetition
          </p>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Queue</h2>
            <div className="space-y-3 text-left">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New cards</span>
                <span className="font-medium text-blue-600">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Learning</span>
                <span className="font-medium text-orange-600">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Review</span>
                <span className="font-medium text-green-600">0</span>
              </div>
            </div>
          </div>

          <button
            onClick={startReview}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Start Review
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Card {currentCardIndex + 1} of {sampleCards.length}
          </span>
          <span className="text-sm text-gray-600">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
        <div className="text-center mb-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mb-3">
            {currentCard.partOfSpeech}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentCard.term}
          </h2>
          <div className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
            {currentCard.difficulty === 'E' ? 'Easy' : currentCard.difficulty === 'M' ? 'Medium' : 'Hard'}
          </div>
        </div>

        {!showAnswer ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Think about the definition of this word...
            </p>
            <button
              onClick={handleShowAnswer}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Show Answer
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Definition:</h3>
              <p className="text-gray-700">{currentCard.definition}</p>
            </div>
            
            {currentCard.synonyms && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Synonyms:</h3>
                <p className="text-gray-700">{currentCard.synonyms}</p>
              </div>
            )}
            
            {currentCard.example && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Example:</h3>
                <p className="text-gray-700 italic">"{currentCard.example}"</p>
              </div>
            )}

            {/* Quality Rating Buttons */}
            <div className="pt-4">
              <p className="text-sm text-gray-600 text-center mb-4">
                How well did you know this word?
              </p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Again', color: 'bg-red-500 hover:bg-red-600', quality: 1 },
                  { label: 'Hard', color: 'bg-orange-500 hover:bg-orange-600', quality: 2 },
                  { label: 'Good', color: 'bg-green-500 hover:bg-green-600', quality: 3 },
                  { label: 'Easy', color: 'bg-blue-500 hover:bg-blue-600', quality: 4 }
                ].map((button) => (
                  <button
                    key={button.quality}
                    onClick={() => handleQualityRating(button.quality)}
                    className={cn(
                      'text-white py-3 px-2 rounded-lg font-medium transition-colors text-sm',
                      button.color
                    )}
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Review Complete */}
      {currentCardIndex === sampleCards.length - 1 && showAnswer && (
        <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Review Complete!</h2>
          <p className="text-gray-600 mb-4">
            Great job! You've reviewed all {sampleCards.length} cards.
          </p>
          <button
            onClick={resetReview}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Review Again
          </button>
        </div>
      )}
    </div>
  )
}
