#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'
import { join } from 'path'
import { analyzePDFContent, extractVocabularyFromPDF } from './pdf-parser'

const prisma = new PrismaClient()

async function analyzeVocabularyDocuments() {
  try {
    const materialsRoot = process.env.PATH_TO_MATERIALS_ROOT
    
    if (!materialsRoot) {
      console.error('PATH_TO_MATERIALS_ROOT environment variable not set')
      process.exit(1)
    }
    
    console.log('🔍 Analyzing actual vocabulary content from PDF documents...\n')
    
    // List of vocabulary documents to analyze
    const vocabDocuments = [
      '15-Hr Complete Course/All Vocab Lists!/200 Phrasal Verbs (9) (4) (1).pdf',
      '15-Hr Complete Course/All Vocab Lists!/200 Vocabulary Words (7) (3) (1).pdf',
      '15-Hr Complete Course/All Vocab Lists!/Bonus 400 CELPIP Word List (5) (3) (1).pdf',
      '15-Hr Complete Course/All Vocab Lists!/Quick Vocab Guide 250 Best Words (1) (1).pdf',
      '15-Hr Complete Course/All Vocab Lists!/Best Idiomatic Expressions (4).pdf',
      '15-Hr Complete Course/All Vocab Lists!/Best Word Replacements (6).pdf',
      '15-Hr Complete Course/All Vocab Lists!/200 Vocabulary Words (7) (3) (1) (3).pdf',
      '15-Hr Complete Course/All Vocab Lists!/Bonus 400 CELPIP Word List (5) (3) (1) (4).pdf',
      '15-Hr Complete Course/All Vocab Lists!/Quick Vocab Guide 250 Best Words (1) (1) (2).pdf',
      '15-Hr Complete Course/All Vocab Lists!/Bonus 400 CELPIP Word List.pdf',
      '15-Hr Complete Course/All Vocab Lists!/Idiomatic Expressions (3).pdf',
      '15-Hr Complete Course/All Vocab Lists!/Vocab notes (1) (2) (1) (1) (2).pdf'
    ]
    
    let totalPotentialVocab = 0
    let totalFilesAnalyzed = 0
    
    for (const doc of vocabDocuments) {
      const fullPath = join(materialsRoot, doc)
      
      try {
        console.log(`\n${'='.repeat(80)}`)
        await analyzePDFContent(fullPath)
        
        // Extract vocabulary lines
        const vocabLines = await extractVocabularyFromPDF(fullPath)
        console.log(`   Extracted vocabulary lines: ${vocabLines.length}`)
        
        // Show sample vocabulary
        if (vocabLines.length > 0) {
          console.log(`   Sample vocabulary:`)
          vocabLines.slice(0, 5).forEach((line, index) => {
            console.log(`     ${index + 1}. ${line.substring(0, 60)}${line.length > 60 ? '...' : ''}`)
          })
        }
        
        totalPotentialVocab += vocabLines.length
        totalFilesAnalyzed++
        
      } catch (error) {
        console.error(`  ❌ Error analyzing ${doc}:`, error)
      }
    }
    
    console.log(`\n${'='.repeat(80)}`)
    console.log(`📊 ANALYSIS SUMMARY:`)
    console.log(`   Files analyzed: ${totalFilesAnalyzed}`)
    console.log(`   Total potential vocabulary items: ${totalPotentialVocab}`)
    console.log(`   Average per file: ${Math.round(totalPotentialVocab / totalFilesAnalyzed)}`)
    
    console.log(`\n💡 Based on this analysis, you should have:`)
    console.log(`   • 200+ Phrasal Verbs`)
    console.log(`   • 200+ Core Vocabulary Words`)
    console.log(`   • 400+ Bonus CELPIP Words`)
    console.log(`   • 250+ Essential Words`)
    console.log(`   • Multiple Idiomatic Expressions`)
    console.log(`   • Word Replacement Lists`)
    console.log(`   • Additional vocabulary notes`)
    console.log(`\n   TOTAL: ${totalPotentialVocab}+ vocabulary items`)
    
  } catch (error) {
    console.error('❌ Error during vocabulary analysis:', error)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  analyzeVocabularyDocuments().catch(console.error)
}
