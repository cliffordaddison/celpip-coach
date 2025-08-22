#!/usr/bin/env node

import { readFile } from 'fs/promises'
import { readdir, stat } from 'fs/promises'
import { join } from 'path'
import pdf from 'pdf-parse'

interface PDFFile {
  name: string
  path: string
  size: number
  pages: number
  textLength: number
  category: string
  subcategory: string
  sampleContent: string[]
}

async function scanAllPDFs() {
  try {
    const rootPath = 'C:\\Users\\PC\\Documents\\Clifford Addison - PR\\CELPIP'
    console.log('🔍 COMPREHENSIVE PDF SCANNER - Finding ALL PDFs in every folder...\n')
    console.log(`Root path: ${rootPath}\n`)
    
    const allPDFs: PDFFile[] = []
    const categories = new Map<string, number>()
    
    // Recursively scan all directories
    async function scanDirectory(dirPath: string, category: string, subcategory: string = '') {
      try {
        const items = await readdir(dirPath)
        
        for (const item of items) {
          const fullPath = join(dirPath, item)
          const stats = await stat(fullPath)
          
          if (stats.isDirectory()) {
            // Recursively scan subdirectories
            const newSubcategory = subcategory ? `${subcategory} > ${item}` : item
            await scanDirectory(fullPath, category, newSubcategory)
          } else if (item.toLowerCase().endsWith('.pdf')) {
            // Found a PDF file
            try {
              console.log(`📄 Found PDF: ${fullPath}`)
              
              const dataBuffer = await readFile(fullPath)
              const data = await pdf(dataBuffer)
              
              const pdfFile: PDFFile = {
                name: item,
                path: fullPath,
                size: dataBuffer.length,
                pages: data.numpages,
                textLength: data.text.length,
                category: category,
                subcategory: subcategory,
                sampleContent: data.text.split('\n').filter(line => line.trim().length > 0).slice(0, 3)
              }
              
              allPDFs.push(pdfFile)
              
              // Count by category
              const catKey = `${category}${subcategory ? ` > ${subcategory}` : ''}`
              categories.set(catKey, (categories.get(catKey) || 0) + 1)
              
              console.log(`   ✅ Analyzed: ${data.numpages} pages, ${(dataBuffer.length / 1024).toFixed(1)} KB`)
              
            } catch (error) {
              console.log(`   ❌ Error reading PDF:`, error instanceof Error ? error.message : String(error))
            }
          }
        }
      } catch (error) {
        console.log(`❌ Error scanning directory ${dirPath}:`, error instanceof Error ? error.message : String(error))
      }
    }
    
    // Start scanning from root
    await scanDirectory(rootPath, 'Root')
    
    // Summary
    console.log(`\n${'='.repeat(80)}`)
    console.log(`📊 COMPREHENSIVE PDF SCAN RESULTS:`)
    console.log(`   Total PDFs found: ${allPDFs.length}`)
    console.log(`   Total pages: ${allPDFs.reduce((sum, pdf) => sum + pdf.pages, 0)}`)
    console.log(`   Total size: ${(allPDFs.reduce((sum, pdf) => sum + pdf.size, 0) / 1024 / 1024).toFixed(1)} MB`)
    
    console.log(`\n📁 CATEGORIES FOUND:`)
    categories.forEach((count, category) => {
      console.log(`   • ${category}: ${count} PDFs`)
    })
    
    console.log(`\n📚 DETAILED BREAKDOWN:`)
    allPDFs.forEach((pdf, index) => {
      console.log(`   ${index + 1}. ${pdf.name}`)
      console.log(`      Category: ${pdf.category}${pdf.subcategory ? ` > ${pdf.subcategory}` : ''}`)
      console.log(`      Size: ${(pdf.size / 1024).toFixed(1)} KB, Pages: ${pdf.pages}`)
      console.log(`      Text: ${pdf.textLength.toLocaleString()} characters`)
    })
    
    console.log(`\n💡 SUMMARY - You have:`)
    console.log(`   • ${allPDFs.length} PDF documents`)
    console.log(`   • ${allPDFs.reduce((sum, pdf) => sum + pdf.pages, 0)} total pages`)
    console.log(`   • ${(allPDFs.reduce((sum, pdf) => sum + pdf.size, 0) / 1024 / 1024).toFixed(1)} MB of content`)
    console.log(`   • ${categories.size} different categories`)
    
    console.log(`\n🎯 This is your COMPLETE CELPIP course library!`)
    
    return allPDFs
    
  } catch (error) {
    console.error('❌ Error during comprehensive PDF scan:', error)
    return []
  }
}

if (require.main === module) {
  scanAllPDFs().catch(console.error)
}

export { scanAllPDFs }
