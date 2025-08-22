import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get real counts from database
    const [vocabCount, grammarCount, writingCount, speakingCount, mockTestsCount, practiceCount] = await Promise.all([
      prisma.vocab.count(),
      prisma.passage.count({ where: { type: 'grammar' } }),
      prisma.writingPrompt.count(),
      prisma.speakingPrompt.count(),
      prisma.passage.count({ where: { type: { in: ['reading', 'writing', 'speaking', 'listening'] } } }),
      prisma.passage.count({ where: { type: { in: ['reading', 'listening'] } } })
    ])

    const stats = {
      vocabulary: vocabCount,
      grammar: grammarCount,
      writing: writingCount,
      speaking: speakingCount,
      mockTests: mockTestsCount,
      practice: practiceCount,
      total: vocabCount + grammarCount + writingCount + speakingCount + mockTestsCount + practiceCount
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
