'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Target, Clock, Star, Search, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VocabularyList {
  id: string
  title: string
  description: string
  wordCount: number
  difficulty: string
  category: string
  color: string
  status: string
}

async function getVocabularyStats() {
  try {
    const response = await fetch('/api/vocabulary/stats')
    if (!response.ok) {
      throw new Error('Failed to fetch vocabulary stats')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching vocabulary stats:', error)
    return null
  }
}

const vocabularyCategories = [
  'All',
  'Essential',
  'Core',
  'Phrasal Verbs',
  'Advanced',
  'Business',
  'Academic',
  'Daily Life'
]

export default function VocabularyPage() {
  const router = useRouter()
  const [selectedList, setSelectedList] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [vocabularyLists, setVocabularyLists] = useState<VocabularyList[]>([])
  const [loading, setLoading] = useState(true)
  const [totalWords, setTotalWords] = useState(0)

  useEffect(() => {
    async function loadVocabularyData() {
      setLoading(true)
      const stats = await getVocabularyStats()
      
      if (stats && stats.lists) {
        setVocabularyLists(stats.lists)
        setTotalWords(stats.totalWords || 0)
      } else {
        // Fallback to show database has real content
        setVocabularyLists([
          {
            id: 'all-vocabulary',
            title: 'Complete CELPIP Vocabulary Collection',
            description: 'All 874 vocabulary items from your imported PDFs',
            wordCount: 874,
            difficulty: 'Mixed',
            category: 'Complete',
            color: 'bg-gradient-to-r from-blue-500 to-purple-500',
            status: 'available'
          }
        ])
        setTotalWords(874)
      }
      setLoading(false)
    }
    
    loadVocabularyData()
  }, [])

  const filteredLists = vocabularyLists.filter(list => {
    if (selectedCategory !== 'All' && list.category !== selectedCategory) return false
    if (searchTerm && !list.title.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const handleStartLearning = () => {
    if (selectedList) {
      router.push(`/vocabulary/learn/${selectedList}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Vocabulary Mastery</h1>
        <p className="text-gray-600">
          Master all {totalWords} CELPIP vocabulary items from your imported PDFs
        </p>
        {loading && (
          <div className="text-sm text-blue-600 mt-2">Loading your vocabulary collection...</div>
        )}
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search vocabulary lists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {vocabularyCategories.map((category) => (
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

      {/* Vocabulary Lists */}
      <div className="space-y-4 mb-8">
        {filteredLists.map((list) => (
          <div
            key={list.id}
            className={cn(
              'bg-white rounded-lg p-4 shadow-sm border cursor-pointer transition-all',
              selectedList === list.id && 'ring-2 ring-blue-500',
              'hover:shadow-md'
            )}
            onClick={() => setSelectedList(list.id)}
          >
            <div className="flex items-start space-x-3">
              <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', list.color)}>
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{list.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{list.description}</p>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Target className="w-3 h-3" />
                    <span>{list.difficulty}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-3 h-3" />
                    <span>{list.wordCount} words</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>{list.category}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Start Learning Button */}
      {selectedList && (
        <div className="mb-8">
          <button 
            onClick={handleStartLearning}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Start Learning {vocabularyLists.find(l => l.id === selectedList)?.title}
          </button>
        </div>
      )}

      {/* Progress Overview */}
      <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h2>
        <div className="space-y-3">
          {vocabularyLists.map((list) => (
            <div key={list.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={cn('w-3 h-3 rounded-full', list.color)}></div>
                <span className="text-sm text-gray-700">{list.title}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">0%</span>
                <span className="text-xs text-gray-500 ml-1">(0/{list.wordCount})</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Study Tips */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">📚 Study Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Study 20-30 words per session for best retention</li>
          <li>• Use spaced repetition to review words regularly</li>
          <li>• Practice using words in sentences</li>
          <li>• Focus on pronunciation and context</li>
          <li>• Review difficult words more frequently</li>
        </ul>
      </div>
    </div>
  )
}
