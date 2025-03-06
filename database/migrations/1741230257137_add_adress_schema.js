'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddAdressSchema extends Schema {
  up () {
    this.table('orders_hhbs', (table) => {
      table.text('delivery_round')
      table.text('deliver')
      table.text('delivery_zone')
      table.text('delivery_address').nullable();
    })
  }

  down () {
    this.table('orders_hhbs', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddAdressSchema
