const fs = require('fs')
const http = require('http')
const path = require('path')
const { exec } = require('child_process')

const file = process.argv[2]
const port = process.env.PORT || 1821

const boot = (input) => {
  const index = fs.readFileSync(path.resolve(__dirname, 'index.html'))

  http
    .createServer((req, res) => {
      if (req.url.includes('input')) {
        res.setHeader('Content-Type', 'text/javascript')
        res.write(input)
        res.end(process.exit)
      } else {
        res.setHeader('Content-Type', 'text/html')
        res.end(index)
      }
    })
    .on('error', console.error)
    .once('listening', () => { exec(`open http://localhost:${port}`) })
    .listen(port)
}

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
