#!/usr/bin/env node

import { readFile } from 'fs/promises'
import { join } from 'path'
import pdf from 'pdf-parse'

interface ExtractedContent {
  text: string
  pages: number
  fileSize: number
  fileName: string
}

export async function parsePDF(filePath: string): Promise<ExtractedContent> {
  try {
    const dataBuffer = await readFile(filePath)
    const data = await pdf(dataBuffer)
    
    return {
      text: data.text,
      pages: data.numpages,
      fileSize: dataBuffer.length,
      fileName: filePath.split('/').pop() || filePath.split('\\').pop() || 'unknown'
    }
  } catch (error) {
    console.error(`Error parsing PDF ${filePath}:`, error)
    return {
      text: '',
      pages: 0,
      fileSize: 0,
      fileName: filePath.split('/').pop() || filePath.split('\\').pop() || 'unknown'
    }
  }
}

export async function extractVocabularyFromPDF(filePath: string): Promise<string[]> {
  try {
    const content = await parsePDF(filePath)
    const lines = content.text.split('\n').filter(line => line.trim().length > 0)
    
    // Look for vocabulary patterns
    const vocabLines: string[] = []
    
    for (const line of lines) {
      const trimmed = line.trim()
      
      // Skip headers, page numbers, etc.
      if (trimmed.length < 3 || trimmed.length > 200) continue
      if (/^\d+$/.test(trimmed)) continue // Just numbers
      if (/^Page \d+/.test(trimmed)) continue // Page numbers
      if (/^[A-Z\s]+$/.test(trimmed)) continue // All caps headers
      
      // Look for vocabulary patterns
      if (trimmed.includes(' - ') || trimmed.includes(':') || trimmed.includes('•')) {
        vocabLines.push(trimmed)
      } else if (/^[a-zA-Z\s]+$/.test(trimmed) && trimmed.length > 5) {
        // Single words or short phrases
        vocabLines.push(trimmed)
      }
    }
    
    return vocabLines
  } catch (error) {
    console.error(`Error extracting vocabulary from ${filePath}:`, error)
    return []
  }
}

export async function extractTemplatesFromPDF(filePath: string): Promise<string[]> {
  try {
    const content = await parsePDF(filePath)
    const lines = content.text.split('\n').filter(line => line.trim().length > 0)
    
    const templateLines: string[] = []
    
    for (const line of lines) {
      const trimmed = line.trim()
      
      // Look for template patterns
      if (trimmed.includes('Dear') || trimmed.includes('Best regards') || 
          trimmed.includes('Introduction') || trimmed.includes('Conclusion') ||
          trimmed.includes('[') && trimmed.includes(']')) {
        templateLines.push(trimmed)
      }
    }
    
    return templateLines
  } catch (error) {
    console.error(`Error extracting templates from ${filePath}:`, error)
    return []
  }
}

export async function extractQuestionsFromPDF(filePath: string): Promise<string[]> {
  try {
    const content = await parsePDF(filePath)
    const lines = content.text.split('\n').filter(line => line.trim().length > 0)
    
    const questionLines: string[] = []
    
    for (const line of lines) {
      const trimmed = line.trim()
      
      // Look for question patterns
      if (trimmed.includes('?') || trimmed.includes('Question') || 
          trimmed.includes('1.') || trimmed.includes('2.') || trimmed.includes('3.') ||
          /^\d+\./.test(trimmed)) {
        questionLines.push(trimmed)
      }
    }
    
    return questionLines
  } catch (error) {
    console.error(`Error extracting questions from ${filePath}:`, error)
    return []
  }
}

export async function analyzePDFContent(filePath: string): Promise<void> {
  try {
    const content = await parsePDF(filePath)
    
    console.log(`\n📄 File: ${content.fileName}`)
    console.log(`   Size: ${(content.fileSize / 1024).toFixed(1)} KB`)
    console.log(`   Pages: ${content.pages}`)
    console.log(`   Text length: ${content.text.length} characters`)
    
    // Show first few lines to understand content structure
    const lines = content.text.split('\n').filter(line => line.trim().length > 0)
    console.log(`   First 5 lines:`)
    lines.slice(0, 5).forEach((line, index) => {
      console.log(`     ${index + 1}. ${line.trim().substring(0, 80)}${line.length > 80 ? '...' : ''}`)
    })
    
    // Look for vocabulary patterns
    const vocabCount = content.text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g)?.length || 0
    console.log(`   Potential vocabulary items: ${vocabCount}`)
    
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error)
  }
}
