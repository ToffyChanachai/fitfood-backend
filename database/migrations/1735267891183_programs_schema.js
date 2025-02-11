'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProgramsSchema extends Schema {
  up () {
    this.create('programs', (table) => {
      table.increments();
      table.varchar('name').notNullable();
      table.integer('promotion_type_id').unsigned().references('id').inTable('promotion_types').onDelete('CASCADE')
      table.timestamps();
    });
  }

  down () {
    this.drop('programs')
  }
}

module.exports = ProgramsSchema
