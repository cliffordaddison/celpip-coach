import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('📝 Fetching real writing templates from database...')
    
    // Get all writing prompts from database
    const writingTemplates = await prisma.writingPrompt.findMany({
      orderBy: { title: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        taskType: true,
        timeLimit: true,
        wordLimit: true,
        template: true,
        rubric: true,
        createdAt: true
      }
    })
    
    console.log(`Found ${writingTemplates.length} writing templates`)
    
    // Transform database data into UI-friendly format
    const templates = writingTemplates.map((template, index) => {
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
      
      // Parse rubric if it's JSON
      let rubricData = {}
      try {
        if (template.rubric) {
          rubricData = JSON.parse(template.rubric)
        }
      } catch (e) {
        // If parsing fails, use raw text
        rubricData = { 'Content': { maxScore: 4, criteria: template.rubric } }
      }
      
      // Extract key points from template
      const templateLines = (template.template || '').split('\n').filter(line => line.trim().length > 0)
      const keyPoints = templateLines.slice(0, 3).map(line => line.trim().substring(0, 40) + '...')
      
      return {
        id: template.id,
        title: template.title,
        description: template.description || `Writing template for ${template.taskType}`,
        taskType: template.taskType,
        timeLimit: template.timeLimit,
        wordLimit: template.wordLimit,
        template: template.template,
        rubric: rubricData,
        keyPoints: keyPoints.length > 0 ? keyPoints : ['Writing Structure', 'Content Guidelines', 'Format Requirements'],
        difficulty: (template.wordLimit || 0) > 200 ? 'Advanced' : 'Intermediate',
        color: colors[index % colors.length],
        status: 'available'
      }
    })
    
    const response = {
      templates,
      totalCount: templates.length,
      message: `Successfully loaded ${templates.length} writing templates from your CELPIP materials`
    }
    
    console.log(`📝 Returning ${templates.length} writing templates`)
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('❌ Error fetching writing templates:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch writing templates',
        templates: [],
        totalCount: 0
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
