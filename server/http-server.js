const express = require('express')
const app = express()
app.use(express.static('./statics'))
app.listen(3000)

app.post('/startwater', function (req, res) {
  console.log('startwater')
  res
  // .type('json')  .status(200)
  .write('{"status":"OK"}')
  // .write('{"status":"OK2"}')
  .end()
})

app.post('/stopwater', function (req, res) {
  console.log('stopwater')
})
