'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddUserSchema extends Schema {
  up () {
    this.table('customers', (table) => {
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE') // ความสัมพันธ์กับ users
    })
  }

  down () {
    this.table('customers', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddUserSchema
