'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddCustomerIdSchema extends Schema {
  up () {
    this.table('orders', (table) => {
      table.integer('customer_id').unsigned().references('id').inTable('customers').onDelete('CASCADE')
        })
  }

  down () {
    this.table('orders', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddCustomerIdSchema
