'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Target, Clock, CheckCircle, AlertCircle, Play, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// This will be populated with real data from database
const grammarModules: any[] = []

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
  const router = useRouter()
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [grammarModules, setGrammarModules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGrammarData() {
      try {
        setLoading(true)
        const response = await fetch('/api/grammar/modules')
        if (response.ok) {
          const data = await response.json()
          setGrammarModules(data.modules || [])
        } else {
          throw new Error('Failed to fetch grammar data')
        }
      } catch (error) {
        console.error('Error fetching grammar data:', error)
        setError('Failed to load grammar materials')
      } finally {
        setLoading(false)
      }
    }
    
    fetchGrammarData()
  }, [])

  const filteredModules = grammarModules.filter(module => {
    if (selectedCategory !== 'All' && module.difficulty !== selectedCategory) return false
    if (searchTerm && !module.title.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const handleStartModule = () => {
    if (selectedModule) {
      router.push(`/grammar/learn/${selectedModule}`)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Loading Grammar Materials...</h1>
          <p className="text-gray-600">Fetching your real CELPIP grammar content from the database</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Error Loading Grammar</h1>
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

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Grammar Training</h1>
        <p className="text-gray-600">
          Master English grammar with {grammarModules.length} real lessons from your CELPIP course
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
                    {module.topics.map((topic: string, index: number) => (
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
          <button 
            onClick={handleStartModule}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
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
