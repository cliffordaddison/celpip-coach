import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('📖 Fetching real grammar modules from database...')
    
    // Get all grammar passages from database
    const grammarPassages = await prisma.passage.findMany({
      where: { type: 'grammar' },
      orderBy: { title: 'asc' },
      select: {
        id: true,
        title: true,
        content: true,
        difficulty: true,
        source: true,
        createdAt: true
      }
    })
    
    console.log(`Found ${grammarPassages.length} grammar modules`)
    
    // Define colors array at top level so it can be used in fallback
    const colors = [
      'bg-green-500',
      'bg-blue-500', 
      'bg-purple-500',
      'bg-orange-500',
      'bg-red-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-yellow-500'
    ]
    
    // Transform database data into UI-friendly format
    const modules = grammarPassages.map((passage, index) => {
      
      // Extract topics from content (first few lines)
      const contentLines = passage.content.split('\n').filter(line => line.trim().length > 0)
      const topics = contentLines.slice(0, 3).map(line => line.trim().substring(0, 30) + '...')
      
      // Estimate time based on content length
      const wordCount = passage.content.split(' ').length
      const timeEstimate = wordCount < 500 ? '15-25 min' : wordCount < 1000 ? '25-35 min' : '35-45 min'
      
      return {
        id: passage.id,
        title: passage.title,
        description: `Real grammar content from your ${passage.source} PDF`,
        topics: topics.length > 0 ? topics : ['Grammar Rules', 'Practice Exercises', 'Examples'],
        difficulty: passage.difficulty || 'Intermediate',
        timeEstimate,
        questionCount: Math.max(10, Math.floor(wordCount / 50)), // Estimate questions based on content
        status: 'available',
        color: colors[index % colors.length],
        source: passage.source,
        content: passage.content.substring(0, 200) + '...' // Preview
      }
    })
    
    // If no grammar modules found, create a fallback from other materials
    if (modules.length === 0) {
      console.log('No grammar modules found, checking for other materials...')
      
      // Look for materials that might contain grammar content
      const otherMaterials = await prisma.passage.findMany({
        where: {
          OR: [
            { title: { contains: 'Grammar' } },
            { title: { contains: 'Sentence' } },
            { title: { contains: 'Punctuation' } },
            { title: { contains: 'Tense' } }
          ]
        },
        take: 5,
        select: {
          id: true,
          title: true,
          content: true,
          difficulty: true,
          source: true
        }
      })
      
      if (otherMaterials.length > 0) {
        const fallbackModules = otherMaterials.map((material, index) => ({
          id: `fallback-${material.id}`,
          title: material.title,
          description: `Grammar-related content from your ${material.source} PDF`,
          topics: ['Grammar Rules', 'Language Structure', 'Writing Skills'],
          difficulty: material.difficulty || 'Intermediate',
          timeEstimate: '20-30 min',
          questionCount: 15,
          status: 'available',
          color: colors[index % colors.length],
          source: material.source,
          content: material.content.substring(0, 200) + '...'
        }))
        
        modules.push(...fallbackModules)
        console.log(`Added ${fallbackModules.length} fallback grammar modules`)
      }
    }
    
    const response = {
      modules,
      totalCount: modules.length,
      message: `Successfully loaded ${modules.length} grammar modules from your CELPIP materials`
    }
    
    console.log(`📖 Returning ${modules.length} grammar modules`)
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('❌ Error fetching grammar modules:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch grammar modules',
        modules: [],
        totalCount: 0
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
