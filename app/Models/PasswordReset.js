'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class PasswordReset extends Model {
    static get table() {
        return 'password_resets'
      }
}

module.exports = PasswordReset
