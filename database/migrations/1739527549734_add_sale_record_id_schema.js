'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddSaleRecordIdSchema extends Schema {
  up () {
    this.table('orders', (table) => {
      table.integer("sale_record_id").unsigned().references("id").inTable("sale_records_affs").nullable();
        })
  }

  down () {
    this.table('orders', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddSaleRecordIdSchema
