'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddDeliverySchema extends Schema {
  up () {
    this.table('orders', (table) => {
      table.text('delivery_round')
      table.text('deliver')
      table.text('delivery_zone')
      table.time('delivery_time').nullable()  
    
    })
  }

  down () {
    this.table('orders', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddDeliverySchema
