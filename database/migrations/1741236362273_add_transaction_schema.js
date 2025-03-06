'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddTransactionSchema extends Schema {
  up () {
    this.table('sale_records_affs', (table) => {
      table.string('transaction_ref')
        })
  }

  down () {
    this.table('sale_records_affs', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddTransactionSchema
