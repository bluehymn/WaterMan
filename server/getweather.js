const MongoClient = require('mongodb').MongoClient
const test = require('assert')
const config = require('./config')
const https = require('https')
const crypto = require('crypto')
const processdata = require('./processdata')
const uid = 'U5E3DAEE76'
const key = '48ekkgcaz7yiqcrk'

exports.get = function () {
  let ts = (new Date()).getTime().toString().slice(0, -3)
  let ttl = 300
  let keySHA1 = crypto.createHmac('sha1', key).update('ts=' + ts + '&ttl=' + ttl + '&uid=' + uid).digest()
  // console.log(keySHA1)
  let signatrue = encodeURIComponent(Buffer.from(keySHA1).toString('base64'))
  // console.log(Buffer.from(keySHA1).toString('base64'))
  // console.log(signatrue)
  // 文档地址 http://www.thinkpage.cn/doc
  https.get('https://api.thinkpage.cn/v3/weather/daily.json?location=wuhan&ts=' + ts + '&ttl=' + ttl + '&uid=' + uid + '&sig=' + signatrue + '&start=0&days=3', (res) => {
    res.on('data', (d) => {
      let data = JSON.parse(d.toString())
      let daily = data.results[0].daily
      processdata.process(daily)
      MongoClient.connect(config.url, function (err, db) {
        test.equal(null, err)
        let cWeather = db.collection('weather')
        for (let item of daily) {
          let time = new Date()
          cWeather.insertOne(Object.assign(item, {time: time}))
        }
      })
    })
  })
}
