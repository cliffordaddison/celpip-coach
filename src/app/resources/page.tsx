'use client'

import { useState } from 'react'
import { FileText, Download, Eye, BookOpen, PenTool, Mic, Target, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const resourceCategories = [
  {
    id: 'writing-templates',
    title: 'Writing Templates',
    description: 'Professional templates for Task 1 & 2',
    icon: PenTool,
    color: 'bg-blue-500',
    resources: [
      {
        id: 'task1-email',
        title: 'Task 1: Email Writing Template',
        description: 'Professional email template with examples',
        type: 'Template',
        size: '2.3 MB',
        downloads: 156,
        rating: 4.8
      },
      {
        id: 'task2-survey',
        title: 'Task 2: Survey Response Template',
        description: 'Opinion essay template with structure',
        type: 'Template',
        size: '1.8 MB',
        downloads: 142,
        rating: 4.7
      },
      {
        id: 'additional-task1',
        title: 'Additional Task 1 Templates',
        description: 'Variations for different email scenarios',
        type: 'Template',
        size: '3.1 MB',
        downloads: 98,
        rating: 4.6
      }
    ]
  },
  {
    id: 'speaking-templates',
    title: 'Speaking Templates',
    description: 'HZad speaking templates and guides',
    icon: Mic,
    color: 'bg-orange-500',
    resources: [
      {
        id: 'hzad-speaking',
        title: 'HZad Speaking Templates',
        description: 'Complete speaking response templates',
        type: 'Template',
        size: '4.2 MB',
        downloads: 203,
        rating: 4.9
      },
      {
        id: 'speaking-guide',
        title: 'How to Use Speaking Templates',
        description: 'Step-by-step guide for speaking success',
        type: 'Guide',
        size: '6.4 MB',
        downloads: 178,
        rating: 4.8
      }
    ]
  },
  {
    id: 'study-tools',
    title: 'Study Tools & Worksheets',
    description: 'Brainstorming and practice materials',
    icon: BookOpen,
    color: 'bg-green-500',
    resources: [
      {
        id: 'brainstorming',
        title: 'Brainstorming Worksheet',
        description: 'Extremely useful for writing and speaking',
        type: 'Worksheet',
        size: '0.4 MB',
        downloads: 267,
        rating: 4.9
      },
      {
        id: 'grammar-worksheet',
        title: 'Grammar Training Worksheet',
        description: 'Comprehensive grammar practice exercises',
        type: 'Worksheet',
        size: '1.2 MB',
        downloads: 189,
        rating: 4.7
      },
      {
        id: 'using-templates',
        title: 'Using the Templates Guide',
        description: 'How to effectively use all templates',
        type: 'Guide',
        size: '2.3 MB',
        downloads: 134,
        rating: 4.6
      }
    ]
  },
  {
    id: 'vocabulary-materials',
    title: 'Vocabulary Materials',
    description: 'Word lists and learning resources',
    icon: Target,
    color: 'bg-purple-500',
    resources: [
      {
        id: 'quick-250',
        title: 'Quick Vocab Guide - 250 Best Words',
        description: 'Essential vocabulary for CELPIP success',
        type: 'Word List',
        size: '0.8 MB',
        downloads: 312,
        rating: 4.8
      },
      {
        id: 'phrasal-200',
        title: '200 Phrasal Verbs',
        description: 'Common phrasal verbs with examples',
        type: 'Word List',
        size: '2.8 MB',
        downloads: 245,
        rating: 4.7
      },
      {
        id: 'core-200',
        title: '200 Core Vocabulary Words',
        description: 'Fundamental words for academic contexts',
        type: 'Word List',
        size: '4.4 MB',
        downloads: 198,
        rating: 4.8
      },
      {
        id: 'bonus-400',
        title: 'Bonus 400 CELPIP Words',
        description: 'Advanced vocabulary for higher scores',
        type: 'Word List',
        size: '13.2 MB',
        downloads: 167,
        rating: 4.9
      }
    ]
  },
  {
    id: 'advanced-materials',
    title: 'Advanced Materials',
    description: 'Complex sentences, connectors, and expressions',
    icon: Star,
    color: 'bg-red-500',
    resources: [
      {
        id: 'complex-sentences',
        title: 'Best Complex Sentences',
        description: 'Advanced sentence structures for writing',
        type: 'Guide',
        size: '0.6 MB',
        downloads: 145,
        rating: 4.7
      },
      {
        id: 'connectors',
        title: 'Best Connectors',
        description: 'Transitional phrases and connectors',
        type: 'Guide',
        size: '0.8 MB',
        downloads: 167,
        rating: 4.8
      },
      {
        id: 'idiomatic-expressions',
        title: 'Best Idiomatic Expressions',
        description: 'Common idioms and expressions',
        type: 'Guide',
        size: '0.9 MB',
        downloads: 134,
        rating: 4.6
      },
      {
        id: 'word-replacements',
        title: 'Best Word Replacements',
        description: 'Synonyms and word alternatives',
        type: 'Guide',
        size: '0.6 MB',
        downloads: 156,
        rating: 4.7
      },
      {
        id: 'punctuation',
        title: 'Best Punctuation Guide',
        description: 'Punctuation rules and usage',
        type: 'Guide',
        size: '0.5 MB',
        downloads: 123,
        rating: 4.5
      }
    ]
  }
]

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCategories = resourceCategories.filter(category => {
    if (searchTerm && !category.title.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const selectedCategoryData = selectedCategory 
    ? resourceCategories.find(cat => cat.id === selectedCategory)
    : null

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Study Resources</h1>
        <p className="text-gray-600">
          Access all CELPIP study materials and templates
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Resource Categories */}
      <div className="space-y-4 mb-8">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className={cn(
              'bg-white rounded-lg p-4 shadow-sm border cursor-pointer transition-all',
              selectedCategory === category.id && 'ring-2 ring-blue-500',
              'hover:shadow-md'
            )}
            onClick={() => setSelectedCategory(category.id)}
          >
            <div className="flex items-start space-x-3">
              <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', category.color)}>
                <category.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{category.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>{category.resources.length} resources</span>
                  <span>•</span>
                  <span>{category.resources.reduce((sum, r) => sum + r.downloads, 0)} downloads</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Category Resources */}
      {selectedCategoryData && (
        <div className="mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{selectedCategoryData.title}</h2>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            
            <div className="space-y-3">
              {selectedCategoryData.resources.map((resource) => (
                <div key={resource.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{resource.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{resource.type}</span>
                        <span>•</span>
                        <span>{resource.size}</span>
                        <span>•</span>
                        <span>{resource.downloads} downloads</span>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span>{resource.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-3">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="bg-white rounded-lg p-4 shadow-sm border mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Resource Statistics</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {resourceCategories.reduce((sum, cat) => sum + cat.resources.length, 0)}
            </div>
            <div className="text-sm text-blue-700">Total Resources</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {resourceCategories.reduce((sum, cat) => sum + cat.resources.reduce((s, r) => s + r.downloads, 0), 0)}
            </div>
            <div className="text-sm text-green-700">Total Downloads</div>
          </div>
        </div>
      </div>

      {/* Study Tips */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">📚 Resource Usage Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Download templates and practice with them regularly</li>
          <li>• Use brainstorming worksheets before writing/speaking</li>
          <li>• Study vocabulary lists with spaced repetition</li>
          <li>• Practice grammar exercises consistently</li>
          <li>• Review and apply all materials in practice tests</li>
        </ul>
      </div>
    </div>
  )
}
