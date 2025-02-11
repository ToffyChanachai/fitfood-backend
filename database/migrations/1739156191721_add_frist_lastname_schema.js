'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddFristLastnameSchema extends Schema {
  up () {
    this.table("users", (table) => {
      table.varchar('firstname');   
      table.varchar('lastname');       
    });
  }

  down () {
    this.table('users', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddFristLastnameSchema
