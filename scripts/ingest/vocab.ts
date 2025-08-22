#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'
import { readFile } from 'fs/promises'
import { join } from 'path'

const prisma = new PrismaClient()

interface VocabItem {
  term: string
  partOfSpeech?: string
  definition: string
  synonyms?: string
  antonyms?: string
  collocations?: string
  example?: string
  tags: string[]
  source: string
  difficulty: 'E' | 'M' | 'H'
}

async function extractVocabFromPDF(filePath: string): Promise<VocabItem[]> {
  // This is a simplified extraction - in production you'd use a PDF parser
  // For now, we'll create sample vocabulary based on the file structure
  const fileName = filePath.split('/').pop() || ''
  
  if (fileName.includes('200 Phrasal Verbs')) {
    return [
      {
        term: 'look up',
        partOfSpeech: 'phrasal verb',
        definition: 'to search for information',
        example: 'I need to look up the meaning of this word.',
        tags: ['phrasal verb', 'communication', 'research'],
        source: fileName,
        difficulty: 'M'
      },
      {
        term: 'give up',
        partOfSpeech: 'phrasal verb',
        definition: 'to stop trying or quit',
        example: 'Don\'t give up on your dreams.',
        tags: ['phrasal verb', 'perseverance', 'emotion'],
        source: fileName,
        difficulty: 'M'
      },
      {
        term: 'come across',
        partOfSpeech: 'phrasal verb',
        definition: 'to find or discover by chance',
        example: 'I came across an interesting article yesterday.',
        tags: ['phrasal verb', 'discovery', 'chance'],
        source: fileName,
        difficulty: 'M'
      }
    ]
  }
  
  if (fileName.includes('200 Vocabulary Words')) {
    return [
      {
        term: 'accomplish',
        partOfSpeech: 'verb',
        definition: 'to achieve or complete successfully',
        synonyms: 'achieve, complete, fulfill',
        example: 'She accomplished all her goals for the year.',
        tags: ['achievement', 'success', 'completion'],
        source: fileName,
        difficulty: 'M'
      },
      {
        term: 'beneficial',
        partOfSpeech: 'adjective',
        definition: 'helpful or advantageous',
        synonyms: 'helpful, advantageous, useful',
        example: 'Exercise is beneficial for your health.',
        tags: ['health', 'advantage', 'positive'],
        source: fileName,
        difficulty: 'M'
      },
      {
        term: 'comprehensive',
        partOfSpeech: 'adjective',
        definition: 'complete and thorough',
        synonyms: 'thorough, complete, extensive',
        example: 'The report provides a comprehensive analysis.',
        tags: ['thoroughness', 'completeness', 'analysis'],
        source: fileName,
        difficulty: 'H'
      }
    ]
  }
  
  if (fileName.includes('400 CELPIP Word List')) {
    return [
      {
        term: 'profound',
        partOfSpeech: 'adjective',
        definition: 'very great or intense; deep',
        synonyms: 'deep, intense, significant',
        example: 'The book had a profound impact on my thinking.',
        tags: ['intensity', 'depth', 'significance'],
        source: fileName,
        difficulty: 'H'
      },
      {
        term: 'resilient',
        partOfSpeech: 'adjective',
        definition: 'able to recover quickly from difficulties',
        synonyms: 'tough, adaptable, flexible',
        example: 'She is very resilient in the face of challenges.',
        tags: ['adaptability', 'strength', 'recovery'],
        source: fileName,
        difficulty: 'H'
      }
    ]
  }
  
  if (fileName.includes('250 Best Words')) {
    return [
      {
        term: 'essential',
        partOfSpeech: 'adjective',
        definition: 'absolutely necessary or extremely important',
        synonyms: 'necessary, crucial, vital',
        example: 'Good communication is essential in any relationship.',
        tags: ['necessity', 'importance', 'communication'],
        source: fileName,
        difficulty: 'E'
      },
      {
        term: 'improve',
        partOfSpeech: 'verb',
        definition: 'to make or become better',
        synonyms: 'enhance, better, upgrade',
        example: 'Practice will help you improve your skills.',
        tags: ['progress', 'development', 'betterment'],
        source: fileName,
        difficulty: 'E'
      }
    ]
  }
  
  return []
}

async function importVocab() {
  try {
    const materialsRoot = process.env.PATH_TO_MATERIALS_ROOT
    
    if (!materialsRoot) {
      console.error('PATH_TO_MATERIALS_ROOT environment variable not set')
      process.exit(1)
    }
    
    console.log('Starting vocabulary import...')
    
    // Import vocabulary from different sources
    const vocabSources = [
      '15-Hr Complete Course/All Vocab Lists!/200 Phrasal Verbs (9) (4) (1).pdf',
      '15-Hr Complete Course/All Vocab Lists!/200 Vocabulary Words (7) (3) (1).pdf',
      '15-Hr Complete Course/All Vocab Lists!/Bonus 400 CELPIP Word List (5) (3) (1).pdf',
      '15-Hr Complete Course/All Vocab Lists!/Quick Vocab Guide 250 Best Words (1) (1).pdf'
    ]
    
    let totalImported = 0
    
    for (const source of vocabSources) {
      const fullPath = join(materialsRoot, source)
      console.log(`Processing: ${source}`)
      
      try {
        const vocabItems = await extractVocabFromPDF(fullPath)
        
        for (const item of vocabItems) {
          await prisma.vocab.create({
            data: {
              term: item.term,
              partOfSpeech: item.partOfSpeech,
              definition: item.definition,
              synonyms: item.synonyms,
              antonyms: item.antonyms,
              collocations: item.collocations,
              example: item.example,
              tags: JSON.stringify(item.tags),
              source: item.source,
              difficulty: item.difficulty
            }
          })
          totalImported++
        }
        
        console.log(`  Imported ${vocabItems.length} vocabulary items`)
      } catch (error) {
        console.error(`  Error processing ${source}:`, error)
      }
    }
    
    console.log(`\nVocabulary import complete! Total items imported: ${totalImported}`)
    
  } catch (error) {
    console.error('Error during vocabulary import:', error)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  importVocab().catch(console.error)
}
