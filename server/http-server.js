const express = require('express')
const app = express()
const net = require('net')
const config = require('./config')

exports.start = function () {
  app.post('/startwater', function (req, res) {
    console.log('startwater')
    const client = net.createConnection({port: config.mcuPort, host: config.mcuAddress}, () => {

    })
    client.on('data', (data) => {
      console.log(data.toString())
      client.end()
    })
    client.on('end', () => {
      console.log('disconnected from server')
    })

    res
    // .type('json')  .status(200)
    .write('{"status":"OK"}')
    // .write('{"status":"OK2"}')
    .end()
  })

  app.post('/stopwater', function (req, res) {
    console.log('stopwater')
  })
  app.use(express.static('./statics'))
  app.listen(3000)
}
