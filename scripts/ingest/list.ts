#!/usr/bin/env node

import { readdir, stat } from 'fs/promises'
import { join } from 'path'

interface FileInfo {
  path: string
  name: string
  type: 'pdf' | 'docx' | 'unknown'
  size: number
  category?: 'vocab' | 'qa' | 'template' | 'unknown'
}

async function scanDirectory(dirPath: string): Promise<FileInfo[]> {
  const files: FileInfo[] = []
  
  try {
    const entries = await readdir(dirPath, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name)
      
      if (entry.isDirectory()) {
        // Recursively scan subdirectories
        const subFiles = await scanDirectory(fullPath)
        files.push(...subFiles)
      } else if (entry.isFile()) {
        // Determine file type
        let fileType: 'pdf' | 'docx' | 'unknown' = 'unknown'
        if (entry.name.toLowerCase().endsWith('.pdf')) {
          fileType = 'pdf'
        } else if (entry.name.toLowerCase().endsWith('.docx')) {
          fileType = 'docx'
        }
        
        // Skip if unknown type
        if (fileType === 'unknown') continue
        
        // Get file stats
        const stats = await stat(fullPath)
        
        // Guess category based on filename and path
        let category: 'vocab' | 'qa' | 'template' | 'unknown' = 'unknown'
        const lowerName = entry.name.toLowerCase()
        const lowerPath = fullPath.toLowerCase()
        
        if (lowerName.includes('vocab') || lowerName.includes('word') || lowerName.includes('phrase') || lowerName.includes('idiom')) {
          category = 'vocab'
        } else if (lowerName.includes('test') || lowerName.includes('question') || lowerName.includes('answer') || lowerName.includes('reading') || lowerName.includes('listening')) {
          category = 'qa'
        } else if (lowerName.includes('template') || lowerName.includes('speaking') || lowerName.includes('writing')) {
          category = 'template'
        }
        
        files.push({
          path: fullPath,
          name: entry.name,
          type: fileType,
          size: stats.size,
          category
        })
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error)
  }
  
  return files
}

async function main() {
  const materialsRoot = process.env.PATH_TO_MATERIALS_ROOT
  
  if (!materialsRoot) {
    console.error('PATH_TO_MATERIALS_ROOT environment variable not set')
    process.exit(1)
  }
  
  console.log(`Scanning materials directory: ${materialsRoot}`)
  console.log('=' .repeat(80))
  
  const files = await scanDirectory(materialsRoot)
  
  // Group by category
  const byCategory = files.reduce((acc, file) => {
    const category = file.category || 'unknown'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(file)
    return acc
  }, {} as Record<string, FileInfo[]>)
  
  // Display results
  for (const [category, categoryFiles] of Object.entries(byCategory)) {
    console.log(`\n${category.toUpperCase()} FILES (${categoryFiles.length}):`)
    console.log('-'.repeat(40))
    
    categoryFiles.forEach(file => {
      const sizeKB = (file.size / 1024).toFixed(1)
      console.log(`${file.name.padEnd(50)} ${sizeKB.padStart(8)} KB`)
    })
  }
  
  console.log('\n' + '='.repeat(80))
  console.log(`Total files found: ${files.length}`)
  
  // Summary by type
  const byType = files.reduce((acc, file) => {
    acc[file.type] = (acc[file.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  console.log('\nBy file type:')
  Object.entries(byType).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`)
  })
}

if (require.main === module) {
  main().catch(console.error)
}
