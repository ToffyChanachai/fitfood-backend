'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddDeliveryCustomerSchema extends Schema {
  up () {
    this.table('customers_hhbs', (table) => {
      table.text('delivery_round')
      table.text('deliver')
      table.text('delivery_zone')    })
  }

  down () {
    this.table('customers_hhbs', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddDeliveryCustomerSchema
