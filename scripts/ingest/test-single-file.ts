#!/usr/bin/env node

import { readFile } from 'fs/promises'
import pdf from 'pdf-parse'

async function testSingleFile() {
  try {
    const filePath = 'C:\\Users\\PC\\Documents\\Clifford Addison - PR\\CELPIP\\15-Hr Complete Course\\Class 2_ Vocabulary\\Vocab Lists\\200 Vocabulary Words (7) (3) (1) (3).pdf'
    
    console.log('🔍 Testing PDF parsing on a single file...')
    console.log(`File: ${filePath}`)
    
    // Check if file exists
    const fs = require('fs')
    if (!fs.existsSync(filePath)) {
      console.log('❌ File does not exist!')
      return
    }
    
    console.log('✅ File exists, attempting to read...')
    
    const dataBuffer = await readFile(filePath)
    console.log(`✅ File read successfully, size: ${(dataBuffer.length / 1024).toFixed(1)} KB`)
    
    const data = await pdf(dataBuffer)
    console.log(`✅ PDF parsed successfully!`)
    console.log(`   Pages: ${data.numpages}`)
    console.log(`   Text length: ${data.text.length} characters`)
    
    // Show first few lines
    const lines = data.text.split('\n').filter(line => line.trim().length > 0)
    console.log(`\n📝 First 10 lines of content:`)
    lines.slice(0, 10).forEach((line, index) => {
      console.log(`   ${index + 1}. ${line.trim().substring(0, 80)}${line.length > 80 ? '...' : ''}`)
    })
    
    // Count potential vocabulary items
    const vocabCount = data.text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g)?.length || 0
    console.log(`\n📊 Potential vocabulary items found: ${vocabCount}`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

if (require.main === module) {
  testSingleFile().catch(console.error)
}
