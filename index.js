'use strict'

const fs = require('fs')
const path = require('path')

const { createServer } = require('http')
const { exec } = require('child_process')

const html = fs.readFileSync(path.resolve(__dirname, 'index.html'))
const file = process.argv[2]
const port = process.env.PORT || 1999

const boot = (seed) => {
  const ledger = []

  const server = createServer(({ url }, res) => {
    const isjs = url.includes('.js')

    const data = isjs ? seed : html
    const type = isjs ? 'javascript' : 'html'
    const size = data.length

    res.writeHead(200, {
      'Connection': 'close',
      'Content-Length': size,
      'Content-Type': `text/${type}`
    })

    res.end(data, () => {
      ledger.push(url)

      if (ledger.length >= 2) {
        server.close()
      }
    })
  }).listen(port, () => {
    let cmd = 'xdg-open'

    if (process.platform === 'win32') {
      cmd = 'start'
    }

    if (process.platform === 'darwin') {
      cmd = 'open'
    }

    exec(`${cmd} http://localhost:${port}/index.html`, (error) => {
      if (error) {
        console.error(error.message)
      }
    })
  })
}

if (file) {
  boot(fs.readFileSync(file))
} else {
  const body = []

  process.stdin.resume()
  process.stdin
    .on('error', console.error)
    .on('data', (chunk) => {
      body.push(chunk)
    })
    .on('end', () => {
      boot(Buffer.concat(body).toString())
    })
}
