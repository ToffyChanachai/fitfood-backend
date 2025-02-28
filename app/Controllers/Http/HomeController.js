'use strict'

class HomeController {
    async index ({ request, response }) {
      return response.send('Hello World!')
    }
  }

module.exports = HomeController
