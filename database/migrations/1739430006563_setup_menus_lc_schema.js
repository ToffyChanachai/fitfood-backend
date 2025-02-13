'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SetupMenusLcSchema extends Schema {
  up () {
    this.create('setup_menus_lcs', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('setup_menus_lcs')
  }
}

module.exports = SetupMenusLcSchema
