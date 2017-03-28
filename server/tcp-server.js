const tcpServer = require('net').createServer()
const comInter = require('./command-interpreter')
const config = require('./config.js')

tcpServer.on('listening', function () {
  console.log('TCPServer is listening on port', config.server.tcpPort)
})
tcpServer.on('connection', function (socket) {
  console.log('tcp from ' + socket.address().address)
  socket.on('data', function (data) {
    data = data.toString()
    this.setEncoding('utf8')
    comInter.interpret(data, socket)
    socket.end()
  })
  // socket.end()
  // server.close()
})
tcpServer.on('close', function () {
  console.log('Server is now closed')
})
tcpServer.on('error', function (err) {
  console.log('Error occurred:', err.message)
})

exports.start = function () {
  tcpServer.listen(config.server.tcpPort)
}
