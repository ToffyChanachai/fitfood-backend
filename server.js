const { Ignitor } = require('@adonisjs/ignitor')

const port = process.env.PORT || 3333
const host = process.env.HOST || '0.0.0.0';

new Ignitor(require('@adonisjs/fold'))
  .appRoot(__dirname)
  .fireHttpServer()
  .then(() => {
    console.log(`Server started on port ${port}`)
  })
  .catch(console.error)
