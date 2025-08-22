#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'
import { join } from 'path'
import { analyzePDFContent, extractVocabularyFromPDF } from './pdf-parser'

const prisma = new PrismaClient()

async function analyzeRealVocabularyDocuments() {
  try {
    const materialsRoot = process.env.PATH_TO_MATERIALS_ROOT
    
    if (!materialsRoot) {
      console.error('PATH_TO_MATERIALS_ROOT environment variable not set')
      process.exit(1)
    }
    
    console.log('🔍 Analyzing ACTUAL vocabulary content from existing PDF documents...\n')
    
    // List of vocabulary documents that actually exist (based on the list output)
    const vocabDocuments = [
      '15-Hr Complete Course/All Vocab Lists!/200 Phrasal Verbs (9) (4) (1).pdf',
      '15-Hr Complete Course/All Vocab Lists!/200 Vocabulary Words (7) (3) (1).pdf',
      '15-Hr Complete Course/All Vocab Lists!/Bonus 400 CELPIP Word List (5) (3) (1).pdf',
      '15-Hr Complete Course/All Vocab Lists!/Quick Vocab Guide 250 Best Words (1) (1).pdf',
      '15-Hr Complete Course/All Vocab Lists!/Best Idiomatic Expressions (4).pdf',
      '15-Hr Complete Course/All Vocab Lists!/Best Word Replacements (6).pdf',
      '5-Hour Compressed Version/Class E_ 1 hr_ Vocab!/Bonus 400 CELPIP Word List.pdf',
      '5-Hour Compressed Version/Class E_ 1 hr_ Vocab!/Vocab notes (1) (2) (1) (1) (2).pdf',
      '5-Hour Compressed Version/Class E_ 1 hr_ Vocab!/Idiomatic Expressions (3).pdf'
    ]
    
    let totalPotentialVocab = 0
    let totalFilesAnalyzed = 0
    let successfulFiles = 0
    
    for (const doc of vocabDocuments) {
      const fullPath = join(materialsRoot, doc)
      
      try {
        console.log(`\n${'='.repeat(80)}`)
        console.log(`📄 Attempting to analyze: ${doc}`)
        
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
          
          totalPotentialVocab += vocabLines.length
          successfulFiles++
        }
        
        totalFilesAnalyzed++
        
      } catch (error) {
        console.error(`  ❌ Error analyzing ${doc}:`, error instanceof Error ? error.message : String(error))
      }
    }
    
    console.log(`\n${'='.repeat(80)}`)
    console.log(`📊 REAL ANALYSIS SUMMARY:`)
    console.log(`   Files attempted: ${totalFilesAnalyzed}`)
    console.log(`   Files successfully analyzed: ${successfulFiles}`)
    console.log(`   Total potential vocabulary items: ${totalPotentialVocab}`)
    console.log(`   Average per successful file: ${successfulFiles > 0 ? Math.round(totalPotentialVocab / successfulFiles) : 0}`)
    
    console.log(`\n💡 Based on this REAL analysis, you should have:`)
    console.log(`   • 200+ Phrasal Verbs (if file exists)`)
    console.log(`   • 200+ Core Vocabulary Words (if file exists)`)
    console.log(`   • 400+ Bonus CELPIP Words (if file exists)`)
    console.log(`   • 250+ Essential Words (if file exists)`)
    console.log(`   • Multiple Idiomatic Expressions (if file exists)`)
    console.log(`   • Word Replacement Lists (if file exists)`)
    console.log(`   • Additional vocabulary notes (if file exists)`)
    console.log(`\n   TOTAL: ${totalPotentialVocab}+ vocabulary items (from ${successfulFiles} successful files)`)
    
    if (successfulFiles === 0) {
      console.log(`\n⚠️  WARNING: No files were successfully analyzed!`)
      console.log(`   This could mean:`)
      console.log(`   • File paths are incorrect`)
      console.log(`   • Files are corrupted or password-protected`)
      console.log(`   • PDF parsing library has issues`)
      console.log(`   • Files are in a different format`)
    }
    
  } catch (error) {
    console.error('❌ Error during vocabulary analysis:', error)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  analyzeRealVocabularyDocuments().catch(console.error)
}
