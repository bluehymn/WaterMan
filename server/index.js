const server = require('net').createServer()
const schedule = require('./schedule')
const weather = require('./getweather')

var port = 8769
server.on('listening', function () {
  console.log('Server is listening on port', port)
})
server.on('connection', function (socket) {
  console.log('log: Server has a new connection')
  socket.on('data', function (data) {
    console.log(data.toString())
    this.setEncoding('utf8')
    this.write('bbbbbb')
  })
  // socket.end()
  // server.close()
})
server.on('close', function () {
  console.log('Server is now closed')
})
server.on('error', function (err) {
  console.log('Error occurred:', err.message)
})
server.listen(port)
schedule.creatRule({hour: 15, minute: 28}, () => {
  weather.get()
})
