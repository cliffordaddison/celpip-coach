#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'
import { join } from 'path'

const prisma = new PrismaClient()

interface WritingTemplate {
  title: string
  description: string
  taskType: 'Task 1: Email' | 'Task 2: Survey Response'
  timeLimit: number
  wordLimit?: number
  template: string
  rubric: string
}

interface SpeakingTemplate {
  title: string
  description: string
  prepTime: number
  speakingTime: number
  template: string
  rubric: string
}

async function importTemplates() {
  try {
    const materialsRoot = process.env.PATH_TO_MATERIALS_ROOT
    
    if (!materialsRoot) {
      console.error('PATH_TO_MATERIALS_ROOT environment variable not set')
      process.exit(1)
    }
    
    console.log('Starting templates import...')
    
    // Writing Templates
    const writingTemplates: WritingTemplate[] = [
      {
        title: 'Task 1: Email Response',
        description: 'Write a professional email response to a given situation',
        taskType: 'Task 1: Email',
        timeLimit: 20,
        wordLimit: 150,
        template: `Dear [Recipient Name],

I hope this email finds you well. I am writing regarding [topic/subject].

[Main body paragraph with details and explanation]

[Second paragraph with additional information or request]

Thank you for your time and consideration. I look forward to hearing from you.

Best regards,
[Your Name]`,
        rubric: JSON.stringify({
          'Content & Organization': { maxScore: 4, criteria: 'Clear purpose, logical flow, appropriate length' },
          'Language Use': { maxScore: 4, criteria: 'Appropriate vocabulary, grammar accuracy' },
          'Task Achievement': { maxScore: 4, criteria: 'Addresses all points, appropriate tone' }
        })
      },
      {
        title: 'Task 2: Survey Response',
        description: 'Respond to a survey question with detailed explanation',
        taskType: 'Task 2: Survey Response',
        timeLimit: 30,
        wordLimit: 200,
        template: `[Introduction - State your position clearly]

I believe that [your position] because [first reason with explanation].

[Second paragraph - Provide additional supporting reasons]

[Third paragraph - Address potential counterarguments or provide examples]

[Conclusion - Restate your position and summarize key points]`,
        rubric: JSON.stringify({
          'Content & Organization': { maxScore: 4, criteria: 'Clear position, logical arguments, appropriate length' },
          'Language Use': { maxScore: 4, criteria: 'Varied vocabulary, complex sentences, grammar accuracy' },
          'Task Achievement': { maxScore: 4, criteria: 'Addresses question fully, convincing arguments' }
        })
      }
    ]
    
    // Speaking Templates
    const speakingTemplates: SpeakingTemplate[] = [
      {
        title: 'Speaking Task 1: Giving Advice',
        description: 'Provide advice on a given situation',
        prepTime: 30,
        speakingTime: 90,
        template: `[Greeting and introduction]
I think the best approach would be to [main advice].

[First reason with explanation]
This is because [explanation].

[Second reason with example]
For example, [specific example].

[Conclusion]
So I recommend [restate main advice].`,
        rubric: JSON.stringify({
          'Content': { maxScore: 4, criteria: 'Clear advice, logical reasons, examples' },
          'Language': { maxScore: 4, criteria: 'Appropriate vocabulary, grammar accuracy' },
          'Delivery': { maxScore: 4, criteria: 'Clear pronunciation, appropriate pace, fluency' }
        })
      },
      {
        title: 'Speaking Task 2: Describing a Personal Experience',
        description: 'Describe a personal experience related to the topic',
        prepTime: 30,
        speakingTime: 90,
        template: `[Introduction]
I'd like to share a personal experience about [topic].

[Setting the scene]
This happened [when/where] when [context].

[What happened]
[Describe the main events in detail]

[How it affected you]
This experience taught me [lesson learned].

[Conclusion]
Looking back, I think [reflection on the experience].`,
        rubric: JSON.stringify({
          'Content': { maxScore: 4, criteria: 'Clear story, personal details, reflection' },
          'Language': { maxScore: 4, criteria: 'Appropriate vocabulary, grammar accuracy' },
          'Delivery': { maxScore: 4, criteria: 'Clear pronunciation, appropriate pace, fluency' }
        })
      }
    ]
    
    let totalImported = 0
    
    // Import writing templates
    console.log('Importing writing templates...')
    for (const template of writingTemplates) {
      await prisma.writingPrompt.create({
        data: {
          title: template.title,
          description: template.description,
          taskType: template.taskType,
          timeLimit: template.timeLimit,
          wordLimit: template.wordLimit,
          template: template.template,
          rubric: template.rubric
        }
      })
      totalImported++
    }
    
    // Import speaking templates
    console.log('Importing speaking templates...')
    for (const template of speakingTemplates) {
      await prisma.speakingPrompt.create({
        data: {
          title: template.title,
          description: template.description,
          prepTime: template.prepTime,
          speakingTime: template.speakingTime,
          template: template.template,
          rubric: template.rubric
        }
      })
      totalImported++
    }
    
    console.log(`\nTemplates import complete! Total templates imported: ${totalImported}`)
    
  } catch (error) {
    console.error('Error during templates import:', error)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  importTemplates().catch(console.error)
}
