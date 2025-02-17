'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddRoleToUsersSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.string('role').defaultTo('customer');
    })
  }

  down () {
    this.table('users', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddRoleToUsersSchema
