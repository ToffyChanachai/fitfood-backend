'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DeliveryRoundSchema extends Schema {
  up () {
    this.create('delivery_rounds', (table) => {
      table.increments()
      table.varchar('name').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('delivery_rounds')
  }
}

module.exports = DeliveryRoundSchema
