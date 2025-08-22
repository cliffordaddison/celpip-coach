'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, PenTool, Mic, BarChart3, Play, Clock, Target } from 'lucide-react'
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
      href: '/review',
      icon: BookOpen,
      label: 'Review Cards',
      count: todayCards,
      color: 'bg-blue-500'
    },
    {
      href: '/practice',
      icon: Play,
      label: 'Practice',
      count: 0,
      color: 'bg-green-500'
    },
    {
      href: '/write',
      icon: PenTool,
      label: 'Writing',
      count: 0,
      color: 'bg-purple-500'
    },
    {
      href: '/speak',
      icon: Mic,
      label: 'Speaking',
      count: 0,
      color: 'bg-orange-500'
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
          Master CELPIP with spaced repetition and targeted practice
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
                  <p className="text-sm text-gray-500">
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
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">This Week's Progress</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Vocabulary Reviews</span>
            <span className="font-medium">0 / 0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Practice Sessions</span>
            <span className="font-medium">0 / 0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Writing Tasks</span>
            <span className="font-medium">0 / 0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Speaking Practice</span>
            <span className="font-medium">0 / 0</span>
          </div>
        </div>
        <Link
          href="/progress"
          className="block text-center mt-4 text-blue-600 hover:text-blue-700 font-medium"
        >
          View Detailed Progress →
        </Link>
      </div>
    </div>
  )
}
