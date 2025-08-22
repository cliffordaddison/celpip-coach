'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Target, TrendingUp, Award, Calendar, Clock, CheckCircle, BookOpen, FileText, PenTool } from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock progress data - in a real app, this would come from a database
const mockProgressData = {
  vocabulary: {
    'quick-250': { completed: 45, total: 250, lastStudied: '2024-01-15' },
    'phrasal-200': { completed: 32, total: 200, lastStudied: '2024-01-14' },
    'core-200': { completed: 18, total: 200, lastStudied: '2024-01-13' },
    'bonus-400': { completed: 67, total: 400, lastStudied: '2024-01-12' }
  },
  grammar: {
    'basic-grammar': { completed: 15, total: 20, lastStudied: '2024-01-15' },
    'advanced-tenses': { completed: 22, total: 25, lastStudied: '2024-01-14' },
    'sentence-structure': { completed: 18, total: 22, lastStudied: '2024-01-13' },
    'punctuation': { completed: 12, total: 18, lastStudied: '2024-01-12' },
    'common-errors': { completed: 25, total: 30, lastStudied: '2024-01-11' }
  },
  mockTests: {
    'test-1': { completed: true, score: 85, lastAttempt: '2024-01-15' },
    'test-2': { completed: true, score: 78, lastAttempt: '2024-01-14' },
    'test-3': { completed: false, score: null, lastAttempt: null },
    'test-4': { completed: false, score: null, lastAttempt: null },
    'test-5': { completed: false, score: null, lastAttempt: null }
  },
  writing: {
    'task-1': { completed: 8, total: 10, lastPracticed: '2024-01-15' },
    'task-2': { completed: 6, total: 10, lastPracticed: '2024-01-14' }
  },
  speaking: {
    'personal-experience': { completed: 12, total: 15, lastPracticed: '2024-01-15' },
    'opinion-discussion': { completed: 9, total: 15, lastPracticed: '2024-01-14' }
  }
}

export default function ProgressPage() {
  const [selectedModule, setSelectedModule] = useState('overview')
  const [progressData] = useState(mockProgressData)

  const getOverallProgress = () => {
    const totalItems = Object.values(progressData).reduce((sum, module) => {
      return sum + Object.keys(module).length
    }, 0)
    
    const completedItems = Object.values(progressData).reduce((sum, module) => {
      return sum + Object.values(module).filter(item => 
        item.completed || (item.score && item.score > 0)
      ).length
    }, 0)
    
    return Math.round((completedItems / totalItems) * 100)
  }

  const getVocabularyProgress = () => {
    const totalWords = Object.values(progressData.vocabulary).reduce((sum, list) => sum + list.total, 0)
    const completedWords = Object.values(progressData.vocabulary).reduce((sum, list) => sum + list.completed, 0)
    return Math.round((completedWords / totalWords) * 100)
  }

  const getGrammarProgress = () => {
    const totalQuestions = Object.values(progressData.grammar).reduce((sum, module) => sum + module.total, 0)
    const completedQuestions = Object.values(progressData.grammar).reduce((sum, module) => sum + module.completed, 0)
    return Math.round((completedQuestions / totalQuestions) * 100)
  }

  const getTestProgress = () => {
    const completedTests = Object.values(progressData.mockTests).filter(test => test.completed).length
    return Math.round((completedTests / 5) * 100)
  }

  const getWritingProgress = () => {
    const totalTasks = Object.values(progressData.writing).reduce((sum, task) => sum + task.total, 0)
    const completedTasks = Object.values(progressData.writing).reduce((sum, task) => sum + task.completed, 0)
    return Math.round((completedTasks / totalTasks) * 100)
  }

  const getSpeakingProgress = () => {
    const totalPrompts = Object.values(progressData.speaking).reduce((sum, prompt) => sum + prompt.total, 0)
    const completedPrompts = Object.values(progressData.speaking).reduce((sum, prompt) => sum + prompt.completed, 0)
    return Math.round((completedPrompts / totalPrompts) * 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Progress</h1>
        <p className="text-gray-600">
          Track your CELPIP preparation journey
        </p>
      </div>

      {/* Overall Progress */}
      <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">{getOverallProgress()}%</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Overall Progress</h2>
          <p className="text-sm text-gray-600">Complete CELPIP preparation</p>
        </div>
      </div>

      {/* Module Progress Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{getVocabularyProgress()}%</div>
          <div className="text-sm text-gray-600">Vocabulary</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Target className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{getGrammarProgress()}%</div>
          <div className="text-sm text-gray-600">Grammar</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <FileText className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">{getTestProgress()}%</div>
          <div className="text-sm text-gray-600">Mock Tests</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <PenTool className="w-6 h-6 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-600">{getWritingProgress()}%</div>
          <div className="text-sm text-gray-600">Writing</div>
        </div>
      </div>

      {/* Detailed Progress Sections */}
      <div className="space-y-4 mb-6">
        {/* Vocabulary Progress */}
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
            Vocabulary Progress
          </h3>
          <div className="space-y-3">
            {Object.entries(progressData.vocabulary).map(([listId, data]) => (
              <div key={listId} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {listId === 'quick-250' ? 'Quick 250 Words' :
                     listId === 'phrasal-200' ? '200 Phrasal Verbs' :
                     listId === 'core-200' ? '200 Core Words' : '400 Bonus Words'}
                  </div>
                  <div className="text-xs text-gray-500">
                    Last studied: {formatDate(data.lastStudied)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {Math.round((data.completed / data.total) * 100)}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {data.completed}/{data.total}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grammar Progress */}
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Target className="w-4 h-4 mr-2 text-green-600" />
            Grammar Progress
          </h3>
          <div className="space-y-3">
            {Object.entries(progressData.grammar).map(([moduleId, data]) => (
              <div key={moduleId} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {moduleId === 'basic-grammar' ? 'Basic Grammar' :
                     moduleId === 'advanced-tenses' ? 'Advanced Tenses' :
                     moduleId === 'sentence-structure' ? 'Sentence Structure' :
                     moduleId === 'punctuation' ? 'Punctuation' : 'Common Errors'}
                  </div>
                  <div className="text-xs text-gray-500">
                    Last studied: {formatDate(data.lastStudied)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {Math.round((data.completed / data.total) * 100)}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {data.completed}/{data.total}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mock Tests Progress */}
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <FileText className="w-4 h-4 mr-2 text-purple-600" />
            Mock Tests Progress
          </h3>
          <div className="space-y-3">
            {Object.entries(progressData.mockTests).map(([testId, data]) => (
              <div key={testId} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {testId === 'test-1' ? 'Test 1 - Full CELPIP' :
                     testId === 'test-2' ? 'Test 2 - Advanced' :
                     testId === 'test-3' ? 'Test 3 - Time Pressure' :
                     testId === 'test-4' ? 'Test 4 - Academic' : 'Test 5 - Final Challenge'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {data.completed && data.lastAttempt ? `Completed: ${formatDate(data.lastAttempt)}` : 'Not attempted'}
                  </div>
                </div>
                <div className="text-right">
                  {data.completed ? (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">{data.score}%</span>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400">Not started</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Study Streak */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-1">Study Streak</h3>
            <p className="text-sm opacity-90">Keep up the great work!</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">7 days</div>
            <div className="text-sm opacity-90">Current streak</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <div className="text-center">
              <TrendingUp className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <span className="text-sm font-medium text-blue-800">Continue Learning</span>
            </div>
          </button>
          <button className="p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <div className="text-center">
              <Award className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <span className="text-sm font-medium text-green-800">View Achievements</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
