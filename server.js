'use strict'

const { Ignitor } = require('@adonisjs/ignitor')
const http = require('http')

new Ignitor(require('@adonisjs/fold'))
  .appRoot(__dirname)
  .fireHttpServer()
  .then(() => {
    const port = process.env.PORT || 3333  // ใช้พอร์ตจากตัวแปรสภาพแวดล้อม
    http.createServer(app.handle).listen(port, () => {
      console.log(`Server is listening on port ${port}`)
    })
  })
  .catch(console.error)
