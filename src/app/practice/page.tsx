'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Headphones, BookOpen, Play, Clock, Target } from 'lucide-react'
import { cn } from '@/lib/utils'

// This will be populated with real data from database
const practiceModules: any[] = []

export default function PracticePage() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [practiceModules, setPracticeModules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPracticeData() {
      try {
        setLoading(true)
        const response = await fetch('/api/practice/materials')
        if (response.ok) {
          const data = await response.json()
          // Transform API data to match the expected format
          const transformedModules = [
            {
              id: 'listening',
              title: 'Listening Practice',
              description: `Improve listening with ${data.materials.filter((m: any) => m.type === 'listening').length} real audio clips`,
              icon: Headphones,
              color: 'bg-green-500',
              difficulty: 'Medium',
              timeEstimate: '15-20 min',
              questionCount: data.materials.filter((m: any) => m.type === 'listening').length,
              status: 'available'
            },
            {
              id: 'reading',
              title: 'Reading Practice',
              description: `Enhance reading with ${data.materials.filter((m: any) => m.type === 'reading').length} real passages`,
              icon: BookOpen,
              color: 'bg-blue-500',
              difficulty: 'Medium',
              timeEstimate: '20-25 min',
              questionCount: data.materials.filter((m: any) => m.type === 'reading').length,
              status: 'available'
            }
          ]
          setPracticeModules(transformedModules)
        } else {
          throw new Error('Failed to fetch practice data')
        }
      } catch (error) {
        console.error('Error fetching practice data:', error)
        setError('Failed to load practice materials')
      } finally {
        setLoading(false)
      }
    }
    
    fetchPracticeData()
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Loading Practice Materials...</h1>
          <p className="text-gray-600">Fetching your real CELPIP practice content from the database</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Error Loading Practice</h1>
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
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Practice Modules</h1>
        <p className="text-gray-600">
          Choose a module to practice your CELPIP skills with real materials from your course
        </p>
      </div>

      {/* Practice Modules */}
      <div className="space-y-4 mb-8">
        {practiceModules.map((module) => (
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
                <module.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{module.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                
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
                    <BookOpen className="w-3 h-3" />
                    <span>{module.questionCount} questions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Start Practice Button */}
      {selectedModule && (
        <div className="mb-8">
          <Link
            href={`/practice/${selectedModule}`}
            className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
          >
            Start {practiceModules.find(m => m.id === selectedModule)?.title}
          </Link>
        </div>
      )}

      {/* Recent Practice */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Practice</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Headphones className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-gray-900">Listening Test 1</p>
                <p className="text-sm text-gray-500">2 days ago</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">75%</p>
              <p className="text-sm text-gray-500">6/8 correct</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-gray-900">Reading Passage 2</p>
                <p className="text-sm text-gray-500">1 week ago</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">83%</p>
              <p className="text-sm text-gray-500">10/12 correct</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Practice Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Take your time with each question</li>
          <li>• Review incorrect answers to learn from mistakes</li>
          <li>• Practice regularly to maintain your skills</li>
          <li>• Use the timer to simulate exam conditions</li>
        </ul>
      </div>
    </div>
  )
}
