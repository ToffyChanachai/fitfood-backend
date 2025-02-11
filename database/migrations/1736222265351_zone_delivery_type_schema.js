'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ZoneDeliveryTypeSchema extends Schema {
  up () {
    this.create('zone_delivery_types', (table) => {
      table.increments()
      table.varchar('name').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('zone_delivery_types')
  }
}

module.exports = ZoneDeliveryTypeSchema
