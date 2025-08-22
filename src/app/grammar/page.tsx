'use client'

import { useState } from 'react'
import { BookOpen, Target, Clock, CheckCircle, AlertCircle, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

const grammarModules = [
  {
    id: 'basic-grammar',
    title: 'Basic Grammar Fundamentals',
    description: 'Essential grammar rules for CELPIP success',
    topics: ['Parts of Speech', 'Sentence Structure', 'Basic Tenses'],
    difficulty: 'Beginner',
    timeEstimate: '30-45 min',
    questionCount: 20,
    status: 'available',
    color: 'bg-green-500'
  },
  {
    id: 'advanced-tenses',
    title: 'Advanced Tenses & Verb Forms',
    description: 'Master complex verb tenses and forms',
    topics: ['Perfect Tenses', 'Conditional Forms', 'Passive Voice'],
    difficulty: 'Intermediate',
    timeEstimate: '45-60 min',
    questionCount: 25,
    status: 'available',
    color: 'bg-blue-500'
  },
  {
    id: 'sentence-structure',
    title: 'Complex Sentence Structures',
    description: 'Learn to write sophisticated sentences',
    topics: ['Compound Sentences', 'Complex Sentences', 'Parallel Structure'],
    difficulty: 'Intermediate',
    timeEstimate: '40-55 min',
    questionCount: 22,
    status: 'available',
    color: 'bg-purple-500'
  },
  {
    id: 'punctuation',
    title: 'Punctuation & Mechanics',
    description: 'Master punctuation rules and usage',
    topics: ['Commas', 'Semicolons', 'Apostrophes', 'Quotation Marks'],
    difficulty: 'Intermediate',
    timeEstimate: '35-50 min',
    questionCount: 18,
    status: 'available',
    color: 'bg-orange-500'
  },
  {
    id: 'common-errors',
    title: 'Common Grammar Errors',
    description: 'Identify and fix frequent mistakes',
    topics: ['Subject-Verb Agreement', 'Pronoun Usage', 'Article Usage'],
    difficulty: 'Advanced',
    timeEstimate: '50-65 min',
    questionCount: 30,
    status: 'available',
    color: 'bg-red-500'
  }
]

const grammarCategories = [
  'All',
  'Beginner',
  'Intermediate',
  'Advanced',
  'Tenses',
  'Structure',
  'Punctuation',
  'Common Errors'
]

export default function GrammarPage() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredModules = grammarModules.filter(module => {
    if (selectedCategory !== 'All' && module.difficulty !== selectedCategory) return false
    if (searchTerm && !module.title.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Grammar Training</h1>
        <p className="text-gray-600">
          Master English grammar with comprehensive lessons and practice
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search grammar modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {grammarCategories.map((category) => (
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

      {/* Grammar Modules */}
      <div className="space-y-4 mb-8">
        {filteredModules.map((module) => (
          <div
            key={module.id}
            className={cn(
              'bg-white rounded-lg p-4 shadow-sm border cursor-pointer transition-all',
              selectedModule === module.id && 'ring-2 ring-blue-500',
              'hover:shadow-md'
            )}
            onClick={() => setSelectedModule(module.id)}
          >
            <div className="flex items-start space-x-3">
              <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', module.color)}>
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{module.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {module.topics.map((topic, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Target className="w-3 h-3" />
                    <span>{module.difficulty}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{module.timeEstimate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>{module.questionCount} questions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Start Learning Button */}
      {selectedModule && (
        <div className="mb-8">
          <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Start {grammarModules.find(m => m.id === selectedModule)?.title}
          </button>
        </div>
      )}

      {/* Progress Overview */}
      <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h2>
        <div className="space-y-3">
          {grammarModules.map((module) => (
            <div key={module.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={cn('w-3 h-3 rounded-full', module.color)}></div>
                <span className="text-sm text-gray-700">{module.title}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">0%</span>
                <span className="text-xs text-gray-500 ml-1">(0/{module.questionCount})</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Study Tips */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">📖 Grammar Study Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Practice grammar rules in context</li>
          <li>• Complete exercises to reinforce learning</li>
          <li>• Review common error patterns</li>
          <li>• Apply grammar rules in writing and speaking</li>
          <li>• Use the practice tests to assess progress</li>
        </ul>
      </div>

      {/* Quick Access */}
      <div className="mt-6 bg-green-50 rounded-lg p-4">
        <h3 className="font-semibold text-green-900 mb-2">🚀 Quick Access</h3>
        <div className="grid grid-cols-2 gap-2">
          <button className="p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors">
            <div className="text-center">
              <Play className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <span className="text-sm font-medium text-green-800">Practice Test</span>
            </div>
          </button>
          <button className="p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors">
            <div className="text-center">
              <BookOpen className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <span className="text-sm font-medium text-green-800">Review Notes</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
