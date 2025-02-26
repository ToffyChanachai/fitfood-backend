'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddDeliverySchema extends Schema {
  up () {
    this.table('sale_records_hhbs', (table) => {
      table.text('delivery_round')
      table.text('deliver')
      table.text('delivery_zone')
        })
  }

  down () {
    this.table('sale_records_hhbs', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddDeliverySchema
