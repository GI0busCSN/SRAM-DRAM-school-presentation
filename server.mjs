/**
 * Minimal static file server for the built site (dist/). No dependencies.
 * Port comes from the PORT env variable, default 80.
 */
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'

const ROOT = join(process.cwd(), 'dist')
const PORT = Number(process.env.PORT) || 80

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
}

createServer(async (req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  const safePath = normalize(urlPath).replace(/^([/\\]*\.\.)+/, '')
  let filePath = join(ROOT, safePath)
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403).end()
    return
  }
  if (urlPath.endsWith('/')) {
    filePath = join(filePath, 'index.html')
  }
  try {
    const body = await readFile(filePath)
    res.writeHead(200, { 'Content-Type': TYPES[extname(filePath)] || 'application/octet-stream' })
    res.end(body)
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found')
  }
}).listen(PORT, () => console.log(`Serving dist/ on port ${PORT}`))
