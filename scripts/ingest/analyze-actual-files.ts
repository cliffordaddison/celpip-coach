#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'
import { analyzePDFContent, extractVocabularyFromPDF } from './pdf-parser'

const prisma = new PrismaClient()

async function analyzeActualVocabularyFiles() {
  try {
    console.log('🔍 Analyzing ACTUAL vocabulary files with correct paths...\n')
    
    // List of vocabulary documents with actual paths from directory listing
    const vocabDocuments = [
      'C:\\Users\\PC\\Documents\\Clifford Addison - PR\\CELPIP\\15-Hr Complete Course\\Class 2_ Vocabulary\\200 Vocabulary Words (7) (3) (1).pdf',
      'C:\\Users\\PC\\Documents\\Clifford Addison - PR\\CELPIP\\15-Hr Complete Course\\Class 2_ Vocabulary\\Bonus 400 CELPIP Word List (5) (3) (1).pdf',
      'C:\\Users\\PC\\Documents\\Clifford Addison - PR\\CELPIP\\15-Hr Complete Course\\Class 2_ Vocabulary\\Quick Vocab Guide 250 Best Words (1) (1).pdf',
      'C:\\Users\\PC\\Documents\\Clifford Addison - PR\\CELPIP\\15-Hr Complete Course\\Class 2_ Vocabulary\\Best Idiomatic Expressions (4).pdf',
      'C:\\Users\\PC\\Documents\\Clifford Addison - PR\\CELPIP\\15-Hr Complete Course\\Class 2_ Vocabulary\\Best Word Replacements (6).pdf',
      'C:\\Users\\PC\\Documents\\Clifford Addison - PR\\CELPIP\\5-Hour Compressed Version\\Class E_ 1 hr_ Vocab\\Bonus 400 CELPIP Word List.pdf',
      'C:\\Users\\PC\\Documents\\Clifford Addison - PR\\CELPIP\\5-Hour Compressed Version\\Class E_ 1 hr_ Vocab\\Idiomatic Expressions (3).pdf',
      'C:\\Users\\PC\\Documents\\Clifford Addison - PR\\CELPIP\\5-Hour Compressed Version\\Class E_ 1 hr_ Vocab\\Vocab notes (1) (2) (1) (1) (2).pdf'
    ]
    
    let totalPotentialVocab = 0
    let totalFilesAnalyzed = 0
    let successfulFiles = 0
    
    for (const doc of vocabDocuments) {
      try {
        console.log(`\n${'='.repeat(80)}`)
        console.log(`📄 Attempting to analyze: ${doc.split('\\').pop()}`)
        
        await analyzePDFContent(doc)
        
        // Extract vocabulary lines
        const vocabLines = await extractVocabularyFromPDF(doc)
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
        console.error(`  ❌ Error analyzing ${doc.split('\\').pop()}:`, error instanceof Error ? error.message : String(error))
      }
    }
    
    console.log(`\n${'='.repeat(80)}`)
    console.log(`📊 ACTUAL FILES ANALYSIS SUMMARY:`)
    console.log(`   Files attempted: ${totalFilesAnalyzed}`)
    console.log(`   Files successfully analyzed: ${successfulFiles}`)
    console.log(`   Total potential vocabulary items: ${totalPotentialVocab}`)
    console.log(`   Average per successful file: ${successfulFiles > 0 ? Math.round(totalPotentialVocab / successfulFiles) : 0}`)
    
    console.log(`\n💡 Based on this analysis of ACTUAL files, you should have:`)
    console.log(`   • 200+ Core Vocabulary Words`)
    console.log(`   • 400+ Bonus CELPIP Words`)
    console.log(`   • 250+ Essential Words`)
    console.log(`   • Multiple Idiomatic Expressions`)
    console.log(`   • Word Replacement Lists`)
    console.log(`   • Additional vocabulary notes`)
    console.log(`\n   TOTAL: ${totalPotentialVocab}+ vocabulary items (from ${successfulFiles} successful files)`)
    
    if (successfulFiles === 0) {
      console.log(`\n⚠️  WARNING: No files were successfully analyzed!`)
      console.log(`   This could mean:`)
      console.log(`   • Files are corrupted or password-protected`)
      console.log(`   • PDF parsing library has issues`)
      console.log(`   • Files are in a different format`)
      console.log(`   • Files are image-based PDFs (not text-based)`)
    }
    
  } catch (error) {
    console.error('❌ Error during vocabulary analysis:', error)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  analyzeActualVocabularyFiles().catch(console.error)
}
