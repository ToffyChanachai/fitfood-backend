'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddPackageStatusSchema extends Schema {
  up () {
    this.table('orders_hhbs', (table) => {
      table.string('package_status').defaultTo('calculate')
        })
  }

  down () {
    this.table('orders_hhbs', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddPackageStatusSchema
