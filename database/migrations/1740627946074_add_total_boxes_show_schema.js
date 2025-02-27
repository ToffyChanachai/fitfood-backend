'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddTotalBoxesShowSchema extends Schema {
  up () {
    this.table('sale_records_hhbs', (table) => {
      table.integer('total_boxes_show').defaultTo(0);
    })
  }

  down () {
    this.table('sale_records_hhbs', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddTotalBoxesShowSchema
