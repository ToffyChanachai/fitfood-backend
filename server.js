'use strict'

const { Ignitor } = require('@adonisjs/ignitor')
const http = require('http')

// ใช้พอร์ตที่กำหนดในตัวแปร environment ของ Render
const port = process.env.PORT || 3333

// เริ่มต้น AdonisJS application
new Ignitor(require('@adonisjs/fold'))
  .appRoot(__dirname)
  .fireHttpServer()
  .catch(console.error)
  .then(() => {
    // บันทึกให้แสดงเมื่อ server เริ่มต้น
    console.log(`Server started on port ${port}`)
  })
