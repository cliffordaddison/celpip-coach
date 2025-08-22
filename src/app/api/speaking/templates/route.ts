import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('🎤 Fetching real speaking templates from database...')
    
    // Get all speaking prompts from database
    const speakingTemplates = await prisma.speakingPrompt.findMany({
      orderBy: { title: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        prepTime: true,
        speakingTime: true,
        template: true,
        rubric: true,
        createdAt: true
      }
    })
    
    console.log(`Found ${speakingTemplates.length} speaking templates`)
    
    // Transform database data into UI-friendly format
    const templates = speakingTemplates.map((template, index) => {
      const colors = [
        'bg-red-500',
        'bg-blue-500', 
        'bg-green-500',
        'bg-purple-500',
        'bg-orange-500',
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
      
      // Determine difficulty based on speaking time
      const difficulty = template.speakingTime > 120 ? 'Advanced' : template.speakingTime > 60 ? 'Intermediate' : 'Beginner'
      
      return {
        id: template.id,
        title: template.title,
        description: template.description || 'Speaking practice template',
        prepTime: template.prepTime,
        speakingTime: template.speakingTime,
        template: template.template,
        rubric: rubricData,
        keyPoints: keyPoints.length > 0 ? keyPoints : ['Speaking Structure', 'Content Guidelines', 'Time Management'],
        difficulty,
        color: colors[index % colors.length],
        status: 'available'
      }
    })
    
    const response = {
      templates,
      totalCount: templates.length,
      message: `Successfully loaded ${templates.length} speaking templates from your CELPIP materials`
    }
    
    console.log(`🎤 Returning ${templates.length} speaking templates`)
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('❌ Error fetching speaking templates:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch speaking templates',
        templates: [],
        totalCount: 0
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
