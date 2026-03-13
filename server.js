import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || '0.0.0.0'
const port = process.env.PORT || 3000

// Clean .next folder if it's corrupted
const cleanNextFolder = () => {
  const nextPath = path.join(__dirname, '.next')
  try {
    if (fs.existsSync(nextPath)) {
      const tracePath = path.join(nextPath, 'trace')
      if (fs.existsSync(tracePath)) {
        try {
          fs.unlinkSync(tracePath)
          console.log('✓ Removed corrupted trace file')
        } catch (err) {
          // Try to remove entire .next folder if trace file is locked
          fs.rmSync(nextPath, { recursive: true, force: true })
          console.log('✓ Removed corrupted .next folder')
        }
      }
    }
  } catch (err) {
    console.warn('⚠ Could not clean .next folder:', err.message)
  }
}

// Clean on startup
cleanNextFolder()

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      await handle(req, res)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
}).catch((err) => {
  console.error('Failed to prepare Next.js app:', err)
  process.exit(1)
})

