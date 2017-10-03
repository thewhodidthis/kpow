const fs = require('fs')
const { createServer } = require('http')
const path = require('path')
const { exec } = require('child_process')

const file = process.argv[2]
const port = process.env.PORT || 1999

const boot = (input) => {
  const index = fs.readFileSync(path.resolve(__dirname, 'index.html'))
  const store = []

  const server = createServer(({ url }, res) => {
    const isJS = url.includes('.js')

    const data = isJS ? input : index
    const type = isJS ? 'javascript' : 'html'

    res.writeHead(200, {
      'Connection': 'close',
      'Content-Length': data.length,
      'Content-Type': `text/${type}`
    })

    res.end(data, () => {
      store.push(url)

      if (store.length >= 2) {
        server.close()
      }
    })
  }).listen(port, () => {
    exec(`open http://localhost:${port}/index.html`)
  })
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
