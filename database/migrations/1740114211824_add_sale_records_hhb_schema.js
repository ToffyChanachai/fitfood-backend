'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddSaleRecordsHhbSchema extends Schema {
  up () {
    this.table('sale_records_hhbs', (table) => {
      table.integer('free_credit').defaultTo(0);
      table.integer('credit').defaultTo(0);
      table.text('other_promotion_detial');
    })
  }

  down () {
    this.table('sale_records_hhbs', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddSaleRecordsHhbSchema
