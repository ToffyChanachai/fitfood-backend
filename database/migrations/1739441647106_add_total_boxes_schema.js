'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddTotalBoxesSchema extends Schema {
  up () {
    this.table('sale_records_affs', (table) => {
      table.integer('total_boxes').defaultTo(0);
    })
  }

  down () {
    this.table('sale_records_affs', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddTotalBoxesSchema
