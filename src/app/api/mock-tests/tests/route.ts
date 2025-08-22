import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('📋 Fetching real mock tests from database...')
    
    // Get all mock test passages from database
    const mockTests = await prisma.passage.findMany({
      where: {
        type: { in: ['reading', 'writing', 'speaking', 'listening'] }
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
    
    console.log(`Found ${mockTests.length} mock test materials`)
    
    // Group by test number if possible
    const testGroups = new Map<string, any[]>()
    
    mockTests.forEach(test => {
      // Try to extract test number from title
      const testMatch = test.title.match(/Test (\d+)/i)
      const testNumber = testMatch ? testMatch[1] : 'General'
      
      if (!testGroups.has(testNumber)) {
        testGroups.set(testNumber, [])
      }
      testGroups.get(testNumber)!.push(test)
    })
    
    // Transform into test format
    const tests = Array.from(testGroups.entries()).map(([testNumber, materials], index) => {
      const colors = [
        'bg-indigo-500',
        'bg-blue-500', 
        'bg-green-500',
        'bg-purple-500',
        'bg-orange-500',
        'bg-red-500',
        'bg-pink-500',
        'bg-yellow-500'
      ]
      
      // Count questions in content
      const questionCount = (materials[0].content.match(/\?/g) || []).length
      const estimatedTime = materials.length * 15 // 15 min per section
      
      return {
        id: `test-${testNumber}`,
        title: `Mock Test ${testNumber}`,
        description: `Complete CELPIP practice test with ${materials.length} sections`,
        sections: materials.map(material => ({
          id: material.id,
          type: material.type,
          title: material.title,
          content: material.content,
          source: material.source
        })),
        questionCount: Math.max(questionCount, materials.length * 5), // Estimate if no questions found
        timeEstimate: `${estimatedTime} minutes`,
        difficulty: materials.some(m => m.difficulty === 'H') ? 'Advanced' : 
                   materials.some(m => m.difficulty === 'E') ? 'Beginner' : 'Intermediate',
        color: colors[index % colors.length],
        status: 'available',
        totalSections: materials.length
      }
    })
    
    const response = {
      tests,
      totalCount: tests.length,
      message: `Successfully loaded ${tests.length} mock tests from your CELPIP materials`
    }
    
    console.log(`📋 Returning ${tests.length} mock tests`)
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('❌ Error fetching mock tests:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch mock tests',
        tests: [],
        totalCount: 0
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
