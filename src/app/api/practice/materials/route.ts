import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('🏋️ Fetching real practice materials from database...')
    
    // Get all practice passages from database
    const practiceMaterials = await prisma.passage.findMany({
      where: {
        type: { in: ['reading', 'listening'] }
      },
      orderBy: { title: 'asc' },
      select: {
        id: true,
        title: true,
        content: true,
        type: true,
        difficulty: true,
        source: true,
        createdAt: true
      }
    })
    
    console.log(`Found ${practiceMaterials.length} practice materials`)
    
    // Transform database data into UI-friendly format
    const materials = practiceMaterials.map((material, index) => {
      const colors = [
        'bg-purple-500',
        'bg-blue-500', 
        'bg-green-500',
        'bg-orange-500',
        'bg-red-500',
        'bg-indigo-500',
        'bg-pink-500',
        'bg-yellow-500'
      ]
      
      // Extract key points from content
      const contentLines = material.content.split('\n').filter(line => line.trim().length > 0)
      const keyPoints = contentLines.slice(0, 3).map(line => line.trim().substring(0, 40) + '...')
      
      // Estimate time and questions based on content length
      const wordCount = material.content.split(' ').length
      const timeEstimate = wordCount < 300 ? '10-15 min' : wordCount < 600 ? '15-25 min' : '25-35 min'
      const questionCount = Math.max(5, Math.floor(wordCount / 100))
      
      // Determine category based on type and content
      let category = 'General Practice'
      if (material.type === 'reading') {
        category = material.title.toLowerCase().includes('academic') ? 'Academic Reading' : 'General Reading'
      } else if (material.type === 'listening') {
        category = material.title.toLowerCase().includes('conversation') ? 'Conversation Practice' : 'Listening Comprehension'
      }
      
      return {
        id: material.id,
        title: material.title,
        description: `${material.type.charAt(0).toUpperCase() + material.type.slice(1)} practice from your ${material.source} PDF`,
        type: material.type,
        category,
        content: material.content,
        keyPoints: keyPoints.length > 0 ? keyPoints : ['Practice Exercises', 'Comprehension Questions', 'Skill Development'],
        difficulty: material.difficulty || 'Intermediate',
        timeEstimate,
        questionCount,
        color: colors[index % colors.length],
        status: 'available',
        source: material.source,
        wordCount
      }
    })
    
    const response = {
      materials,
      totalCount: materials.length,
      message: `Successfully loaded ${materials.length} practice materials from your CELPIP course`
    }
    
    console.log(`🏋️ Returning ${materials.length} practice materials`)
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('❌ Error fetching practice materials:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch practice materials',
        materials: [],
        totalCount: 0
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
