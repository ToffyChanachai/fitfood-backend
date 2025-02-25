'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddUserIdSchema extends Schema {
  up () {
    this.table('customers_hhbs', (table) => {
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
    })
  }

  down () {
    this.table('customers_hhbs', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddUserIdSchema
