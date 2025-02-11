'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TestSchema extends Schema {
  up () {
    this.create('tests', (table) => {
      table.increments()
      table.string('name')
      table.string('email').notNullable().unique()  // คอลัมน์อีเมล
      table.text('profile_picture')
      table.timestamps()
    })
  }

  down () {
    this.drop('tests')
  }
}

module.exports = TestSchema
