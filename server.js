'use strict'

const { Ignitor } = require('@adonisjs/ignitor')
const http = require('http')
const server = http.createServer(new Ignitor(require('@adonisjs/fold')).app())

// รับค่าพอร์ตจากตัวแปรสภาพแวดล้อม หรือใช้พอร์ต 3333
const port = process.env.PORT || 3333

// เริ่มต้นเซิร์ฟเวอร์ที่พอร์ตที่กำหนด
server.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
