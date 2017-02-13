
const http = require("http")
const WebSocket = require("ws")

const port = 3000

const server = http.createServer((req, res) => {
  res.writeHead(200)
  res.end('hello http')
})

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

const verifyClient = origin => { return true }

wsServer = new WebSocket.Server({ server, verifyClient })

// client handling
wsServer.on('connection', client => {
  console.log(dateStr(), client.url, 'connected.')
  client.on('message', message => {
    console.log(dateStr(), client.url, message)
  })
  client.on('close', (reasonCode, description) => {
    console.log(dateStr(), client.url, 'disconnected.')
  })
})

// send data
wsServer.broadcast = data => {
  wsServer.clients.forEach( client => {
    if (client.ReadyState === WebSocket.OPEN) {
      client.send(data)
    }
  })
}
