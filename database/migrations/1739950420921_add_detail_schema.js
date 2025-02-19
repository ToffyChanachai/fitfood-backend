'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddDetailSchema extends Schema {
  up () {
    this.table('customers', (table) => {
      table.text('food_allergies_detail')
    })
  }

  down () {
    this.table('customers', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddDetailSchema
