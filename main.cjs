"use strict"

const process = require("process")
const fs = require("fs")
const path = require("path")
const { createServer } = require("http")
const { exec } = require("child_process")

const port = process.env.PORT || 1999
const [, , ...args] = process.argv

const c = args.map(a => a === "--command" ? "-c" : a).indexOf("-c")
const open = c >= 0 ? args[c + 1] : "open"

if (process.stdin.isTTY) {
  const [seed] = args.filter((_, i) => i !== c && i !== args.indexOf(open))

  if (seed) {
    load(fs.readFileSync(seed))
  }
} else {
  const data = []

  // Switch to "old" readable stream mode
  process.stdin.resume()
  process.stdin
    .on("error", console.error)
    .on("data", (chunk) => {
      data.push(chunk)
    })
    .on("end", () => {
      load(Buffer.concat(data))
    })
}

function load(seed = "") {
  const hostPath = path.resolve(__dirname, "index.html")
  const host = fs.readFileSync(hostPath)

  // Loads up HTML and JS before shutting down
  const server = createServer(({ url }, res) => {
    let content = host
    let contentType = "html"

    if (url.includes(".js")) {
      content = seed
      contentType = "javascript"
    }

    res.writeHead(200, {
      "Connection": "close",
      "Content-Length": Buffer.byteLength(content),
      "Content-Type": `text/${contentType}`,
    })

    res.end(content, () => {
      // OK quit
      if (contentType === "javascript") {
        server.close()
      }
    })
  })

  // Start listening, attempt to open host HTML in a browser window based on `-c`
  server.listen(port, () => {
    exec(`${open} http://localhost:${port}/index.html`, (e) => {
      if (e) {
        console.error(e.message)
        server.close()
      }
    })
  })
}
