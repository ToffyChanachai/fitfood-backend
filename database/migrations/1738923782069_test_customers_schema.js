'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TestCustomersSchema extends Schema {
  up () {
    this.create('test_customers', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE') // ความสัมพันธ์กับ users
      table.string('fullname')
      table.string('email').notNullable().unique()
      table.text('address')
      
      table.timestamps()
    })
  }

  down () {
    this.drop('test_customers')
  }
}

module.exports = TestCustomersSchema
