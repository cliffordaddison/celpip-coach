import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const source = searchParams.get('source')
    const listId = searchParams.get('listId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    console.log(`📚 Fetching vocabulary words - source: ${source}, listId: ${listId}, limit: ${limit}, offset: ${offset}`)
    
    let whereClause: any = {}
    
    // Filter by source if specified
    if (source && source !== 'all-vocabulary') {
      whereClause.source = {
        contains: source,
        mode: 'insensitive'
      }
    }
    
    // Get vocabulary words from database
    const words = await prisma.vocab.findMany({
      where: whereClause,
      take: limit,
      skip: offset,
      orderBy: {
        term: 'asc'
      },
      select: {
        id: true,
        term: true,
        partOfSpeech: true,
        definition: true,
        synonyms: true,
        antonyms: true,
        collocations: true,
        example: true,
        tags: true,
        source: true,
        difficulty: true,
        createdAt: true
      }
    })
    
    // Parse tags JSON string back to array
    const processedWords = words.map(word => ({
      ...word,
      tags: word.tags ? JSON.parse(word.tags) : []
    }))
    
    // Get total count for pagination
    const totalCount = await prisma.vocab.count({
      where: whereClause
    })
    
    const response = {
      words: processedWords,
      totalCount,
      hasMore: offset + limit < totalCount,
      message: `Retrieved ${words.length} vocabulary words`
    }
    
    console.log(`📚 Returning ${words.length} vocabulary words (${totalCount} total)`)
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('❌ Error fetching vocabulary words:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch vocabulary words',
        words: [],
        totalCount: 0,
        hasMore: false
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
