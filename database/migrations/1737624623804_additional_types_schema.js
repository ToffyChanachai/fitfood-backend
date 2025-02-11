'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AdditionalTypesSchema extends Schema {
  up () {
    this.create('additional_types', (table) => {
      table.increments()
      table.varchar('name').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('additional_types')
  }
}

module.exports = AdditionalTypesSchema
