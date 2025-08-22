'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, PenTool, Mic, BarChart3, Play, Clock, Target, FileText, Star, BookMarked } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [streak, setStreak] = useState(0)
  const [todayCards, setTodayCards] = useState(0)
  const [completedToday, setCompletedToday] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const quickActions = [
    {
      href: '/vocabulary',
      icon: BookOpen,
      label: 'Vocabulary',
      count: 1050,
      color: 'bg-green-500',
      description: '4 comprehensive word lists'
    },
    {
      href: '/grammar',
      icon: Target,
      label: 'Grammar',
      count: 5,
      color: 'bg-blue-500',
      description: 'Complete English course'
    },
    {
      href: '/practice',
      icon: Play,
      label: 'Practice',
      count: 2,
      color: 'bg-purple-500',
      description: 'Listening & Reading'
    },
    {
      href: '/write',
      icon: PenTool,
      label: 'Writing',
      count: 2,
      color: 'bg-orange-500',
      description: 'Task 1 & 2 practice'
    },
    {
      href: '/speak',
      icon: Mic,
      label: 'Speaking',
      count: 2,
      color: 'bg-red-500',
      description: 'With templates'
    },
    {
      href: '/mock-tests',
      icon: FileText,
      label: 'Mock Tests',
      count: 5,
      color: 'bg-indigo-500',
      description: 'Full CELPIP tests'
    }
  ]

  const courseModules = [
    {
      title: '15-Hour Complete Course',
      description: 'Comprehensive CELPIP preparation',
      modules: ['Vocabulary', 'Grammar', 'Writing', 'Speaking', 'Reading', 'Listening'],
      status: 'Available'
    },
    {
      title: '5-Hour Compressed Version',
      description: 'Quick review and key concepts',
      modules: ['Essential Topics', 'Quick Practice', 'Key Templates'],
      status: 'Available'
    },
    {
      title: 'Mock Tests & Practice',
      description: 'Real exam simulation',
      modules: ['5 Challenging Tests', 'AI-Scored Tests', 'Practice Questions'],
      status: 'Available'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to CELPIP Coach
        </h1>
        <p className="text-gray-600">
          Complete CELPIP preparation with all course materials
        </p>
        <div className="text-sm text-gray-500 mt-2">
          {currentTime.toLocaleDateString('en-CA', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-blue-600">{streak} days</p>
            </div>
            <Target className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Goal</p>
              <p className="text-2xl font-bold text-green-600">{completedToday}/{todayCards}</p>
            </div>
            <Clock className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Course Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-8 border border-blue-200">
        <h2 className="text-lg font-semibold text-blue-900 mb-3">📚 Complete CELPIP Course</h2>
        <div className="space-y-3">
          {courseModules.map((module, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <h3 className="font-medium text-blue-900">{module.title}</h3>
                <p className="text-sm text-blue-700 mb-1">{module.description}</p>
                <div className="flex flex-wrap gap-1">
                  {module.modules.map((mod, modIndex) => (
                    <span key={modIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {mod}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-xs text-blue-600 font-medium">{module.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="block bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', action.color)}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{action.label}</p>
                  <p className="text-sm text-gray-500">{action.description}</p>
                  <p className="text-xs text-gray-400">
                    {action.count > 0 ? `${action.count} items` : 'Ready to start'}
                  </p>
                </div>
              </div>
              <div className="text-gray-400">
                <Play className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Progress Summary */}
      <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">This Week's Progress</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Vocabulary Reviews</span>
            <span className="font-medium">0 / 1050</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Grammar Lessons</span>
            <span className="font-medium">0 / 5</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Writing Tasks</span>
            <span className="font-medium">0 / 2</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Speaking Practice</span>
            <span className="font-medium">0 / 2</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Mock Tests</span>
            <span className="font-medium">0 / 5</span>
          </div>
        </div>
        <Link
          href="/progress"
          className="block text-center mt-4 text-blue-600 hover:text-blue-700 font-medium"
        >
          View Detailed Progress →
        </Link>
      </div>

      {/* Study Resources */}
      <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
        <h3 className="font-semibold text-green-900 mb-2">📖 Study Resources</h3>
        <p className="text-sm text-green-800 mb-3">
          Access all CELPIP materials including templates, worksheets, and guides
        </p>
        <Link
          href="/resources"
          className="inline-flex items-center space-x-2 text-green-700 hover:text-green-800 font-medium text-sm"
        >
          <BookMarked className="w-4 h-4" />
          <span>Browse All Resources</span>
        </Link>
      </div>

      {/* Daily Tip */}
      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <h3 className="font-semibold text-yellow-900 mb-2">💡 Daily Study Tip</h3>
        <p className="text-sm text-yellow-800">
          Practice vocabulary with spaced repetition for better retention. Review 20-30 words daily and use them in context.
        </p>
      </div>
    </div>
  )
}
