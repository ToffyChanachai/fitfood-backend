'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ZoneDeliverySchema extends Schema {
  up () {
    this.create('zone_deliveries', (table) => {
      table.increments()
      table.varchar('name') 
      table.decimal('price', 10, 2)
      table.integer('zone_type_id').unsigned().references('id').inTable('zone_delivery_types')
      table.timestamps()
    })
  }

  down () {
    this.drop('zone_deliveries')
  }
}

module.exports = ZoneDeliverySchema
