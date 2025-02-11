'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddRoleToUsers extends Schema {
  up () {
    this.table('users', (table) => {
      table.enu('role', ['admin', 'customer']).notNullable().defaultTo('customer')
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('role')
    })
  }
}

module.exports = AddRoleToUsers
