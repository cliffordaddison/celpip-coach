import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('📊 Fetching vocabulary stats from database...')
    
    // Get total vocabulary count
    const totalWords = await prisma.vocab.count()
    console.log(`Total vocabulary items in database: ${totalWords}`)
    
    // Get vocabulary by source to create lists
    const vocabBySource = await prisma.vocab.groupBy({
      by: ['source'],
      _count: {
        id: true
      }
    })
    
    console.log('Vocabulary by source:', vocabBySource)
    
    // Create vocabulary lists based on real data from database
    const lists = vocabBySource.map((item, index) => {
      const colors = [
        'bg-blue-500',
        'bg-green-500', 
        'bg-purple-500',
        'bg-orange-500',
        'bg-red-500',
        'bg-indigo-500',
        'bg-pink-500',
        'bg-yellow-500'
      ]
      
      // Determine difficulty based on source name
      let difficulty = 'Intermediate'
      let category = 'Core'
      
      const sourceLower = item.source?.toLowerCase() || ''
      
      if (sourceLower.includes('250') || sourceLower.includes('quick')) {
        difficulty = 'Beginner'
        category = 'Essential'
      } else if (sourceLower.includes('400') || sourceLower.includes('bonus')) {
        difficulty = 'Advanced'
        category = 'Advanced'
      } else if (sourceLower.includes('phrasal')) {
        category = 'Phrasal Verbs'
      } else if (sourceLower.includes('idiomatic')) {
        category = 'Expressions'
      }
      
      return {
        id: (item.source || 'unknown').toLowerCase().replace(/[^a-z0-9]/g, '-'),
        title: item.source || 'Unknown Source',
        description: `Real vocabulary from your ${item.source || 'imported'} PDF`,
        wordCount: item._count.id,
        difficulty,
        category,
        color: colors[index % colors.length],
        status: 'available'
      }
    })
    
    // Add a "Complete Collection" list
    lists.unshift({
      id: 'all-vocabulary',
      title: 'Complete CELPIP Vocabulary Collection',
      description: `All ${totalWords} vocabulary items from your imported PDFs`,
      wordCount: totalWords,
      difficulty: 'Mixed',
      category: 'Complete',
      color: 'bg-gradient-to-r from-blue-500 to-purple-500',
      status: 'available'
    })
    
    const response = {
      totalWords,
      lists,
      message: `Successfully loaded ${totalWords} vocabulary items from ${vocabBySource.length} sources`
    }
    
    console.log('📊 Returning vocabulary stats:', response)
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('❌ Error fetching vocabulary stats:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch vocabulary statistics',
        totalWords: 0,
        lists: []
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
