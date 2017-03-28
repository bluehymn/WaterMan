const net = require('net')
const MongoClient = require('mongodb').MongoClient
const test = require('assert')
const config = require('./config')

exports.start = function () {
  let identifier = 8 // 应答符
  let switcher = true // 心跳控制开关
  function beat () {
    if (switcher) {
      switcher = false
      let acknowledge = false
      // 发送心跳包
      const client = net.createConnection({port: config.mcuPort, host: config.mcuAddress}, () => {
        identifier = identifier ? --identifier : 8
        client.write('W+HEART:' + identifier)
        // 2s后无应答 记录应答失败到数据库
        setTimeout(() => {
          if (!acknowledge) {
            MongoClient.connect(config.url, function (err, db) {
              test.equal(null, err)
              let time = new Date()
              let cHeartLog = db.collection('heartlog')
              cHeartLog.insertOne({time: time, status: 'failed'}, function (err, result) {
                test.equal(null, err)
                test.equal(1, result.insertedCount)
                // Finish up test
                db.close()
              })
            })
            console.log('无应答')
            client.write('OK')
            client.end()
          }
          switcher = true
        }, 2000)
      })
      client.on('data', (data) => {
        console.log(data.toString())
        acknowledge = true
        client.end()
      })
      client.on('end', () => {
        console.log('disconnected from server')
      })
    }
    setTimeout(beat, 5000)
  }
  beat()
}