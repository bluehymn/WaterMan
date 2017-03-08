const https = require('https')
const crypto = require('crypto')
const processdata = require('./processdata')
const MongoClient = require('mongodb').MongoClient
const dbconfig = require('./dbconfig')

const uid = 'U5E3DAEE76'
const key = '48ekkgcaz7yiqcrk'
exports.get = function () {
  let ts = (new Date()).getTime().toString().slice(0, -3)
  let ttl = 300
  let keySHA1 = crypto.createHmac('sha1', key).update('ts=' + ts + '&ttl=' + ttl + '&uid=' + uid).digest()
  console.log(keySHA1)
  let signatrue = encodeURIComponent(Buffer.from(keySHA1).toString('base64'))
  console.log(Buffer.from(keySHA1).toString('base64'))
  console.log(signatrue)
  https.get('https://api.thinkpage.cn/v3/weather/daily.json?location=wuhan&ts=' + ts + '&ttl=' + ttl + '&uid=' + uid + '&sig=' + signatrue + '&start=0&days=3', (res) => {
    res.on('data', (d) => {
      let data = JSON.parse(d.toString())
      console.log(d.toString())
      let daily = data.results[0].daily
      MongoClient.connect(dbconfig.url, function (err, db) {
        console.log('Connected successfully to server')
        console.log(err)
        for (let item of daily) {
          processdata.process(item)
          db.collection('weather').insertOne(item)
        }
      })
    })
  })
}
