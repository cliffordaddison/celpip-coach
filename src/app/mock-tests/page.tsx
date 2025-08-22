'use client'

import { useState } from 'react'
import { FileText, Clock, Target, CheckCircle, Play, BarChart3, Award } from 'lucide-react'
import { cn } from '@/lib/utils'

const mockTests = [
  {
    id: 'test-1',
    title: 'Mock Test 1 - Full CELPIP',
    description: 'Complete practice test covering all modules',
    modules: ['Listening', 'Reading', 'Writing', 'Speaking'],
    duration: '180 min',
    difficulty: 'Challenging',
    questionCount: {
      listening: 8,
      reading: 12,
      writing: 2,
      speaking: 8
    },
    status: 'available',
    color: 'bg-blue-500',
    lastAttempt: null,
    bestScore: null
  },
  {
    id: 'test-2',
    title: 'Mock Test 2 - Advanced Level',
    description: 'High-difficulty questions for advanced preparation',
    modules: ['Listening', 'Reading', 'Writing', 'Speaking'],
    duration: '180 min',
    difficulty: 'Advanced',
    questionCount: {
      listening: 8,
      reading: 12,
      writing: 2,
      speaking: 8
    },
    status: 'available',
    color: 'bg-purple-500',
    lastAttempt: null,
    bestScore: null
  },
  {
    id: 'test-3',
    title: 'Mock Test 3 - Time Pressure',
    description: 'Practice under strict time constraints',
    modules: ['Listening', 'Reading', 'Writing', 'Speaking'],
    duration: '150 min',
    difficulty: 'Challenging',
    questionCount: {
      listening: 8,
      reading: 12,
      writing: 2,
      speaking: 8
    },
    status: 'available',
    color: 'bg-orange-500',
    lastAttempt: null,
    bestScore: null
  },
  {
    id: 'test-4',
    title: 'Mock Test 4 - Academic Focus',
    description: 'Emphasis on academic vocabulary and structures',
    modules: ['Listening', 'Reading', 'Writing', 'Speaking'],
    duration: '180 min',
    difficulty: 'Advanced',
    questionCount: {
      listening: 8,
      reading: 12,
      writing: 2,
      speaking: 8
    },
    status: 'available',
    color: 'bg-green-500',
    lastAttempt: null,
    bestScore: null
  },
  {
    id: 'test-5',
    title: 'Mock Test 5 - Final Challenge',
    description: 'Ultimate test combining all difficulty levels',
    modules: ['Listening', 'Reading', 'Writing', 'Speaking'],
    duration: '180 min',
    difficulty: 'Expert',
    questionCount: {
      listening: 8,
      reading: 12,
      writing: 2,
      speaking: 8
    },
    status: 'available',
    color: 'bg-red-500',
    lastAttempt: null,
    bestScore: null
  }
]

const testCategories = [
  'All',
  'Beginner',
  'Intermediate',
  'Advanced',
  'Challenging',
  'Expert'
]

export default function MockTestsPage() {
  const [selectedTest, setSelectedTest] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTests = mockTests.filter(test => {
    if (selectedCategory !== 'All' && test.difficulty !== selectedCategory) return false
    if (searchTerm && !test.title.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const getTotalQuestions = (test: typeof mockTests[0]) => {
    return Object.values(test.questionCount).reduce((sum, count) => sum + count, 0)
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mock Tests</h1>
        <p className="text-gray-600">
          Practice with 5 challenging CELPIP mock tests
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search mock tests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {testCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'px-3 py-1 text-sm rounded-full transition-colors',
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Mock Tests */}
      <div className="space-y-4 mb-8">
        {filteredTests.map((test) => (
          <div
            key={test.id}
            className={cn(
              'bg-white rounded-lg p-4 shadow-sm border cursor-pointer transition-all',
              selectedTest === test.id && 'ring-2 ring-blue-500',
              'hover:shadow-md'
            )}
            onClick={() => setSelectedTest(test.id)}
          >
            <div className="flex items-start space-x-3">
              <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', test.color)}>
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{test.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{test.description}</p>
                
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {test.modules.map((module, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {module}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Target className="w-3 h-3" />
                    <span>{test.difficulty}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{test.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>{getTotalQuestions(test)} questions</span>
                  </div>
                </div>

                {/* Progress/Score Display */}
                {test.lastAttempt ? (
                  <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-blue-700">Last attempt: {test.lastAttempt}</span>
                      <span className="font-medium text-blue-800">{test.bestScore}%</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Not attempted yet</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Start Test Button */}
      {selectedTest && (
        <div className="mb-8">
          <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Start {mockTests.find(t => t.id === selectedTest)?.title}
          </button>
        </div>
      )}

      {/* Test Statistics */}
      <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Statistics</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {mockTests.filter(t => t.lastAttempt).length}
            </div>
            <div className="text-sm text-blue-700">Tests Completed</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {mockTests.filter(t => t.bestScore && t.bestScore >= 80).length}
            </div>
            <div className="text-sm text-green-700">High Scores (80%+)</div>
          </div>
        </div>
      </div>

      {/* Study Tips */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">📝 Test Preparation Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Take tests under realistic time conditions</li>
          <li>• Review all answers, especially incorrect ones</li>
          <li>• Practice with different difficulty levels</li>
          <li>• Use the feedback to identify weak areas</li>
          <li>• Simulate exam environment for best results</li>
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-green-50 rounded-lg p-4">
        <h3 className="font-semibold text-green-900 mb-2">🚀 Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <button className="p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors">
            <div className="text-center">
              <BarChart3 className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <span className="text-sm font-medium text-green-800">View Results</span>
            </div>
          </button>
          <button className="p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors">
            <div className="text-center">
              <Award className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <span className="text-sm font-medium text-green-800">Certificates</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
