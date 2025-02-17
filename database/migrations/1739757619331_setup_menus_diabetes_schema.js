'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SetupMenusDiabetesSchema extends Schema {
  up () {
    this.create('setup_menus_diabetes', (table) => {
      table.increments()
      table.integer('day_of_week').notNullable();
      table.integer('menu_id').unsigned().references('id').inTable('menus').onDelete('CASCADE')

      table.timestamps()
    })
  }

  down () {
    this.drop('setup_menus_diabetes')
  }
}

module.exports = SetupMenusDiabetesSchema
