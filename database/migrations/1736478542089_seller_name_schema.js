'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SellerNameSchema extends Schema {
  up () {
    this.create('seller_names', (table) => {
      table.increments()
      table.varchar('name').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('seller_names')
  }
}

module.exports = SellerNameSchema
