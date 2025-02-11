'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddFreeSumSchema extends Schema {
  up () {
    this.table('sale_records_affs', (table) => {
      table.integer("free_mad").defaultTo(0);

      table.integer("free_dessert").defaultTo(0);
      table.integer("free_brittles").defaultTo(0);
      table.integer("free_energy_balls").defaultTo(0);
      table.integer("free_dressing").defaultTo(0);
      table.integer("free_yoghurt").defaultTo(0);
      table.integer("free_granola").defaultTo(0);       })
  }

  down () {
    this.table('sale_records_affs', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddFreeSumSchema
