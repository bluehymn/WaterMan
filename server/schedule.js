const schedule = require('node-schedule')
let rules = []
exports.creatRule = function (data, callback) {
  let rule = new schedule.RecurrenceRule()
  rule.dayOfWeek = [0, new schedule.Range(1, 6)]
  rule.hour = data.hour
  rule.minute = data.minute
  let sch = {
    id: ++rules.length,
    rule: rule,
    job: schedule.scheduleJob(rule, function () {
      console.log('执行任务')
      callback()
    }),
    data: data
  }
  rules.push(sch)
  // sch.job.cancel()
}




