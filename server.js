'use strict'

const { Ignitor } = require('@adonisjs/ignitor')
const http = require('http')

// เริ่มต้น AdonisJS application
new Ignitor(require('@adonisjs/fold'))
  .appRoot(__dirname)
  .fireHttpServer()  // เริ่ม HTTP server โดยตรง
  .catch(console.error)
