'use strict'

const { Ignitor } = require('@adonisjs/ignitor')
const http = require('http')

// เริ่มต้น AdonisJS application
const app = new Ignitor(require('@adonisjs/fold'))
  .appRoot(__dirname)
  .make()

const server = http.createServer(app.handle())

const port = process.env.PORT || 3333
server.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
