import fs from 'fs'
import path from 'path'

const distDir = './dist'
const htmlPath = path.join(distDir, 'index.html')

let html = fs.readFileSync(htmlPath, 'utf-8')

// Find all asset files in dist/ (except index.html)
const distFiles = fs.readdirSync(distDir).filter(f => f !== 'index.html')
const assetExts = ['.mp4', '.mp3', '.webp', '.svg', '.ico']

const mimeMap = {
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
}

const inlineMap = new Map()

for (const file of distFiles) {
  const ext = path.extname(file).toLowerCase()
  if (!assetExts.includes(ext)) continue

  const fullPath = path.join(distDir, file)
  const data = fs.readFileSync(fullPath)
  const base64 = data.toString('base64')
  const mime = mimeMap[ext] || 'application/octet-stream'
  const dataUri = `data:${mime};base64,${base64}`
  inlineMap.set(file, dataUri)

  const sizeKB = (data.length / 1024).toFixed(0)
  console.log(`  INLINE: ${file} (${sizeKB} KB)`)

  // Delete original file
  fs.unlinkSync(fullPath)
}

// Replace references to these files in the HTML
// This handles: href="./...", src="./...", and JS string references like `./file.mp4`
for (const [file, dataUri] of inlineMap) {
  // Replace in HTML attributes: src="./file" or href="./file"
  const escaped = file.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  html = html.replace(new RegExp(`["']\\.\\/${escaped}["']`, 'g'), `"${dataUri}"`)
  // Also catch template literal backtick references
  html = html.replace(new RegExp(`\`\\.\\/${escaped}\``, 'g'), `\`${dataUri}\``)
  // Catch bare filename references in JS (from import.meta.env.BASE_URL concatenation)
  html = html.replace(new RegExp(`(["'\`])\\s*\\+\\s*["']${escaped}["']`, 'g'), `"${dataUri}"`)
}

// Also handle CSS url() references
const cssUrlRegex = /url\(["']?\.\/([^"')]+)["']?\)/g
let cssMatch
while ((cssMatch = cssUrlRegex.exec(html)) !== null) {
  const filePath = cssMatch[1]
  const dataUri = inlineMap.get(filePath)
  if (dataUri) {
    const escaped = filePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    html = html.replace(
      new RegExp(`url\\(["']?\\.\\/${escaped}["']?\\)`, 'g'),
      `url("${dataUri}")`
    )
  }
}

fs.writeFileSync(htmlPath, html)
const finalSizeMB = (Buffer.byteLength(html) / 1024 / 1024).toFixed(1)
console.log(`\n  Done! Final HTML: ${finalSizeMB} MB`)