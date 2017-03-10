const schedule = require('./schedule')
const weather = require('./getweather')
const heartbeat = require('./heartbeat')
// const config = require('./config.js')
const tcpServer = require('./tcp-server.js')
const httpServer = require('./http-server.js')

tcpServer.start()
schedule.creatRule({hour: 14, minute: 36}, () => {
  weather.get()
})
heartbeat.start()
