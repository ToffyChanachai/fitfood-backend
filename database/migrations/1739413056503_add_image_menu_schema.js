'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddImageMenuSchema extends Schema {
  up () {
    this.table('menus', (table) => {
      table.varchar("image");    })
  }

  down () {
    this.table('menus', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddImageMenuSchema
