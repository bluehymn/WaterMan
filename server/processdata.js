/**********
 * 更新湿度
 * 设定明天是否浇水
 * **********/
const net = require('net')
const MongoClient = require('mongodb').MongoClient
const test = require('assert')
const config = require('./config')

const wconfig = {
  weatherWeight: 0.3,
  temperatureWeight: 0.7,
  wControlVal: [1, 0.8, 0.25, 0.2],
  tControlVal: [1, 0.8, 0.6, 0.4, 0.2, 0.2],
  tLevelRange: [[33, 45], [30, 33], [25, 30], [20, 25], [15, 20], [0, 15]],
  Sunny: [0, 1, 2, 3, 5, 6],
  Cloudy: [4, 7, 8, 30],
  Overcast: [9, 10],
  Rain: [11, 12, 13, 14, 15, 16, 17, 18]
}

exports.process = function (daily) {
  let dateToday = new Date()
  let dateTomorrow = new Date(dateToday.getTime() + 86400000)
  // let today = dateToday.getFullYear() + '-' + (dateToday.getMonth() + 1) + '-' + dateToday.getDate()
  // 今天日期
  let today = dateToday.getFullYear() + '-' + ('0' + (dateToday.getMonth() + 1)).slice(-2) + '-' + ('0' + (dateToday.getDate())).slice(-2)
  // 明天日期
  let tomorrow = dateTomorrow.getFullYear() + '-' + ('0' + (dateTomorrow.getMonth() + 1)).slice(-2) + '-' + ('0' + (dateTomorrow.getDate())).slice(-2)
  let weatherToday
  let weatherTomorrow
  if (daily instanceof Array) {
    daily.forEach((item) => {
      // 今天天气
      if (item.date === today) {
        weatherToday = item
      }
      // 明天天气
      if (item.date === tomorrow) {
        weatherTomorrow = item
      }
    })
  }

  let weaToday = parseFloat(weatherToday.code_day)
  let tempToay = parseFloat(weatherToday.high)
  let weaTomorrow = parseFloat(weatherTomorrow.code_day)
  let tempTomorrow = parseFloat(weatherTomorrow.high)
  let wLevelToday = getWLevel(weaToday)
  let tLevelToday = getTLevel(tempToay)
  let wLevelTomorrow = getWLevel(weaTomorrow)
  let tLevelTomorrow = getTLevel(tempTomorrow)
  let waterVolumeToday
  let waterVolumeTomorrow

  // 根据天气设定浇水量
  function getWLevel (weather) {
    let wLevel
    if (~wconfig.Sunny.indexOf(weather)) {
      wLevel = 0
    } else if (~wconfig.Cloudy.indexOf(weather)) {
      wLevel = 1
    } else if (~wconfig.Overcast.indexOf(weather)) {
      wLevel = 2
    } else if (~wconfig.Rain.indexOf(weather)) {
      wLevel = 3
    } else {
      wLevel = 2
    }
    return wLevel
  }

  // 根据气温设定浇水量
  function getTLevel (temperature) {
    let tLevel
    for (let i = 0; i < wconfig.tControlVal.length; i++) {
      if (temperature > wconfig.tLevelRange[i][0] && temperature <= wconfig.tLevelRange[i][1]) {
        tLevel = i
        break
      }
    }
    return tLevel
  }

  waterVolumeToday = (wconfig.weatherWeight * wconfig.wControlVal[wLevelToday]) + (wconfig.temperatureWeight * wconfig.tControlVal[tLevelToday])
  waterVolumeTomorrow = (wconfig.weatherWeight * wconfig.wControlVal[wLevelTomorrow]) + (wconfig.temperatureWeight * wconfig.tControlVal[tLevelTomorrow])

  MongoClient.connect(config.url, function (err, db) {
    test.equal(null, err)
    let pipes = db.collection('pipes')
    // 查询湿度参数值评估明天是否浇水
    pipes.find().toArray((err, d) => {
      let len = d.length
      let pipesData = []
      test.equal(null, err)

      // 更新今天土壤湿度
      d.forEach((p) => {
        let humidity = parseFloat(p.humidity) - waterVolumeToday
        pipes.updateOne({pipe: p.pipe}, {$set: {humidity: humidity, update: (new Date())}})
        .then(function (r) {
        }, function () {
        })
        pipesData.push({pipe: p.pipe, humidity: humidity})
      })
    })

    pipes.find().toArray((err, d) => {
      test.equal(null, err)
      db.close()
      // 明天是否浇水
      d.forEach((p) => {
        console.log(parseFloat(p.humidity) - waterVolumeTomorrow)
        if (parseFloat(p.humidity) - waterVolumeTomorrow <= 0.3) {
          console.log('pipe' + p.pipe + ' 明天浇两次水')
        } else if (parseFloat(p.humidity) - waterVolumeTomorrow <= 0.6) {
          console.log('pipe' + p.pipe + ' 明天浇一次水')
        } else {
          console.log('pipe' + p.pipe + ' 明天不浇水')
        }
      })
    })
  })
  console.log(weatherTomorrow.date + '，天气' + weatherTomorrow.text_day + '，气温' + weatherTomorrow.high + '℃，浇水值：' + waterVolumeTomorrow)
}
