'use strict'

const fs = require('fs')
const path = require('path')

const { createServer } = require('http')
const { exec } = require('child_process')

const fileInput = process.argv[2]
const port = process.env.PORT || 1999

if (fileInput) {
  load(fs.readFileSync(fileInput))
} else {
  const result = []

  process.stdin.resume()
  process.stdin
    .on('error', console.error)
    .on('data', (chunk) => {
      result.push(chunk)
    })
    .on('end', () => {
      load(Buffer.concat(result))
    })
}

const hostPath = path.resolve(__dirname, 'index.html')
const host = fs.readFileSync(hostPath)

function load(seed) {
  // Keeps track of files loaded
  const ledger = []

  // Loads up to two files HTML and JS before shutting down
  const server = createServer(({ url }, res) => {
    // Figure out content type by looking at file extension
    let content = host
    let contentType = 'html'

    if (url.includes('.js')) {
      content = seed
      contentType = 'javascript'
    }

    res.writeHead(200, {
      'Connection': 'close',
      'Content-Length': Buffer.byteLength(content),
      'Content-Type': `text/${contentType}`
    })

    // Save url just passed in, quit once corresponding
    // HTML host and input JS have been served
    res.end(content, () => {
      ledger.push(url)

      if (ledger.length >= 2) {
        server.close()
      }
    })
  })

  // Start listening, attempt to open host HTML in a browser window based on OS
  server.listen(port, () => {
    let command = 'xdg-open'

    if (process.platform === 'win32') {
      command = 'start'
    }

    if (process.platform === 'darwin') {
      command = 'open'
    }

    exec(`${command} http://localhost:${port}/index.html`, (error) => {
      if (error) {
        console.error(error.message)
      }
    })
  })
}
