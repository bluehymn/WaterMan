// DB配置
const f = require('util').format
const user = encodeURIComponent('bluehymn')
const password = encodeURIComponent('123456')
const authMechanism = 'SCRAM-SHA-1'
const dbname = 'water_system'
exports.url = f('mongodb://%s:%s@192.168.10.254:27017/%s?authMechanism=%s', user, password, dbname, authMechanism)

// server配置
exports.server = {
  tcpPort: 8769,
  httpPort: 80
}   

// 设备网络地址配置
exports.mcuAddress = '192.168.10.249'
exports.mcuPort = 8769

// 水流时间配置
exports.pipes = {}
