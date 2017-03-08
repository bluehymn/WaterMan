const weatherWeight = 0.3
const temperatureWeight = 0.7
const wControlVal = [1, 0.8, 0.25, 0]
const tControlVal = [1, 0.8, 0.6, 0.4, 0.2, 0]
const tLevelRange = [[33, 45], [30, 33], [25, 30], [20, 25], [15, 20], [0, 15]]

const Sunny = [0, 1, 2, 3, 5, 6]
const Cloudy = [4, 7, 8, 30]
const Overcast = [9, 10]
const Rain = [11, 12, 13, 14, 15, 16, 17, 18]

exports.process = function (weather) {
  let wea = parseInt(weather.code_day)
  let temp = parseInt(weather.high)
  let wLevel
  let tLevel
  let waterVolume

  if (~Sunny.indexOf(wea)){
    wLevel = 0
  } else if (~Cloudy.indexOf(wea)) {
    wLevel = 1
  } else if (~Overcast.indexOf(wea)) {
    wLevel = 2
  } else if (~Rain.indexOf(wea)) {
    wLevel = 3
  } else {
    wLevel = 2
  }

  for (let i = 0; i < tControlVal.length; i ++) {
    if (temp > tLevelRange[i][0] && temp < tLevelRange[i][1]) {
      tLevel = i
      break
    }
  }
  waterVolume = (weatherWeight * wControlVal[wLevel]) + (temperatureWeight * tControlVal[tLevel])
  waterVolume = waterVolume.toFixed(2)
  console.log(weather.date + '，天气' + weather.text_day + '，气温' + weather.high + '℃，浇水值：' + waterVolume)
}
