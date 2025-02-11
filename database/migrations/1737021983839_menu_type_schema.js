'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MenuTypeSchema extends Schema {
  up () {
    this.create('menu_types', (table) => {
      table.increments()
      table.varchar('name').unique().notNullable() 
      table.timestamps()
    })
  }

  down () {
    this.drop('menu_types')
  }
}

module.exports = MenuTypeSchema
