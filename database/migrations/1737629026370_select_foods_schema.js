'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SelectFoodsSchema extends Schema {
  up () {
    this.create('select_foods', (table) => {
      table.increments()
      table.varchar('name').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('select_foods')
  }
}

module.exports = SelectFoodsSchema
