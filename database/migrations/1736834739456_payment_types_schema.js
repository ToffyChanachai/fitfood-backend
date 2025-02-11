'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PaymentTypesSchema extends Schema {
  up () {
    this.create('payment_types', (table) => {
      table.increments()
      table.varchar('name')
      table.timestamps()
    })
  }

  down () {
    this.drop('payment_types')
  }
}

module.exports = PaymentTypesSchema
