#!/usr/bin/env node

const fs = require('fs')
const http = require('http')
const { exec } = require('child_process')

const file = process.argv[2]
const port = process.env.PORT || 1821

if (file) {
  boot(fs.readFileSync(file))
} else {
  const data = []

  process.stdin.resume()
  process.stdin
    .on('error', console.error)
    .on('data', (chunk) => {
      data.push(chunk)
    })
    .on('end', () => {
      boot(Buffer.concat(data).toString())
    })
}

function boot(input) {
  const index = fs.readFileSync(__dirname + '/index.html')

  http.createServer((req, res) => {
    if (req.url === '/input.js') {
      res.setHeader('content-type', 'text/javascript')
      res.on('finish', process.exit)
      res.end(input)
    } else {
      res.setHeader('content-type', 'text/html')
      res.end(index)
    }
  })
  .on('error', console.error)
  .on('listening', () => {
    exec(`open http://localhost:${port}`)
  })
  .listen(port)
}
