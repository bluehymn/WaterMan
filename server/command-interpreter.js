const MongoClient = require('mongodb').MongoClient
const test = require('assert')
const config = require('./config')
/**
 * END 浇水完毕
 */
exports.interpret = function (command, socket) {
  let cName = command.split(':')[0].replace('W+', '')
  let cValue = command.split(':')[1]
  console.log(cName)
  switch (cName) {
    case 'END':
      if (cValue === 'true') {
        socket.write('OK')
      }
      break
    case 'HEART':
      MongoClient.connect(config.url, function (err, db) {
        test.equal(null, err)
        let time = new Date()
        let cHeartLog = db.collection('heartlog')
        cHeartLog.insertOne({time: time}, function (err, result) {
          test.equal(null, err)
          test.equal(1, result.insertedCount)
          // Finish up test
          db.close()
        })
      })
      socket.write('OK')
      break
  }
}
