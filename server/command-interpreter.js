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
      socket.write('OK')
      MongoClient.connect(config.url, function (err, db) {
        test.equal(null, err)
        let time = new Date()
        let pipes = db.collection('pipes')
        pipes.updateMany({pipe: {$exists: true}}, {$set:{humidity: 1, update: time}})
        .then(function (r) {
          db.close()
        })
      })
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
