'use client'

import { useState } from 'react'
import { BarChart3, TrendingUp, Target, Calendar, BookOpen, PenTool, Mic, Headphones } from 'lucide-react'
import { cn } from '@/lib/utils'

// Sample data for demonstration
const weeklyData = [
  { day: 'Mon', vocab: 15, practice: 2, writing: 1, speaking: 1 },
  { day: 'Tue', vocab: 12, practice: 1, writing: 0, speaking: 1 },
  { day: 'Wed', vocab: 18, practice: 3, writing: 1, speaking: 0 },
  { day: 'Thu', vocab: 10, practice: 2, writing: 0, speaking: 1 },
  { day: 'Fri', vocab: 20, practice: 2, writing: 1, speaking: 1 },
  { day: 'Sat', vocab: 8, practice: 1, writing: 0, speaking: 0 },
  { day: 'Sun', vocab: 14, practice: 2, writing: 1, speaking: 1 }
]

const skillProgress = [
  { skill: 'Vocabulary', current: 75, target: 90, color: 'bg-blue-500' },
  { skill: 'Listening', current: 68, target: 85, color: 'bg-green-500' },
  { skill: 'Reading', current: 72, target: 88, color: 'bg-purple-500' },
  { skill: 'Writing', current: 65, target: 82, color: 'bg-orange-500' },
  { skill: 'Speaking', current: 70, target: 85, color: 'bg-red-500' }
]

const recentAchievements = [
  { type: 'vocab', title: 'Completed 100 vocabulary reviews', date: '2 days ago', icon: BookOpen },
  { type: 'practice', title: 'Achieved 80% on Listening Test 3', date: '1 week ago', icon: Headphones },
  { type: 'writing', title: 'Completed Writing Task 1', date: '3 days ago', icon: PenTool },
  { type: 'speaking', title: 'Recorded 5 speaking attempts', date: '5 days ago', icon: Mic }
]

export default function ProgressPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week')

  const totalVocab = weeklyData.reduce((sum, day) => sum + day.vocab, 0)
  const totalPractice = weeklyData.reduce((sum, day) => sum + day.practice, 0)
  const totalWriting = weeklyData.reduce((sum, day) => sum + day.writing, 0)
  const totalSpeaking = weeklyData.reduce((sum, day) => sum + day.speaking, 0)

  const currentStreak = 7 // Sample data
  const targetScore = 10
  const estimatedScore = 8.5

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Progress Dashboard</h1>
        <p className="text-gray-600">
          Track your CELPIP preparation progress
        </p>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
        <div className="flex space-x-2">
          {(['week', 'month', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={cn(
                'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors',
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-blue-600">{currentStreak} days</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Target Score</p>
              <p className="text-2xl font-bold text-green-600">{targetScore}+</p>
            </div>
            <Target className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">This Week's Activity</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-600">Vocabulary Reviews</span>
            </div>
            <span className="font-medium">{totalVocab}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Headphones className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600">Practice Sessions</span>
            </div>
            <span className="font-medium">{totalPractice}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <PenTool className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-gray-600">Writing Tasks</span>
            </div>
            <span className="font-medium">{totalWriting}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mic className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-gray-600">Speaking Practice</span>
            </div>
            <span className="font-medium">{totalSpeaking}</span>
          </div>
        </div>
      </div>

      {/* Skill Progress */}
      <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Skill Progress</h2>
        
        <div className="space-y-4">
          {skillProgress.map((skill) => (
            <div key={skill.skill} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{skill.skill}</span>
                <span className="text-sm text-gray-500">
                  {skill.current}/{skill.target}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={cn('h-2 rounded-full transition-all duration-300', skill.color)}
                  style={{ width: `${(skill.current / skill.target) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity Chart</h2>
        
        <div className="space-y-3">
          {weeklyData.map((day) => (
            <div key={day.day} className="flex items-center space-x-3">
              <div className="w-12 text-sm text-gray-600 font-medium">{day.day}</div>
              <div className="flex-1 flex space-x-1">
                {Array.from({ length: Math.max(day.vocab, day.practice, day.writing, day.speaking) }, (_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-3 rounded-sm flex-1',
                      i < day.vocab ? 'bg-blue-400' : 'bg-gray-200'
                    )}
                  />
                ))}
              </div>
              <div className="w-16 text-right text-xs text-gray-500">
                {day.vocab + day.practice + day.writing + day.speaking} activities
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h2>
        
        <div className="space-y-3">
          {recentAchievements.map((achievement, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <achievement.icon className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{achievement.title}</p>
                <p className="text-xs text-gray-500">{achievement.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estimated Score */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
        <h3 className="font-semibold mb-2">Estimated CELPIP Score</h3>
        <div className="text-center">
          <div className="text-3xl font-bold mb-1">{estimatedScore}</div>
          <p className="text-sm opacity-90">
            Based on your recent performance
          </p>
        </div>
        <div className="mt-3 text-center">
          <p className="text-sm opacity-90">
            Target: {targetScore}+ | Gap: {Math.max(0, targetScore - estimatedScore).toFixed(1)} points
          </p>
        </div>
      </div>
    </div>
  )
}
