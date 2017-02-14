
const fs = require("fs")
const http = require("http")
const path = require("path")
const url = require("url")
const uuid = require("uuid/v4")
const WebSocket = require("ws")

const port = 3000
const timeFreq = 1000
const baseDir = path.join(__dirname, 'assets')

const server = http.createServer((req, res) => {
  const requestURL = url.parse(req.url)
  let fsPath = path.join(baseDir, path.normalize(requestURL.pathname))

  fs.exists(fsPath, exists => {
    if(!exists) {
      res.writeHead(404, {"Content-Type": "text/plain"})
      res.write("404 Not Found\n")
      res.end()
      return
    } else {
      if (fs.statSync(fsPath).isDirectory()) fsPath += '/index.html'
      
      fs.createReadStream(fsPath, "utf8", (err, file) => {
        if (err) {
          res.writeHead(500, {"Content-Type": "text/plain"})
          res.write(err + "\n")
          res.end()
          return res
        } else {
          res.writeHead(200)
          res.write(file, "binary")
          res.end()
          return res
        }
      }).pipe(res)
    }
  })
})

// readable date logging
const dateStr = () => {
  date = new Date()
  str = [
    date.getFullYear()
    ,'-'
    , date.getMonth()
    ,'-'
    , date.getDate()
  ]
  return str.join('')
}

server.listen(port, () => {
  console.log(dateStr(), 'Server listening on port', port)
})

// allow any origin
const verifyClient = origin => { return true }

wsServer = new WebSocket.Server({ server, verifyClient })

// client handling
wsServer.on('connection', client => {
  client.id = uuid()
  console.log(dateStr(), client.id, 'connected.')
  client.on('message', message => {
    console.log(dateStr(), client.id, message)
  })
  client.on('close', (reasonCode, description) => {
    console.log(dateStr(), client.id, 'disconnected.')
  })
})

// send data
wsServer.broadcast = data => {
  wsServer.clients.forEach( client => {
    if (client.readyState === 1) {
      client.send(data)
    }
  })
}

setInterval(() => {
  const int = Math.floor(Math.random() * 10) // meaningful data
  wsServer.broadcast(int)
}, timeFreq)
