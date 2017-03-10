const MongoClient = require('mongodb').MongoClient
const test = require('assert')
const config = require('./config')

const wconfig = {
  weatherWeight: 0.3,
  temperatureWeight: 0.7,
  wControlVal: [1, 0.8, 0.25, 0],
  tControlVal: [1, 0.8, 0.6, 0.4, 0.2, 0],
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
  // 明天日期
  let tomorrow = dateTomorrow.getFullYear() + '-' + ('0' + (dateTomorrow.getMonth() + 1)).slice(-2) + '-' + ('0' + (dateTomorrow.getDate())).slice(-2)
  let weather
  if (daily instanceof Array) {
    daily.forEach((item) => {
      // 找出明天天气
      if (item.date === tomorrow) {
        weather = item
        return false
      }
    })
  }

  let wea = parseFloat(weather.code_day)
  let temp = parseFloat(weather.high)
  let wLevel
  let tLevel
  let waterVolume

  // 根据天气设定浇水量
  if (~wconfig.Sunny.indexOf(wea)) {
    wLevel = 0
  } else if (~wconfig.Cloudy.indexOf(wea)) {
    wLevel = 1
  } else if (~wconfig.Overcast.indexOf(wea)) {
    wLevel = 2
  } else if (~wconfig.Rain.indexOf(wea)) {
    wLevel = 3
  } else {
    wLevel = 2
  }

  // 根据气温设定浇水量
  for (let i = 0; i < wconfig.tControlVal.length; i++) {
    if (temp > wconfig.tLevelRange[i][0] && temp <= wconfig.tLevelRange[i][1]) {
      tLevel = i
      break
    }
  }
  waterVolume = (wconfig.weatherWeight * wconfig.wControlVal[wLevel]) + (wconfig.temperatureWeight * wconfig.tControlVal[tLevel])
  // waterVolume = waterVolume.toFixed(2)
  console.log(waterVolume)
  MongoClient.connect(config.url, function (err, db) {
    test.equal(null, err)
    let pipes = db.collection('pipes')
    // 查询湿度参数值评估明天是否浇水
    pipes.find().toArray((err, d) => {
      d.forEach((p) => {
        if (parseFloat(p.humidity) - waterVolume < 0.6) {
          console.log('pipe' + p.pipe + ' 明天浇水')
        } else {
          console.log('pipe' + p.pipe + ' 明天不浇水')
          pipes.find({'pipe': p.pipe}, {$set:{'humidity':(p.humidity - waterVolume).toString()}})
        }
      })
    })
    db.close()
  })
  console.log(weather.date + '，天气' + weather.text_day + '，气温' + weather.high + '℃，浇水值：' + waterVolume)
}
