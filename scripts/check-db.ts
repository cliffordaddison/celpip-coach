#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('🔍 Checking database content...\n')
    
    // Check vocabulary
    const vocabCount = await prisma.vocab.count()
    console.log(`📚 Vocabulary items: ${vocabCount}`)
    
    if (vocabCount > 0) {
      const sampleVocab = await prisma.vocab.findMany({ take: 3 })
      console.log('  Sample vocabulary:')
      sampleVocab.forEach(item => {
        console.log(`    - ${item.term}: ${item.definition}`)
      })
    }
    
    // Check grammar lessons
    const grammarCount = await prisma.passage.count({ where: { type: 'grammar' } })
    console.log(`\n📖 Grammar lessons: ${grammarCount}`)
    
    if (grammarCount > 0) {
      const sampleGrammar = await prisma.passage.findMany({ 
        where: { type: 'grammar' }, 
        take: 2 
      })
      console.log('  Sample grammar lessons:')
      sampleGrammar.forEach(lesson => {
        console.log(`    - ${lesson.title}`)
      })
    }
    
    // Check writing templates
    const writingCount = await prisma.writingPrompt.count()
    console.log(`\n📝 Writing templates: ${writingCount}`)
    
    if (writingCount > 0) {
      const sampleWriting = await prisma.writingPrompt.findMany({ take: 2 })
      console.log('  Sample writing templates:')
      sampleWriting.forEach(template => {
        console.log(`    - ${template.title}`)
      })
    }
    
    // Check speaking templates
    const speakingCount = await prisma.speakingPrompt.count()
    console.log(`\n🎤 Speaking templates: ${speakingCount}`)
    
    if (speakingCount > 0) {
      const sampleSpeaking = await prisma.speakingPrompt.findMany({ take: 2 })
      console.log('  Sample speaking templates:')
      sampleSpeaking.forEach(template => {
        console.log(`    - ${template.title}`)
      })
    }
    
    // Check practice passages
    const practiceCount = await prisma.passage.count({ 
      where: { type: { in: ['reading', 'listening'] } } 
    })
    console.log(`\n🎯 Practice passages: ${practiceCount}`)
    
    console.log('\n✅ Database check complete!')
    
  } catch (error) {
    console.error('❌ Error checking database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  checkDatabase().catch(console.error)
}
