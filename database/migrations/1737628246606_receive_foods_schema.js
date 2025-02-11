'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReceiveFoodsSchema extends Schema {
  up () {
    this.create('receive_foods', (table) => {
      table.increments()
      table.varchar('name').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('receive_foods')
  }
}

module.exports = ReceiveFoodsSchema
