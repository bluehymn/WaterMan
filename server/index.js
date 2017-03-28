const schedule = require('./schedule')
const weather = require('./getweather')
const heartbeat = require('./heartbeat')
// const config = require('./config.js')
const tcpServer = require('./tcp-server.js')
const httpServer = require('./http-server.js')

schedule.creatRule({hour: 16, minute: 43}, () => {
  
})

weather.get()
tcpServer.start()
httpServer.start()
// heartbeat.start()
