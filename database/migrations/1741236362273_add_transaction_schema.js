'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddTransactionSchema extends Schema {
  up () {
    this.table('sale_records_hhbs', (table) => {
      table.string('transaction').notNullable().unique()
        })
  }

  down () {
    this.table('sale_records_hhbs', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddTransactionSchema
