// 'use strict'
// /** @typedef {import('@adonisjs/framework/src/Request')} Request */
// /** @typedef {import('@adonisjs/framework/src/Response')} Response */
// /** @typedef {import('@adonisjs/framework/src/View')} View */

// class Role {
//   /**
//    * @param {object} ctx
//    * @param {Request} ctx.request
//    * @param {Function} next
//    */
//   async handle ({ request }, next) {
//     // call next to advance the request
//     await next()
//   }
// }

// module.exports = Role

'use strict'

class Role {
  async handle({ auth, response }, next, allowedRoles) {
    try {
      const user = await auth.getUser()

      if (!allowedRoles.includes(user.role)) {
        return response.unauthorized({ message: 'Access denied' })
      }

      await next()
    } catch (error) {
      return response.unauthorized({ message: 'User not authenticated' })
    }
  }
}

module.exports = Role
