
// const MongoClient = require('mongodb').MongoClient
// const assert = require('assert')
const f = require('util').format
const user = encodeURIComponent('bluehymn')
const password = encodeURIComponent('123456')
const authMechanism = 'SCRAM-SHA-1'
const dbname = 'water_system'
exports.url = f('mongodb://%s:%s@192.168.10.254:27017/%s?authMechanism=%s', user, password, dbname, authMechanism)
// let url = 'mongodb://bluehymn:123456@192.168.10.254:27017/?authMechanism=SCRAM-SHA-1&authSource=water_system'
// MongoClient.connect(url, function (err, db) {
//   assert.equal(null, err)
//   console.log('Connected successfully to server')
// })
