const fs = require('fs')
const path = require('path')

function findFiles(dir, callback) {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const fullPath = path.join(dir, file)
    if (fs.statSync(fullPath).isDirectory()) {
      findFiles(fullPath, callback)
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      callback(fullPath)
    }
  }
}

findFiles(path.join(__dirname, 'src'), (file) => {
  let content = fs.readFileSync(file, 'utf8')
  let changed = false
  
  // Replace direct process.env.API_KEY || ""
  if (content.includes('"x-api-key": process.env.API_KEY || ""')) {
    content = content.replace(/"x-api-key": process\.env\.API_KEY \|\| ""/g, '"x-api-key": getApiKeyHeader()')
    changed = true
  }

  // Replace API_KEY || ""
  if (content.includes('"x-api-key": API_KEY || ""')) {
    content = content.replace(/"x-api-key": API_KEY \|\| ""/g, '"x-api-key": getApiKeyHeader()')
    changed = true
  }

  if (changed) {
    // Add import if not exists
    if (!content.includes('getApiKeyHeader')) {
       // This is tricky, we need to add import { getApiKeyHeader } from "@/lib/env"
       // We'll just add it after imports or at the top.
    }
    // Better way:
    if (!content.includes('import { getApiKeyHeader }')) {
      content = 'import { getApiKeyHeader } from "@/lib/env"\n' + content
    }
    
    fs.writeFileSync(file, content)
    console.log(`Updated ${file}`)
  }
})
